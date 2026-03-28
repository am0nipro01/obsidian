import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import styles from './AdminChart.module.css'

/* ── Generate realistic fake reservation data ── */
function generateData(days) {
  const result = []
  const now = new Date()

  // Simulate a growing business with realistic patterns
  const baseReservations = [3, 2, 4, 6, 5, 8, 7, 3, 2, 5, 7, 9, 6, 4, 3, 6, 8, 11, 9, 7, 5, 4, 7, 10, 12, 9, 8, 6, 5, 8, 11, 13, 10, 8, 6, 5, 9, 12, 14, 11, 9, 7, 6, 10, 13, 15, 12, 10, 8, 7, 11, 14, 16, 13, 11, 9, 8, 12, 15, 17, 14, 12, 10, 9, 13, 16, 18, 15, 13, 11, 10, 14, 17, 19, 16, 14, 12, 11, 15, 18, 20, 17, 15, 13, 12, 16, 19, 22, 18, 16]

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)

    const dayOfWeek = d.getDay()
    // Weekend boost (Fri=5, Sat=6)
    const weekendMultiplier = dayOfWeek === 5 || dayOfWeek === 6 ? 1.6 : dayOfWeek === 0 ? 1.3 : 1

    const baseIdx = Math.min(i, baseReservations.length - 1)
    const base = baseReservations[baseReservations.length - 1 - baseIdx]
    const reservations = Math.round(base * weekendMultiplier + (Math.random() * 2 - 1))
    const revenue = reservations * (380 + Math.round(Math.random() * 240))

    result.push({
      date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      reservations: Math.max(0, reservations),
      revenue,
    })
  }
  return result
}

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label, isFr }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        {isFr ? 'Réservations' : 'Bookings'} : <strong>{payload[0]?.value}</strong>
      </p>
      <p className={styles.tooltipRevenue}>
        {isFr ? 'Revenus' : 'Revenue'} : <strong>{payload[1]?.value?.toLocaleString()}€</strong>
      </p>
    </div>
  )
}

const PERIODS = [
  { key: '7',  labelFr: '7 jours',   labelEn: 'Last 7 days' },
  { key: '30', labelFr: '30 jours',  labelEn: 'Last 30 days' },
  { key: '90', labelFr: '3 mois',    labelEn: 'Last 3 months' },
]

export default function AdminChart({ isFr }) {
  const [period, setPeriod] = useState('30')

  const data = useMemo(() => generateData(parseInt(period)), [period])

  const totalReservations = data.reduce((s, d) => s + d.reservations, 0)
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)

  // Thin out x-axis labels to avoid crowding
  const tickInterval = period === '7' ? 0 : period === '30' ? 4 : 9

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            {isFr ? 'Activité des réservations' : 'Booking Activity'}
          </h3>
          <p className={styles.subtitle}>
            {isFr
              ? `${totalReservations} réservations · ${totalRevenue.toLocaleString()}€ de revenus`
              : `${totalReservations} bookings · €${totalRevenue.toLocaleString()} revenue`
            }
          </p>
        </div>
        <div className={styles.periods}>
          {PERIODS.map(p => (
            <button
              key={p.key}
              className={`${styles.periodBtn} ${period === p.key ? styles.periodActive : ''}`}
              onClick={() => setPeriod(p.key)}
            >
              {isFr ? p.labelFr : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradReservations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1c50c7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1c50c7" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3e6ae1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3e6ae1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip isFr={isFr} />} />
            <Area
              type="monotone"
              dataKey="reservations"
              stroke="#3e6ae1"
              strokeWidth={2}
              fill="url(#gradReservations)"
              dot={false}
              activeDot={{ r: 4, fill: '#3e6ae1', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
