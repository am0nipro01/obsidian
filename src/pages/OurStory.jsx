import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getRoutes } from '../utils/routes'
import Footer from '../components/Footer/Footer'
import styles from './OurStory.module.css'

/* ─── Pillar icons ─────────────────────────────────────────────────────────── */

function IconPrecision() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="2"/>
      <circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 3C21 3 13 3 8 8s-5 13-5 13 8 0 13-5 5-13 5-13z" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="3" y1="21" x2="12" y2="12" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function IconBolt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const PILLARS_FR = [
  {
    Icon: IconPrecision,
    title: 'Précision',
    desc: "L'excellence mécanique à chaque détail. De la réponse haptique de nos interfaces à l'aérodynamisme de nos châssis.",
  },
  {
    Icon: IconLeaf,
    title: 'Durabilité',
    desc: "Flotte zéro émission, expérience sans compromis. Nous prouvons que le luxe éthique est la forme supérieure du voyage.",
  },
  {
    Icon: IconBolt,
    title: 'Innovation',
    desc: "Des véhicules autonomes prêts à l'emploi qui apprennent et s'adaptent à votre signature de conduite personnelle.",
  },
]

const PILLARS_EN = [
  {
    Icon: IconPrecision,
    title: 'Precision',
    desc: 'Engineering excellence in every detail. From the haptic response of our interfaces to the aerodynamics of our chassis.',
  },
  {
    Icon: IconLeaf,
    title: 'Sustainability',
    desc: 'Zero-emission fleet, zero-compromise experience. We prove that ethical luxury is the highest form of travel.',
  },
  {
    Icon: IconBolt,
    title: 'Innovation',
    desc: 'Leading the industry with autonomous-ready vehicles that learn and adapt to your personal driving signature.',
  },
]

const TIMELINE_FR = [
  {
    year: '2018',
    title: 'La Genèse',
    desc: 'Fondée dans un garage privé à Stuttgart avec une vision singulière : éliminer le compromis entre puissance et planète.',
    side: 'right',
  },
  {
    year: '2021',
    title: 'Le Prototype X',
    desc: "Notre premier groupe motopropulseur électrique entièrement autonome bat des records d'efficacité lors des essais en Alpes.",
    side: 'left',
  },
  {
    year: '2024',
    title: 'Présence Mondiale',
    desc: "Expansion dans 12 hubs de luxe majeurs à travers le monde, redéfinissant le marché de la location premium avec une flotte 100% électrique.",
    side: 'right',
  },
]

const TIMELINE_EN = [
  {
    year: '2018',
    title: 'The Genesis',
    desc: 'Founded in a private garage in Stuttgart with a singular vision: eliminate the trade-off between power and the planet.',
    side: 'right',
  },
  {
    year: '2021',
    title: 'The Prototype X',
    desc: 'Our first fully autonomous electric powertrain breaks records for efficiency and thermal management during Alpine trials.',
    side: 'left',
  },
  {
    year: '2024',
    title: 'Global Presence',
    desc: "Expansion into 12 major luxury hubs worldwide, redefining the premium rental market with a 100% electric fleet.",
    side: 'right',
  },
]

const STATS_FR = [
  { value: '1.2M', label: 'KM ÉLECTRIQUES' },
  { value: '450t', label: 'CO₂ COMPENSÉ' },
  { value: '100%', label: 'FLOTTE RENOUVELABLE' },
  { value: '12', label: 'HUBS INTERNATIONAUX' },
]

const STATS_EN = [
  { value: '1.2M', label: 'TOTAL ELECTRIC MILES' },
  { value: '450t', label: 'CO₂ OFFSET' },
  { value: '100%', label: 'RENEWABLE ENERGY FLEET' },
  { value: '12', label: 'GLOBAL INNOVATION HUBS' },
]

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function OurStory() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const routes = getRoutes(i18n.language)

  const pillars = isFr ? PILLARS_FR : PILLARS_EN
  const timeline = isFr ? TIMELINE_FR : TIMELINE_EN
  const stats = isFr ? STATS_FR : STATS_EN

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              {isFr
                ? <>Accélérer<br />le luxe durable.</>
                : <>Accelerating<br />Sustainable Luxury.</>}
            </h1>
            <p className={styles.heroSub}>
              {isFr
                ? "L'intersection de la haute performance et de la responsabilité planétaire."
                : 'The intersection of high-performance engineering and planetary responsibility.'}
            </p>
            <a href="/#fleet" className={styles.heroCta}>
              {isFr ? 'Découvrir la Flotte' : 'Discover the Fleet'}
            </a>
          </div>
          <div className={styles.heroImageCol}>
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
              alt={isFr ? 'Véhicule Obsidian' : 'Obsidian Vehicle'}
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className={styles.mission}>
        <div className={styles.container}>
          <span className={styles.tag}>{isFr ? 'NOTRE MISSION' : 'OUR MISSION'}</span>
          <p className={styles.missionText}>
            {isFr
              ? 'Redéfinir la mobilité par la précision technique et le luxe sans précipitation.'
              : 'To redefine mobility through technical precision and unhurried luxury.'}
          </p>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className={styles.pillars}>
        <div className={styles.container}>
          <div className={styles.pillarsGrid}>
            {pillars.map(({ Icon, title, desc }) => (
              <div key={title} className={styles.pillar}>
                <div className={styles.pillarIcon}>
                  <Icon />
                </div>
                <h3 className={styles.pillarTitle}>{title}</h3>
                <p className={styles.pillarDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className={styles.timeline}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            {isFr ? "L'Évolution d'Obsidian" : 'The Evolution of Obsidian'}
          </h2>
          <div className={styles.timelineTrack}>
            <div className={styles.timelineLine} />
            {timeline.map((item) => (
              <div
                key={item.year}
                className={`${styles.timelineItem} ${item.side === 'left' ? styles.timelineLeft : styles.timelineRight}`}
              >
                <div className={styles.timelineContent}>
                  <span className={styles.timelineYear}>{item.year}</span>
                  <h3 className={styles.timelineItemTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
                <div className={styles.timelineDot} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact ── */}
      <section className={styles.impact}>
        <div className={styles.container}>
          <div className={styles.impactLayout}>
            <div className={styles.impactLeft}>
              <h2 className={styles.impactTitle}>
                {isFr ? 'Impact mesuré.' : 'Measured Impact.'}
              </h2>
              <p className={styles.impactDesc}>
                {isFr
                  ? "La transparence est au cœur de notre précision technique. Nous suivons chaque kilomètre et chaque gramme de CO₂ évité pour que notre héritage soit aussi propre que notre design."
                  : "Transparency is the core of our technical precision. We track every mile and every gram of carbon prevented to ensure our legacy is as clean as our design."}
              </p>
              <button className={styles.impactBtn}>
                {isFr ? 'Rapport de durabilité annuel' : 'View Annual Sustainability Report'}
              </button>
            </div>
            <div className={styles.impactRight}>
              <div className={styles.statsGrid}>
                {stats.map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
