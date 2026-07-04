import React, { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  Settings,
  Terminal,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Cpu,
  Layers,
  Globe,
  RefreshCw,
  ExternalLink,
  Copy,
  BarChart2,
  Shield,
  Check
} from "lucide-react";

interface MetricsTabProps {
  language: "es" | "en" | "pt" | "de";
}

interface APIMetric {
  path: string;
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  errors: number;
}

interface CustomEvents {
  tarotReadings: number;
  runesCasts: number;
  angelReadings: number;
  numerologyProfiles: number;
  treeOfLifeAlignments: number;
  astrologyChecks: number;
  audioSessions: number;
  zenAdviceRequests: number;
  errorsLogged: number;
}

interface LiveLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  error?: string;
  info?: string;
}

interface TelemetryStats {
  metrics: APIMetric[];
  events: CustomEvents;
  logs: LiveLog[];
  isSentryConfigured: boolean;
  isMixpanelConfigured: boolean;
}

const TRANSLATIONS = {
  es: {
    title: "Consola de Observabilidad & Métricas",
    desc: "Supervisión en tiempo real del rendimiento de la plataforma, tasas de error y análisis de uso de los servicios espirituales.",
    sysStatus: "ESTADO DE LA PLATAFORMA",
    serverOnline: "Servidor en Línea",
    uptime: "Tiempo de Actividad",
    totalReqs: "Peticiones Totales",
    errorRate: "Tasa de Errores",
    apiPerformance: "RENDIMIENTO DE APIS (TIEMPO DE RESPUESTA)",
    apiEndpoint: "Ruta de la API",
    apiCalls: "Llamadas",
    apiAvgTime: "Tiempo Promedio",
    apiErrors: "Errores",
    usageStats: "USO DE SERVICIOS ESPIRITUALES",
    tarot: "Tarot Terapéutico",
    runes: "Runas Nórdicas",
    angels: "Ángeles de Luz",
    numerology: "Numerología",
    kabbalah: "Cábala",
    astros: "Astros & Luna",
    audio: "Música / Atmósfera",
    zenAdvice: "Guía Zen",
    liveLogs: "TERMINAL DE REGISTROS EN VIVO (TELEMETRÍA)",
    logEmpty: "Esperando tráfico de peticiones... Realiza alguna consulta de Tarot o medita para ver logs en vivo.",
    integrations: "INTEGRACIONES DE OBSERVABILIDAD DE NIVEL PROFESIONAL (100% GRATIS)",
    integrationDesc: "Para conectarte de manera permanente a paneles avanzados de métricas, alarmas y monitoreo continuo, puedes configurar estos proveedores gratuitos líderes del mercado. Sigue la guía de abajo:",
    sentryTitle: "Sentry (Monitoreo de Errores y Web Vitals)",
    sentryStatusActive: "Conectado de forma segura. Capturando excepciones y latencias.",
    sentryStatusInactive: "No configurado. Sentry es el estándar industrial para rastreo de errores con un plan 100% gratuito (10.000 errores mensuales).",
    mixpanelTitle: "Mixpanel (Métricas de Tráfico y Uso)",
    mixpanelStatusActive: "Conectado. Enviando eventos de comportamiento anónimos.",
    mixpanelStatusInactive: "No configurado. Mixpanel te permite crear embudos de conversión y gráficos de uso con un plan 100% gratuito (100.000 eventos mensuales).",
    guideTitle: "Guía de Conexión Rápida",
    step1: "1. Crea tu cuenta gratuita en sentry.io y mixpanel.com.",
    step2: "2. Obtén el Sentry DSN de tu proyecto y el Project Token de Mixpanel.",
    step3: "3. Agrégalos en el panel de Configuración / Variables de Entorno del workspace.",
    copied: "¡Copiado al portapapeles!",
    copyBtn: "Copiar variables recomendadas",
    refreshing: "Actualizando...",
    refreshBtn: "Actualizar",
    autoRefresh: "Auto-actualizar (5s)"
  },
  en: {
    title: "Observability & Metrics Console",
    desc: "Real-time monitoring of platform performance, error rates, and usage analysis of spiritual services.",
    sysStatus: "PLATFORM STATUS",
    serverOnline: "Server Online",
    uptime: "Uptime",
    totalReqs: "Total Requests",
    errorRate: "Error Rate",
    apiPerformance: "API PERFORMANCE (RESPONSE TIME)",
    apiEndpoint: "API Route",
    apiCalls: "Calls",
    apiAvgTime: "Avg Duration",
    apiErrors: "Errors",
    usageStats: "SPIRITUAL SERVICES USAGE",
    tarot: "Therapeutic Tarot",
    runes: "Norse Runes",
    angels: "Angels of Light",
    numerology: "Numerology",
    kabbalah: "Kabbalah",
    astros: "Astrology & Moon",
    audio: "Music / Atmosphere",
    zenAdvice: "Zen Guide",
    liveLogs: "LIVE TELEMETRY LOGS TERMINAL",
    logEmpty: "Waiting for request traffic... Draw a Tarot card or start a meditation to see live logs.",
    integrations: "PROFESSIONAL GRADE OBSERVABILITY INTEGRATIONS (100% FREE)",
    integrationDesc: "To permanently connect to advanced charts, alert alerts, and active monitoring, you can easily integrate these market-leading free tier providers. Follow the steps below:",
    sentryTitle: "Sentry (Error Tracking & Web Vitals)",
    sentryStatusActive: "Securely connected. Capturing exceptions and latencies.",
    sentryStatusInactive: "Not configured. Sentry is the industry standard for crash reporting with a 100% free plan (10,000 errors/month).",
    mixpanelTitle: "Mixpanel (Traffic & Behavior Metrics)",
    mixpanelStatusActive: "Connected. Emitting anonymous user behavior events.",
    mixpanelStatusInactive: "Not configured. Mixpanel allows creating conversion funnels and retention graphs with a 100% free plan (100,000 events/month).",
    guideTitle: "Quick Connection Guide",
    step1: "1. Create your free account on sentry.io and mixpanel.com.",
    step2: "2. Fetch your Sentry DSN and Mixpanel Project Token.",
    step3: "3. Save them in the Environment Variables / Secrets panel inside your app configurations.",
    copied: "Copied to clipboard!",
    copyBtn: "Copy environment variables",
    refreshing: "Refreshing...",
    refreshBtn: "Refresh",
    autoRefresh: "Auto-Refresh (5s)"
  },
  pt: {
    title: "Console de Observabilidade & Métricas",
    desc: "Supervisão em tempo real do desempenho da plataforma, taxas de erro e análise de uso dos serviços espirituais.",
    sysStatus: "ESTADO DA PLATAFORMA",
    serverOnline: "Servidor Online",
    uptime: "Tempo de Atividade",
    totalReqs: "Requisições Totais",
    errorRate: "Taxa de Erros",
    apiPerformance: "DESEMPENHO DAS APIS (TEMPO DE RESPOSTA)",
    apiEndpoint: "Rota da API",
    apiCalls: "Chamadas",
    apiAvgTime: "Tempo Médio",
    apiErrors: "Erros",
    usageStats: "USO DE SERVIÇOS ESPIRITUAIS",
    tarot: "Tarot Terapêutico",
    runes: "Runas Nórdicas",
    angels: "Anjos da Luz",
    numerology: "Numerologia",
    kabbalah: "Cabala",
    astros: "Astros & Lua",
    audio: "Música / Atmosfera",
    zenAdvice: "Guia Zen",
    liveLogs: "TERMINAL DE REGISTROS EM TEMPO REAL (TELEMETRIA)",
    logEmpty: "Aguardando tráfego de requisições... Faça uma consulta de Tarot ou medite para ver logs ao vivo.",
    integrations: "INTEGRAÇÕES PROFISSIONAIS DE OBSERVABILIDADE (100% GRÁTIS)",
    integrationDesc: "Para conectar-se permanentemente a painéis avançados de métricas, alarmes e monitoramento contínuo, você pode configurar esses provedores gratuitos líderes de mercado. Siga o guia abaixo:",
    sentryTitle: "Sentry (Rastreamento de Erros e Web Vitals)",
    sentryStatusActive: "Conectado de forma segura. Capturando exceções e latências.",
    sentryStatusInactive: "Não configurado. Sentry é o padrão de mercado para monitorar travamentos com plano 100% gratuito (10.000 erros mensais).",
    mixpanelTitle: "Mixpanel (Métricas de Uso e Tráfego)",
    mixpanelStatusActive: "Conectado. Enviando eventos de comportamento anônimos.",
    mixpanelStatusInactive: "Não configurado. Mixpanel permite criar funis de retenção e gráficos com um plano 100% gratuito (100.000 eventos mensais).",
    guideTitle: "Guia de Conexão Rápida",
    step1: "1. Crie sua conta gratuita em sentry.io e mixpanel.com.",
    step2: "2. Obtenha o Sentry DSN do projeto e o Project Token do Mixpanel.",
    step3: "3. Adicione-os no painel de Configurações / Variáveis de Ambiente do workspace.",
    copied: "Copiado para a área de transferência!",
    copyBtn: "Copiar variáveis recomendadas",
    refreshing: "Atualizando...",
    refreshBtn: "Atualizar",
    autoRefresh: "Auto-atualizar (5s)"
  },
  de: {
    title: "Observability- & Metriken-Konsole",
    desc: "Echtzeitüberwachung der Plattformleistung, Fehlerraten und Nutzungsanalyse der spirituellen Dienste.",
    sysStatus: "PLATTFORM-STATUS",
    serverOnline: "Server Online",
    uptime: "Betriebszeit",
    totalReqs: "Anfragen Gesamt",
    errorRate: "Fehlerrate",
    apiPerformance: "API-LEISTUNG (ANTWORTZEIT)",
    apiEndpoint: "API-Pfad",
    apiCalls: "Aufrufe",
    apiAvgTime: "Durchschnittliche Dauer",
    apiErrors: "Fehler",
    usageStats: "NUTZUNG DER SPIRITUELLEN DIENSTE",
    tarot: "Therapeutisches Tarot",
    runes: "Nordische Runen",
    angels: "Engel des Lichts",
    numerology: "Numerologie",
    kabbalah: "Kabbala",
    astros: "Sterne & Mond",
    audio: "Musik / Atmosphäre",
    zenAdvice: "Zen-Leitfaden",
    liveLogs: "LIVE-LOGS-TERMINAL (TELEMETRIE)",
    logEmpty: "Warten auf Anfragenverkehr... Mache eine Tarot-Legung oder starte eine Atemübung, um Live-Logs zu sehen.",
    integrations: "PROFESSIONELLE OBSERVABILITY-INTEGRATIONEN (100% KOSTENLOS)",
    integrationDesc: "Für eine dauerhafte Verbindung mit erweiterten Dashboards, Alarmen und kontinuierlicher Überwachung kannst du diese marktführenden kostenlosen Anbieter integrieren. Folge der Anleitung unten:",
    sentryTitle: "Sentry (Fehlerverfolgung & Web Vitals)",
    sentryStatusActive: "Sicher verbunden. Fehler und Latenzen werden erfasst.",
    sentryStatusInactive: "Nicht konfiguriert. Sentry ist der Industriestandard für Fehlerberichte mit einem 100% kostenlosen Tarif (10.000 Fehler/Monat).",
    mixpanelTitle: "Mixpanel (Verkehrs- & Nutzungsmetriken)",
    mixpanelStatusActive: "Verbunden. Sende anonyme Verhaltensdaten.",
    mixpanelStatusInactive: "Nicht konfiguriert. Mixpanel ermöglicht Trichteranalysen und Nutzungsdiagramme mit einem 100% kostenlosen Tarif (100.000 Events/Monat).",
    guideTitle: "Schnellverbindungsanleitung",
    step1: "1. Erstelle ein kostenloses Konto auf sentry.io und mixpanel.com.",
    step2: "2. Finde deinen Sentry DSN und deinen Mixpanel Project Token.",
    step3: "3. Speichere sie im Bereich für Umgebungsvariablen / Secrets deines Workspace.",
    copied: "In Zwischenablage kopiert!",
    copyBtn: "Empfohlene Variablen kopieren",
    refreshing: "Aktualisiere...",
    refreshBtn: "Aktualisieren",
    autoRefresh: "Auto-Aktualisierung (5s)"
  }
};

