import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { scrollToSection } from '../utils/scrollToSection'
import Hero from '../components/Hero/Hero'
import Fleet from '../components/Fleet/Fleet'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Testimonials from '../components/Testimonials/Testimonials'
import Newsletter from '../components/Newsletter/Newsletter'
import Footer from '../components/Footer/Footer'
import SEO from '../components/SEO/SEO'
import WelcomeModal from '../components/WelcomeModal/WelcomeModal'

const SCHEMA_FR = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OBSIDIAN',
    url: 'https://obsidian-rental.com',
    logo: 'https://obsidian-rental.com/og-image.jpg',
    description: 'Location de véhicules premium en France — berlines de luxe, SUV et sportives avec service conciergerie.',
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'RentACarBusiness',
    name: 'OBSIDIAN',
    url: 'https://obsidian-rental.com',
    description: 'Location de véhicules premium en France.',
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Credit Card',
  },
]

const SCHEMA_EN = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OBSIDIAN',
    url: 'https://obsidian-rental.com',
    logo: 'https://obsidian-rental.com/og-image.jpg',
    description: 'Premium vehicle rental in France — luxury sedans, SUVs and sports cars with concierge service.',
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'RentACarBusiness',
    name: 'OBSIDIAN',
    url: 'https://obsidian-rental.com',
    description: 'Premium vehicle rental in France.',
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Credit Card',
  },
]

export default function Home() {
  const { i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const location = useLocation()

  // Always start at the top on fresh load / refresh
  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Scroll to section when arriving from another page with state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(sectionId)
        if (el) {
          scrollToSection(sectionId)
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 80)
        }
      }
      // Small delay to let the page fully render before scrolling
      setTimeout(() => tryScroll(), 50)
    }
  }, [location.state])

  // Scroll reveal animations
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <WelcomeModal />
      <SEO
        lang={isFr ? 'fr' : 'en'}

        description={isFr
          ? 'OBSIDIAN — Location de véhicules de luxe en France. Berlines, SUV et sportives avec service conciergerie. Réservation en ligne, livraison à domicile.'
          : 'OBSIDIAN — Premium luxury car rental in France. Sedans, SUVs and sports cars with concierge service. Book online, doorstep delivery.'}
        canonical="/"
        altLang={{ fr: '/', en: '/' }}
        schema={isFr ? SCHEMA_FR : SCHEMA_EN}
      />
      <Hero />
      <Fleet />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}
