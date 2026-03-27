import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../utils/scrollToSection'
import Hero from '../components/Hero/Hero'
import Fleet from '../components/Fleet/Fleet'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Footer from '../components/Footer/Footer'

export default function Home() {
  const location = useLocation()

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
      <Hero />
      <Fleet />
      <HowItWorks />
      <Footer />
    </main>
  )
}
