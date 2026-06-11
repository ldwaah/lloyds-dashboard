(function () {
  var el = document.getElementById("today-date");
  if (!el) return;

  var now = new Date();
  el.textContent = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
})();
