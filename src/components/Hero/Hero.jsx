import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

const SLIDES = [
  {
    id: 0,
    // Desktop : Audi R8 rouge
    desktopUrl: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1920&q=80',
    desktopPos: 'center 55%',
    // Mobile / Tablet : BMW M4
    mobileUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    mobilePos: 'center 50%',
  },
  {
    id: 1,
    // Desktop : Porsche 718 Spyder – route de montagne
    desktopUrl: 'https://images.unsplash.com/photo-1696421472274-b02808f67a57?auto=format&fit=crop&w=1920&q=80',
    desktopPos: 'center 45%',
    // Mobile / Tablet : Ferrari Testarossa nuit rouge
    mobileUrl: 'https://images.unsplash.com/photo-1708516893277-232fb2bfb198?auto=format&fit=crop&w=1200&q=80',
    mobilePos: 'center 60%',
  },
]

export default function Hero() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [textKey, setTextKey] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
      setTextKey(prev => prev + 1)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const rawSlides = t('hero.slides', { returnObjects: true })
  const slides = Array.isArray(rawSlides) ? rawSlides : []
  const slide = slides[current] ?? slides[0] ?? {}

  return (
    <section className={`${styles.hero} ${current === 1 ? styles.heroTop : ''}`}>
      {/* ── Slides background ── */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`${styles.slide} ${idx === current ? styles.slideActive : ''}`}
          style={{
            '--dk-url': `url('${s.desktopUrl}')`,
            '--dk-pos': s.desktopPos,
            '--mb-url': `url('${s.mobileUrl}')`,
            '--mb-pos': s.mobilePos,
          }}
        />
      ))}

      <div className={styles.overlay} />

      <div className={styles.content} key={textKey}>
        <span className={styles.tagline}>{slide.tagline}</span>

        <h1 className={styles.title}>
          {slide.titleLine1}<br />
          <em>{slide.titleLine2}</em>
        </h1>

        <p className={styles.subtitle}>{slide.subtitle}</p>

        <div className={styles.actions}>
          <Link to="/reservation" className={styles.btnPrimary}>
            {t('hero.cta')}
          </Link>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLabel}>SCROLL</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  )
}
