import { useState, useRef, useEffect } from 'react'
import styles from './StatusDropdown.module.css'

export default function StatusDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = options.find(o => o.value === value) || options[0]

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.trigger} ${styles[value]}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={`${styles.dot} ${styles[`dot_${value}`]}`} />
        <span>{current.label}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.menu}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              <span className={`${styles.dot} ${styles[`dot_${opt.value}`]}`} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
