import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Testimonials.module.css'

/* ─── Verified badge ─── */
function IconVerified() {
  return (
    <svg className={styles.verified} width="13" height="13" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"/>
    </svg>
  )
}

/* ─── Testimonial data ─── */
const CARDS_FR = [
  { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Sophie Laurent', handle: 'Paris, France', rating: 5, text: 'La Porsche 911 livrée à mon hôtel en moins d\'une heure. Un service d\'une précision absolue, à la hauteur du véhicule.' },
  { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'James Mitchell', handle: 'Londres, UK', rating: 5, text: 'La McLaren était dans un état impeccable à la livraison. Obsidian a redéfini ce que signifie la location premium.' },
  { image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Emma Clarke', handle: 'New York, USA', rating: 5, text: 'Une expérience parfaite du début à la fin. La Ferrari a rendu notre séjour à Monaco absolument inoubliable.' },
  { image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Antoine Bernard', handle: 'Nice, France', rating: 4, text: 'Chaque détail soigné, chaque interaction parfaite. Je reviens à Obsidian à chaque voyage. Incomparable.' },
  { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Claire Fontaine', handle: 'Bordeaux, France', rating: 5, text: 'Le Lamborghini était impeccable. Livraison ponctuelle, retour sans aucune friction. Une vraie marque de luxe.' },
  { image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Marc Duval', handle: 'Lyon, France', rating: 4, text: 'La location de véhicule telle qu\'elle devrait toujours être. Obsidian, c\'est simplement dans une autre catégorie.' },
]

const CARDS_EN = [
  { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Sophie Laurent', handle: 'Paris, France', rating: 5, text: 'The Porsche 911 was delivered to my hotel in under an hour. Absolute precision — every detail matched the car itself.' },
  { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'James Mitchell', handle: 'London, UK', rating: 5, text: 'The McLaren was in perfect condition on delivery. Obsidian has completely redefined what premium car rental means.' },
  { image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Emma Clarke', handle: 'New York, USA', rating: 5, text: 'Flawless from start to finish. The Ferrari made our Monaco trip an experience we will never forget.' },
  { image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Antoine Bernard', handle: 'Nice, France', rating: 4, text: 'Every detail considered, every interaction perfect. I rent exclusively with Obsidian now. Nothing else compares.' },
  { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Claire Fontaine', handle: 'Bordeaux, France', rating: 5, text: 'The Lamborghini was immaculate. On-time delivery, frictionless return. This is what a true luxury brand looks like.' },
  { image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces&auto=format&q=80', name: 'Marc Duval', handle: 'Lyon, France', rating: 4, text: 'Car rental as it should always be. Obsidian operates in a completely different league. Truly exceptional.' },
]

/* ─── Seamless JS marquee track ─── */
function MarqueeTrack({ cards, reverse = false }) {
  const trackRef = useRef(null)
  const posRef = useRef(0)
  const rafRef = useRef(null)
  const pausedRef = useRef(false)
  const SPEED = 0.55 // px per frame

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Wait one frame so the DOM is fully painted and scrollWidth is accurate
    const initRAF = requestAnimationFrame(() => {
      // Track is tripled: [...cards, ...cards, ...cards] — wrap every 1/3
      const setWidth = track.scrollWidth / 3

      // Reverse row starts at one full set so it scrolls right from frame 1
      if (reverse) posRef.current = setWidth

      const tick = () => {
        if (!pausedRef.current) {
          if (reverse) {
            posRef.current -= SPEED
            if (posRef.current <= 0) posRef.current += setWidth
          } else {
            posRef.current += SPEED
            if (posRef.current >= setWidth) posRef.current -= setWidth
          }
          track.style.transform = `translateX(${-posRef.current}px)`
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(initRAF)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reverse])

  return (
    <div
      ref={trackRef}
      className={styles.marqueeTrack}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {[...cards, ...cards, ...cards].map((card, i) => (
        <TestimonialCard key={i} card={card} />
      ))}
    </div>
  )
}

/* ─── Star rating ─── */
function Stars({ rating }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={i < rating ? styles.starFilled : styles.starEmpty}
          width="13" height="13" viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

/* ─── Single card ─── */
function TestimonialCard({ card }) {
  return (
    <div className={styles.card}>
      <Stars rating={card.rating} />
      <p className={styles.cardText}>{card.text}</p>
      <div className={styles.cardHeader}>
        <img className={styles.avatar} src={card.image} alt={card.name} />
        <div className={styles.cardMeta}>
          <div className={styles.cardNameRow}>
            <p className={styles.cardName}>{card.name}</p>
            <IconVerified />
          </div>
          <span className={styles.cardHandle}>{card.handle}</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Section ─── */
export default function Testimonials() {
  const { i18n, t } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const cards = isFr ? CARDS_FR : CARDS_EN

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>{t('nav.testimonials').toUpperCase()}</span>
        <h2 className={styles.title}>
          {isFr ? <>Ce que disent<br />nos membres.</> : <>What our<br />members say.</>}
        </h2>
        <p className={styles.subtitle}>
          {isFr
            ? 'Des centaines de membres nous font confiance pour chaque voyage d\'exception.'
            : 'Hundreds of members trust us for every exceptional journey.'
          }
        </p>
      </div>

      {/* Row 1 — left to right */}
      <div className={styles.marqueeRow}>
        <div className={styles.fadLeft} />
        <MarqueeTrack cards={cards} reverse={false} />
        <div className={styles.fadRight} />
      </div>

      {/* Row 2 — right to left */}
      <div className={styles.marqueeRow}>
        <div className={styles.fadLeft} />
        <MarqueeTrack cards={cards} reverse={true} />
        <div className={styles.fadRight} />
      </div>
    </section>
  )
}
