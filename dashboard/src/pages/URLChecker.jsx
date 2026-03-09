import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader,
  Globe,
  Clock,
  Tag,
} from "lucide-react";
import { checkUrl } from "../utils/api";

// Score color + label helper
function getScoreInfo(score) {
  if (score >= 80)
    return {
      color: "#ef4444",
      label: "Critical Threat",
      glow: "glow-red",
      icon: AlertTriangle,
    };
  if (score >= 50)
    return {
      color: "#f59e0b",
      label: "Suspicious",
      glow: "glow-yellow",
      icon: AlertTriangle,
    };
  return {
    color: "#10b981",
    label: "Safe",
    glow: "glow-green",
    icon: CheckCircle,
  };
}

// Circular score meter component
function ScoreMeter({ score }) {
  const { color, label, glow, icon: Icon } = getScoreInfo(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center w-40 h-40 ${glow}`}
      style={{ borderRadius: "50%" }}
    >
      <svg width="160" height="160" className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        {/* Score arc */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Icon size={20} style={{ color }} />
        <span className="text-3xl font-black text-white mt-1">{score}</span>
        <span className="text-xs font-medium" style={{ color }}>
          / 100
        </span>
      </div>
    </div>
  );
}

function URLChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null); // null = no result yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // This will later call your real Azure Functions API
  // For now it simulates a response so you can see the UI working
  const handleCheck = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to check.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // ── REAL API CALL (replaces the simulated one) ────────────────
      const data = await checkUrl(url.trim());
      setResult({
        url: data.url,
        score: data.score,
        category: data.category,
        flags: data.flags,
        source: "ThreatLens Scoring Engine",
        checkedAt: new Date(data.checkedAt).toLocaleTimeString(),
      });
    } catch (err) {
      // Handle errors gracefully — never let the app crash silently
      if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the server. Make sure the backend is running on port 7071.",
        );
      } else {
        setError(
          err.response?.data?.error ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      // finally always runs — whether success or error
      setLoading(false);
    }
  };

  const { color, label } = result ? getScoreInfo(result.score) : {};

  return (
    <div className="min-h-screen px-6 pt-28 pb-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
            style={{
              background: "rgba(59,107,255,0.1)",
              border: "1px solid rgba(59,107,255,0.25)",
              color: "#93b4ff",
            }}
          >
            <Shield size={14} />
            URL Threat Scanner
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Is this URL <span className="gradient-text">safe?</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Paste any URL below and get an instant threat score.
          </p>
        </motion.div>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex gap-3">
            <div
              className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Globe
                size={16}
                style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}
              />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="https://example.com or any suspicious URL..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30"
              />
            </div>
            <button
              onClick={handleCheck}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              style={{
                background: "linear-gradient(135deg, #3b6bff, #2554e8)",
              }}
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Scanning..." : "Scan"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs px-1" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8"
            >
              {/* Score meter + label */}
              <div className="flex flex-col items-center mb-8">
                <ScoreMeter score={result.score} />
                <h2 className="text-2xl font-bold mt-4" style={{ color }}>
                  {label}
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Threat score: {result.score}/100
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {[
                  { icon: Globe, label: "URL", value: result.url },
                  { icon: Tag, label: "Category", value: result.category },
                  { icon: Shield, label: "Data Source", value: result.source },
                  { icon: Clock, label: "Checked At", value: result.checkedAt },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="flex items-start gap-3 px-4 py-3 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <Icon
                        size={15}
                        className="mt-0.5 shrink-0"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      />
                      <div className="min-w-0">
                        <p
                          className="text-xs mb-0.5"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {row.label}
                        </p>
                        <p className="text-sm font-medium text-white break-all">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Flags list — shows WHY the URL got that score */}
              {result.flags && result.flags.length > 0 && (
                <div className="mt-4">
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Detection Reasons:
                  </p>
                  <div className="space-y-1">
                    {result.flags.map((flag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                        style={{
                          background: "rgba(239,68,68,0.07)",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        <span style={{ color: "#ef4444" }}>⚑</span>
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice banner */}
              <div
                className="mt-6 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                {result.score >= 80
                  ? "⚠️ Do NOT visit this URL. It is highly likely to be malicious."
                  : result.score >= 50
                    ? "⚠️ Proceed with caution. This URL shows suspicious patterns."
                    : "✅ This URL appears safe based on current threat intelligence."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default URLChecker;
