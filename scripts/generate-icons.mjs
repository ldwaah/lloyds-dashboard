import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createCanvas(size) {
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = 255;
  }

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }

  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function line(x1, y1, x2, y2, stroke) {
    const s = (stroke * size) / 100;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const px = (x + 0.5) / size;
        const py = (y + 0.5) / size;
        const nx = px * 100;
        const ny = py * 100;
        if (distToSegment(nx, ny, x1, y1, x2, y2) <= s / 2) {
          setPixel(x, y, 28, 28, 28);
        }
      }
    }
  }

  function rect(x, y, w, h, stroke, fill = false) {
    const s = (stroke * size) / 100;
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const nx = ((px + 0.5) / size) * 100;
        const ny = ((py + 0.5) / size) * 100;
        const inside =
          nx >= x && nx <= x + w && ny >= y && ny <= y + h;
        const onLeft = inside && nx - x <= s;
        const onRight = inside && x + w - nx <= s;
        const onTop = inside && ny - y <= s;
        const onBottom = inside && y + h - ny <= s;
        if (fill && inside) {
          setPixel(px, py, 28, 28, 28);
        } else if (inside && (onLeft || onRight || onTop || onBottom)) {
          setPixel(px, py, 28, 28, 28);
        }
      }
    }
  }

  function circle(cx, cy, r, stroke) {
    const s = (stroke * size) / 100;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = ((x + 0.5) / size) * 100;
        const ny = ((y + 0.5) / size) * 100;
        const d = Math.hypot(nx - cx, ny - cy);
        if (Math.abs(d - r) <= s / 2) {
          setPixel(x, y, 28, 28, 28);
        }
      }
    }
  }

  function arc(cx, cy, r, start, end, stroke) {
    const s = (stroke * size) / 100;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = ((x + 0.5) / size) * 100;
        const ny = ((y + 0.5) / size) * 100;
        const ang = Math.atan2(ny - cy, nx - cx);
        const d = Math.hypot(nx - cx, ny - cy);
        let a = ang;
        if (a < 0) a += Math.PI * 2;
        let sAng = start;
        let eAng = end;
        if (sAng < 0) sAng += Math.PI * 2;
        if (eAng < 0) eAng += Math.PI * 2;
        const inArc = sAng <= eAng ? a >= sAng && a <= eAng : a >= sAng || a <= eAng;
        if (inArc && Math.abs(d - r) <= s / 2) {
          setPixel(x, y, 28, 28, 28);
        }
      }
    }
  }

  return { line, rect, circle, arc, pixels };
}

function writePng(filePath, size, draw) {
  const canvas = createCanvas(size);
  draw(canvas, size);
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const o = row + 1 + x * 4;
      raw[o] = canvas.pixels[i];
      raw[o + 1] = canvas.pixels[i + 1];
      raw[o + 2] = canvas.pixels[i + 2];
      raw[o + 3] = canvas.pixels[i + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, png);
}

function drawNotebook(c) {
  const s = 2.8;
  c.rect(24, 18, 52, 64, s);
  c.line(34, 18, 34, 82, s * 0.85);
  for (let y = 30; y <= 74; y += 8) {
    c.line(40, y, 68, y, s * 0.55);
  }
  c.circle(34, 28, 2.2, s * 0.7);
  c.circle(34, 44, 2.2, s * 0.7);
  c.circle(34, 60, 2.2, s * 0.7);
}

function drawMonitoring(c) {
  const s = 2.6;
  c.rect(22, 52, 38, 22, s);
  c.rect(28, 58, 26, 4, s * 0.55);
  c.rect(28, 66, 20, 4, s * 0.55);
  c.rect(30, 38, 34, 18, s);
  c.rect(36, 44, 22, 4, s * 0.55);
  c.rect(36, 50, 16, 4, s * 0.55);
  c.circle(62, 34, 14, s);
  c.line(72, 44, 80, 52, s);
  c.line(78, 40, 80, 52, s * 0.85);
  c.line(82, 44, 80, 52, s * 0.85);
}

function generateSet(dir, drawFn) {
  writePng(path.join(dir, "icon-192.png"), 192, drawFn);
  writePng(path.join(dir, "icon-512.png"), 512, drawFn);
}

generateSet(path.join(root, "icons"), drawNotebook);
generateSet(path.join(root, "ks4-monitoring", "icons"), drawMonitoring);

console.log("Generated icons:");
console.log("  icons/icon-192.png, icon-512.png (notebook)");
console.log("  ks4-monitoring/icons/icon-192.png, icon-512.png (database + search)");
