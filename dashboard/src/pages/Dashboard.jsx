import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Globe } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// ─── Placeholder data (will come from your API in Phase 6) ───────

const weeklyData = [
  { day: 'Mon', threats: 42,  safe: 310 },
  { day: 'Tue', threats: 67,  safe: 289 },
  { day: 'Wed', threats: 38,  safe: 402 },
  { day: 'Thu', threats: 91,  safe: 356 },
  { day: 'Fri', threats: 55,  safe: 421 },
  { day: 'Sat', threats: 28,  safe: 198 },
  { day: 'Sun', threats: 44,  safe: 267 },
]

const categoryData = [
  { name: 'Phishing',  value: 45, color: '#ef4444' },
  { name: 'Malware',   value: 28, color: '#f59e0b' },
  { name: 'Spam',      value: 18, color: '#8b5cf6' },
  { name: 'Safe',      value: 9,  color: '#10b981' },
]

const recentThreats = [
  { url: 'malware-download.ru/payload.exe',   score: 97, category: 'Malware',  time: '2 min ago' },
  { url: 'secure-paypal-login.phishsite.com', score: 94, category: 'Phishing', time: '5 min ago' },
  { url: 'free-iphone-winner.click',          score: 88, category: 'Spam',     time: '11 min ago' },
  { url: 'cryptominer-js.net/mine.js',        score: 82, category: 'Malware',  time: '18 min ago' },
  { url: 'bank-alert-verify.tk',              score: 79, category: 'Phishing', time: '24 min ago' },
]

// ─── Stat Card subcomponent ───────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: 'rgba(16,185,129,0.1)',
            color: '#10b981',
          }}
        >
          {change}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
    </motion.div>
  )
}

// ─── Threat score badge ───────────────────────────────────────────
function ScoreBadge({ score }) {
  const color  = score >= 80 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#10b981'
  const label  = score >= 80 ? 'Critical' : score >= 50 ? 'Warning'  : 'Safe'
  return (
    <span
      className="text-xs font-semibold px-2 py-1 rounded-full"
      style={{ background: `${color}20`, color }}
    >
      {label} {score}
    </span>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────
function Dashboard() {
  return (
    <div className="min-h-screen px-6 pt-28 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-1">Threat Dashboard</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Live overview of URL threat intelligence
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Globe}         label="URLs Scanned Today"  value="2,847"  change="+12%"  color="#3b6bff"  delay={0.0} />
          <StatCard icon={AlertTriangle} label="Threats Detected"    value="365"    change="+8%"   color="#ef4444"  delay={0.1} />
          <StatCard icon={CheckCircle}   label="Safe URLs"           value="2,482"  change="+14%"  color="#10b981"  delay={0.2} />
          <StatCard icon={Clock}         label="Avg Response Time"   value="87ms"   change="-3ms"  color="#8b5cf6"  delay={0.3} />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Area Chart — Weekly Threats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold">Weekly Threat Activity</h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Threats vs Safe URLs over last 7 days
                </p>
              </div>
              <TrendingUp size={18} style={{ color: '#3b6bff' }} />
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
                <Area type="monotone" dataKey="safe"    stroke="#10b981" fill="url(#safeGrad)"   strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#threatGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart — Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-white font-semibold mb-1">Threat Categories</h3>
            <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Breakdown by type
            </p>

            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-2 mt-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.name}</span>
                  </div>
                  <span className="font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Recent Threats Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Recent Threats</h3>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Latest high-risk URLs detected
              </p>
            </div>
            <Shield size={18} style={{ color: '#ef4444' }} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['URL', 'Category', 'Risk Score', 'Detected'].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left font-medium"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentThreats.map((threat, i) => (
                  <motion.tr
                    key={threat.url}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                    className="border-b transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                  >
                    <td className="py-3 pr-4">
                      <span
                        className="font-mono text-xs"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {threat.url}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          color: '#ef4444',
                        }}
                      >
                        {threat.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <ScoreBadge score={threat.score} />
                    </td>
                    <td className="py-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {threat.time}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard