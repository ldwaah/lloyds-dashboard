import { useMemo, useState } from 'react'
import './Calendar.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1)
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

type CalendarDay = {
  date: Date
  inCurrentMonth: boolean
}

function buildMonthGrid(viewDate: Date): CalendarDay[] {
  const first = startOfMonth(viewDate)
  const startOffset = first.getDay()
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return {
      date,
      inCurrentMonth: date.getMonth() === viewDate.getMonth(),
    }
  })
}

export default function Calendar() {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const today = useMemo(() => new Date(), [])

  const days = useMemo(() => buildMonthGrid(viewDate), [viewDate])

  return (
    <section className="calendar" aria-label="Month calendar">
      <div className="calendar-toolbar">
        <button
          type="button"
          className="calendar-nav"
          onClick={() => setViewDate((current) => addMonths(current, -1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="calendar-title">{formatMonthYear(viewDate)}</h2>
        <button
          type="button"
          className="calendar-nav"
          onClick={() => setViewDate((current) => addMonths(current, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <button
        type="button"
        className="calendar-today"
        onClick={() => {
          const now = new Date()
          setViewDate(startOfMonth(now))
          setSelectedDate(now)
        }}
      >
        Today
      </button>

      <div className="calendar-weekdays" role="row">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday" role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid" role="grid">
        {days.map(({ date, inCurrentMonth }) => {
          const isToday = isSameDay(date, today)
          const isSelected = isSameDay(date, selectedDate)

          return (
            <button
              key={date.toISOString()}
              type="button"
              role="gridcell"
              className={[
                'calendar-day',
                !inCurrentMonth && 'calendar-day--muted',
                isToday && 'calendar-day--today',
                isSelected && 'calendar-day--selected',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedDate(date)}
              aria-label={date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              aria-selected={isSelected}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </section>
  )
}
