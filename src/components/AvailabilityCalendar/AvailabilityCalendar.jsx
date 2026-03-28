import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './AvailabilityCalendar.module.css'

function IconChevron({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  )
}

// Returns 'YYYY-MM-DD' string in local time (avoids UTC offset issues)
function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseLocalDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// All days between two dates (inclusive), as 'YYYY-MM-DD' strings
function getDaysInRange(start, end) {
  const days = []
  const cur = new Date(start)
  while (cur <= end) {
    days.push(toLocalDateStr(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

export default function AvailabilityCalendar({ vehicleId, pickupDate, returnDate, onChange, isFr }) {
  const today = toLocalDateStr(new Date())

  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth()) // 0-indexed
  const [bookedDays, setBookedDays] = useState(new Set())
  const [hoverDate, setHoverDate] = useState(null)
  const [selecting, setSelecting] = useState(false) // true = waiting for end date

  // Fetch booked ranges for this vehicle
  useEffect(() => {
    if (!vehicleId) return
    supabase
      .from('reservations')
      .select('pickup_date, return_date')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'paid')
      .then(({ data }) => {
        const days = new Set()
        ;(data || []).forEach(({ pickup_date, return_date }) => {
          getDaysInRange(parseLocalDate(pickup_date), parseLocalDate(return_date)).forEach(d => days.add(d))
        })
        setBookedDays(days)
      })
  }, [vehicleId])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // Build calendar grid for a given month
  function buildGrid(year, month) {
    const firstDay = new Date(year, month, 1).getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startOffset = (firstDay + 6) % 7 // make Mon=0
    const cells = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }

  const grid1 = useMemo(() => buildGrid(viewYear, viewMonth), [viewYear, viewMonth])
  const [m2Year, m2Month] = viewMonth === 11 ? [viewYear + 1, 0] : [viewYear, viewMonth + 1]
  const grid2 = useMemo(() => buildGrid(m2Year, m2Month), [m2Year, m2Month])

  const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAYS_FR = ['Lu','Ma','Me','Je','Ve','Sa','Di']
  const DAYS_EN = ['Mo','Tu','We','Th','Fr','Sa','Su']
  const months = isFr ? MONTHS_FR : MONTHS_EN
  const days = isFr ? DAYS_FR : DAYS_EN

  function getDateStr(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function handleDayClick(dateStr) {
    if (bookedDays.has(dateStr) || dateStr < today) return

    if (!selecting || !pickupDate) {
      // Start selection
      onChange(dateStr, '')
      setSelecting(true)
    } else {
      // End selection
      if (dateStr < pickupDate) {
        onChange(dateStr, '')
        setSelecting(true)
        return
      }
      // Check no booked days in range
      const range = getDaysInRange(parseLocalDate(pickupDate), parseLocalDate(dateStr))
      const hasBooked = range.some(d => bookedDays.has(d))
      if (hasBooked) return
      onChange(pickupDate, dateStr)
      setSelecting(false)
    }
  }

  function getDayState(dateStr) {
    const isBooked = bookedDays.has(dateStr)
    const isPast = dateStr < today
    const isStart = dateStr === pickupDate
    const isEnd = dateStr === returnDate
    const effectiveEnd = selecting && hoverDate ? hoverDate : returnDate
    const inRange = pickupDate && effectiveEnd && dateStr > pickupDate && dateStr < effectiveEnd

    if (isBooked) return 'booked'
    if (isPast) return 'past'
    if (isStart) return 'start'
    if (isEnd) return 'end'
    if (inRange) {
      const rangeToCheck = getDaysInRange(parseLocalDate(pickupDate), parseLocalDate(effectiveEnd))
      if (rangeToCheck.some(d => bookedDays.has(d))) return 'default'
      return 'inrange'
    }
    return 'default'
  }

  function renderMonth(year, month, grid) {
    return (
      <div className={styles.month}>
        <div className={styles.monthHeader}>
          <span className={styles.monthLabel}>{months[month]} {year}</span>
        </div>
        <div className={styles.weekRow}>
          {days.map(d => <span key={d} className={styles.weekDay}>{d}</span>)}
        </div>
        <div className={styles.grid}>
          {grid.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />
            const dateStr = getDateStr(year, month, day)
            const state = getDayState(dateStr)
            const isDisabled = state === 'booked' || state === 'past'
            return (
              <button
                key={dateStr}
                className={`${styles.day} ${styles[`day_${state}`]}`}
                onClick={() => handleDayClick(dateStr)}
                onMouseEnter={() => selecting && setHoverDate(dateStr)}
                onMouseLeave={() => selecting && setHoverDate(null)}
                disabled={isDisabled}
                type="button"
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={prevMonth} type="button"><IconChevron dir="left" /></button>
        <button className={styles.navBtn} onClick={nextMonth} type="button"><IconChevron dir="right" /></button>
      </div>
      <div className={styles.months}>
        {renderMonth(viewYear, viewMonth, grid1)}
        {renderMonth(m2Year, m2Month, grid2)}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendAvailable}`} />{isFr ? 'Disponible' : 'Available'}</span>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendBooked}`} />{isFr ? 'Indisponible' : 'Unavailable'}</span>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendSelected}`} />{isFr ? 'Sélectionné' : 'Selected'}</span>
      </div>
    </div>
  )
}