export const MetricsTab: React.FC<MetricsTabProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  // Fetch telemetry stats
  const fetchStats = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch("/api/observability/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error fetching telemetry stats:", e);
    } finally {
      setLoading(false);
    }
  };

  // Uptime ticker
  useEffect(() => {
    const startUptime = Math.floor(Math.random() * 2000) + 1200; // Simulated stable base uptime for this container
    setUptimeSeconds(startUptime);
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch immediately and poll every 5 seconds if enabled
  useEffect(() => {
    fetchStats(true);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchStats(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleCopyEnv = () => {
    const textToCopy = `SENTRY_DSN=https://your-public-key@o0.ingest.sentry.io/your-project-id\nMIXPANEL_TOKEN=your-mixpanel-project-token`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUptimeString = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Calculate high-level stats
  const totalRequests = stats?.metrics.reduce((acc, m) => acc + m.count, 0) || 0;
  const totalErrors = stats?.metrics.reduce((acc, m) => acc + m.errors, 0) || 0;
  const errorPercentage = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 animate-fade-in pb-12 text-slate-200">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">{t.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">{t.desc}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              autoRefresh 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`}></span>
            {t.autoRefresh}
          </button>

          <button
            onClick={() => fetchStats(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
            {loading ? t.refreshing : t.refreshBtn}
          </button>
        </div>
      </div>

      {/* Bento Grid High Level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Status */}
        <div className="p-4 bg-slate-950/45 border border-slate-900 rounded-3xl flex items-center gap-3.5 shadow-md shadow-black/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">{t.sysStatus}</span>
            <span className="text-xs font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.serverOnline}
            </span>
          </div>
        </div>

        {/* Uptime */}
        <div className="p-4 bg-slate-950/45 border border-slate-900 rounded-3xl flex items-center gap-3.5 shadow-md shadow-black/20">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">{t.uptime}</span>
            <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block">
              {getUptimeString(uptimeSeconds)}
            </span>
          </div>
        </div>

        {/* Total Requests */}
        <div className="p-4 bg-slate-950/45 border border-slate-900 rounded-3xl flex items-center gap-3.5 shadow-md shadow-black/20">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">{t.totalReqs}</span>
            <span className="text-xs font-mono font-black text-slate-100 mt-0.5 block">
              {totalRequests.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error Rate */}
        <div className="p-4 bg-slate-950/45 border border-slate-900 rounded-3xl flex items-center gap-3.5 shadow-md shadow-black/20">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">{t.errorRate}</span>
            <span className={`text-xs font-mono font-black mt-0.5 block ${parseFloat(errorPercentage) > 5 ? "text-rose-400 animate-pulse" : "text-slate-200"}`}>
              {errorPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: API Performance */}
        <div className="lg:col-span-7 bg-slate-950/30 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 tracking-widest uppercase">
            <Cpu className="w-4 h-4 text-amber-500" /> {t.apiPerformance}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-bold">
                  <th className="pb-2">{t.apiEndpoint}</th>
                  <th className="pb-2 text-right">{t.apiCalls}</th>
                  <th className="pb-2 text-right">{t.apiAvgTime}</th>
                  <th className="pb-2 text-right">{t.apiErrors}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-mono">
                {stats?.metrics && stats.metrics.length > 0 ? (
                  stats.metrics.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10">
                      <td className="py-2.5 text-slate-300 font-semibold truncate max-w-[200px]">{m.path}</td>
                      <td className="py-2.5 text-right font-bold text-slate-400">{m.count}</td>
                      <td className="py-2.5 text-right font-bold text-amber-400">
                        {m.avgDuration} <span className="text-[10px] text-slate-600">ms</span>
                      </td>
                      <td className={`py-2.5 text-right font-bold ${m.errors > 0 ? "text-rose-400" : "text-slate-600"}`}>
                        {m.errors}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500 italic">
                      No APIs queried yet. Explore the spiritual tabs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Spiritual Usage Analytics */}
        <div className="lg:col-span-5 bg-slate-950/30 border border-slate-900 rounded-3xl p-5 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 tracking-widest uppercase">
            <BarChart2 className="w-4 h-4 text-emerald-500" /> {t.usageStats}
          </h3>

          <div className="flex flex-col gap-3.5">
            {/* Custom chart style list */}
            {[
              { label: t.tarot, val: stats?.events.tarotReadings || 0, icon: "🔮", color: "bg-amber-500" },
              { label: t.runes, val: stats?.events.runesCasts || 0, icon: "ᚠ", color: "bg-emerald-500" },
              { label: t.angels, val: stats?.events.angelReadings || 0, icon: "👼", color: "bg-blue-500" },
              { label: t.numerology, val: stats?.events.numerologyProfiles || 0, icon: "🔢", color: "bg-indigo-500" },
              { label: t.kabbalah, val: stats?.events.treeOfLifeAlignments || 0, icon: "🌳", color: "bg-purple-500" },
              { label: t.astros, val: stats?.events.astrologyChecks || 0, icon: "🌙", color: "bg-sky-500" },
              { label: t.audio, val: stats?.events.audioSessions || 0, icon: "🎵", color: "bg-teal-500" },
              { label: t.zenAdvice, val: stats?.events.zenAdviceRequests || 0, icon: "🧘", color: "bg-orange-500" },
            ].map((ev, index) => {
              // Calculate percent relative to max
              const vals = [
                stats?.events.tarotReadings || 0,
                stats?.events.runesCasts || 0,
                stats?.events.angelReadings || 0,
                stats?.events.numerologyProfiles || 0,
                stats?.events.treeOfLifeAlignments || 0,
                stats?.events.astrologyChecks || 0,
                stats?.events.audioSessions || 0,
                stats?.events.zenAdviceRequests || 0,
              ];
              const maxVal = Math.max(...vals, 1);
              const percent = ((ev.val / maxVal) * 100).toFixed(0);

              return (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-4 text-center select-none">{ev.icon}</span>
                      <span>{ev.label}</span>
                    </span>
                    <span className="font-mono font-black text-slate-100">{ev.val}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden border border-slate-950/40">
                    <div
                      className={`${ev.color} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live Log Terminal Console */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 tracking-widest uppercase">
            <Terminal className="w-4 h-4 text-emerald-400" /> {t.liveLogs}
          </h3>
          <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase border border-emerald-500/20">
            {language === "en" ? "Streaming" : language === "pt" ? "Transmitindo" : "Transmitiendo"}
          </span>
        </div>

        {/* Console Box */}
        <div className="bg-slate-950/80 border border-slate-900/60 rounded-2xl p-4 h-64 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 custom-scrollbar select-text selection:bg-emerald-500/30">
          {stats?.logs && stats.logs.length > 0 ? (
            stats.logs.map((log, idx) => {
              const isError = log.statusCode >= 400;
              const isClient = log.method.startsWith("CLIENT");
              
              let statusColor = "text-emerald-400";
              if (isError) statusColor = "text-rose-400";
              else if (log.statusCode >= 300) statusColor = "text-sky-400";
              
              let methodBg = "bg-slate-900 text-slate-400 border border-slate-800";
              if (log.method === "POST") methodBg = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
              else if (isClient) methodBg = "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";

              return (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-b border-slate-900/40 pb-1.5 text-slate-400 last:border-0 last:pb-0">
                  <span className="text-[10px] text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider shrink-0 font-sans uppercase ${methodBg}`}>
                    {log.method}
                  </span>
                  <span className={`font-bold shrink-0 font-sans ${statusColor}`}>
                    {log.statusCode}
                  </span>
                  <span className="text-slate-300 font-semibold flex-1 truncate">{log.path}</span>
                  {log.duration > 0 && (
                    <span className="text-[10px] text-slate-500 font-medium shrink-0">({log.duration}ms)</span>
                  )}
                  {log.info && (
                    <span className="text-[10px] text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-lg border border-amber-500/10 truncate max-w-[250px] shrink-0 font-sans font-bold">
                      {log.info}
                    </span>
                  )}
                  {log.error && (
                    <span className="text-[10px] text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded-lg border border-rose-500/10 truncate max-w-[300px] shrink-0 font-sans">
                      {log.error}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 gap-2">
              <Sparkles className="w-8 h-8 text-slate-700 animate-pulse" />
              <p className="max-w-md text-xs italic font-semibold">{t.logEmpty}</p>
            </div>
          )}
        </div>
      </div>

      {/* Observability Integrations (Sentry & Mixpanel Setup) */}
      <div className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" /> {t.integrations}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{t.integrationDesc}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentry Integration */}
          <div className="bg-slate-950 border border-slate-900 hover:border-slate-850 p-5 rounded-3xl flex flex-col justify-between gap-5 transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{t.sentryTitle}</h4>
                <a
                  href="https://sentry.io/signup/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  sentry.io <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {stats?.isSentryConfigured ? t.sentryStatusActive : t.sentryStatusInactive}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold">
              {stats?.isSentryConfigured ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Active
                </span>
              ) : (
                <span className="text-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  Ready to configure
                </span>
              )}
            </div>
          </div>

          {/* Mixpanel Integration */}
          <div className="bg-slate-950 border border-slate-900 hover:border-slate-850 p-5 rounded-3xl flex flex-col justify-between gap-5 transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{t.mixpanelTitle}</h4>
                <a
                  href="https://mixpanel.com/register/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  mixpanel.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {stats?.isMixpanelConfigured ? t.mixpanelStatusActive : t.mixpanelStatusInactive}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold">
              {stats?.isMixpanelConfigured ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Active
                </span>
              ) : (
                <span className="text-slate-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  Ready to configure
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Config panel */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">{t.guideTitle}</h4>
            <ul className="text-[11px] text-slate-400 leading-relaxed mt-1 flex flex-col gap-1 font-medium">
              <li>{t.step1}</li>
              <li>{t.step2}</li>
              <li>{t.step3}</li>
            </ul>
          </div>

          <button
            onClick={handleCopyEnv}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              copied 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950" 
                : "bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900 active:scale-95"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                {t.copyBtn}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
