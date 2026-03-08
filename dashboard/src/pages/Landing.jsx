import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, Zap, Globe, AlertTriangle,
  CheckCircle, ArrowRight, Database, Bell
} from 'lucide-react'

// ─── Animation helper ────────────────────────────────────────────
// fadeUp: slides content up + fades it in when it enters the screen
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

// ─── Data for the Features section ───────────────────────────────
const features = [
  {
    icon: Zap,
    color: '#3b6bff',
    title: 'Real-Time Scoring',
    description:
      'Every URL is analyzed and scored instantly using live threat intelligence feeds from URLhaus and other sources.',
  },
  {
    icon: Database,
    color: '#8b5cf6',
    title: 'Threat Intelligence DB',
    description:
      'Backed by Azure Cosmos DB — a cloud database storing millions of known malicious URLs and risk scores.',
  },
  {
    icon: Bell,
    color: '#06b6d4',
    title: 'Browser Warnings',
    description:
      'Our browser extension silently monitors URLs you visit and alerts you before you land on a dangerous page.',
  },
  {
    icon: Globe,
    color: '#10b981',
    title: 'Global Feed Ingestion',
    description:
      'Automated scheduled jobs pull fresh threat data from around the web, keeping your protection current 24/7.',
  },
]

// ─── Data for the "How It Works" section ─────────────────────────
const steps = [
  { number: '01', title: 'Feed Ingestion',    description: 'Threat data is pulled automatically from URLhaus every hour.' },
  { number: '02', title: 'Scoring Engine',    description: 'Azure Functions analyze each URL and assign a 0–100 risk score.' },
  { number: '03', title: 'Stored Securely',   description: 'Scores and metadata are saved to Azure Cosmos DB instantly.' },
  { number: '04', title: 'You Stay Safe',     description: 'Dashboard and browser extension show you the results in real time.' },
]

// ─── Landing Page Component ───────────────────────────────────────
function Landing() {
  return (
    <div className="overflow-hidden">

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20">

        {/* Background glow blobs — purely decorative */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,107,255,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{
              background: 'rgba(59,107,255,0.1)',
              border: '1px solid rgba(59,107,255,0.3)',
              color: '#93b4ff',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#3b6bff' }}
            />
            Powered by Azure & Real-Time Threat Feeds
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            Detect Threats
            <br />
            <span className="gradient-text">Before They Strike</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            ThreatLens scans and scores URLs using live threat intelligence.
            Know if a link is dangerous before you — or your users — click it.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/check"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #3b6bff, #2554e8)',
                boxShadow: '0 0 30px rgba(59,107,255,0.3)',
              }}
            >
              <Zap size={18} />
              Check a URL Now
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              View Dashboard
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: '1M+',    label: 'URLs Analyzed' },
              { value: '99.2%',  label: 'Detection Rate' },
              { value: '<100ms', label: 'Response Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to stay
              <span className="gradient-text"> protected</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Built on enterprise-grade Azure infrastructure with real-world threat data.
            </p>
          </motion.div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-card p-6 cursor-default"
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feature.color}20` }}
                  >
                    <Icon size={22} style={{ color: feature.color }} />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 flex items-start gap-6"
              >
                {/* Step number */}
                <div
                  className="text-4xl font-black shrink-0 leading-none"
                  style={{ color: 'rgba(59,107,255,0.25)', fontVariantNumeric: 'tabular-nums' }}
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {step.description}
                  </p>
                </div>
                <CheckCircle
                  size={20}
                  className="shrink-0 ml-auto"
                  style={{ color: '#10b981' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION (Bottom)
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center glass-card p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(59,107,255,0.08), rgba(139,92,246,0.08))',
            border: '1px solid rgba(59,107,255,0.2)',
          }}
        >
          <AlertTriangle
            size={40}
            className="mx-auto mb-6"
            style={{ color: '#f59e0b' }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Is that link safe to click?
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Don't take chances. Check any URL instantly with our threat engine.
          </p>
          <Link
            to="/check"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b6bff, #2554e8)',
              boxShadow: '0 0 30px rgba(59,107,255,0.25)',
            }}
          >
            <Shield size={18} />
            Scan a URL — It's Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center text-sm"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        © 2025 ThreatLens. Built with Azure Functions, Cosmos DB & React.
      </footer>
    </div>
  )
}

export default Landing