import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "../utils/safeStorage";
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  Volume2, 
  BookOpen, 
  Trash2, 
  Share2, 
  ArrowLeft, 
  Info, 
  Clock, 
  CheckCircle,
  Activity
} from "lucide-react";

interface AstralJourney {
  id: string;
  intent: string;
  frequency: string;
  vibrationalAnchor: string;
  astralSafetyMantra: string;
  guidedJourney: string;
  planarDestination: string;
  guardiansMessage: string;
  date: string;
}

interface AstralTravelProps {
  language: "es" | "en" | "pt" | "de";
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
}

const TRANSLATIONS = {
  es: {
    title: "Viajes Astrales",
    subtitle: "Sintoniza tu cuerpo sutil y proyecta tu conciencia de manera segura hacia otras dimensiones o templos del plano sutil.",
    intentLabel: "Intención del Viaje Astral",
    intentSelectPlaceholder: "Selecciona el enfoque de tu proyección...",
    tuneBtn: "Sintonizar Frecuencia Astral",
    tuning: "Sintonizando resonancia vibratoria...",
    historyTitle: "Registro de Proyecciones Astrales",
    noJourneys: "Aún no has preparado ninguna proyección astral. Selecciona una intención planar para sintonizar tu frecuencia sutil.",
    savedSuccess: "¡Sintonización guardada en tu Bitácora Astral!",
    deleteConfirm: "¿Deseas borrar esta sintonización de tu bitácora astral para siempre?",
    backBtn: "Volver a la Bitácora Astral",
    frequency: "Frecuencia de Sintonización",
    anchor: "Anclaje Vibratorio",
    mantra: "Mantra de Seguridad y Lucidez",
    guidedJourney: "Guía de Desdoblamiento Consciente",
    destination: "Destino Planar Sugerido",
    guardiansMessage: "Mensaje de los Guardianes del Umbral",
    shareText: "Compartir Sintonización",
    anonymousNote: "Nota del Cosmos: Todo tu diario de proyecciones y sintonizaciones se almacena de forma privada y local en tu navegador.",
    
    intentHealing: "💚 Templos de Sanación Astral",
    intentRecords: "📚 Archivos Cósmicos / Registros",
    intentGuides: "👼 Conectar con tus Guías Espirituales",
    intentFree: "🌌 Exploración Libre y Vuelo Astral",
    intentShield: "🛡️ Fortalecimiento del Escudo Áurico",
    intentAkasha: "🔮 Canalización de Sabiduría Estelar"
  },
  en: {
    title: "Astral Travel",
    subtitle: "Attune your subtle body and project your consciousness safely to other dimensions or temples of the subtle plane.",
    intentLabel: "Astral Journey Intent",
    intentSelectPlaceholder: "Select the focus of your projection...",
    tuneBtn: "Attune Astral Frequency",
    tuning: "Attuning vibrational resonance...",
    historyTitle: "Astral Projection Logbook",
    noJourneys: "You haven't prepared any astral projections yet. Select a planar intent to attune your subtle frequency.",
    savedSuccess: "Projection attunement saved to your Astral Logbook!",
    deleteConfirm: "Do you want to delete this attunement from your astral log forever?",
    backBtn: "Back to Astral Logbook",
    frequency: "Attunement Frequency",
    anchor: "Vibrational Anchor",
    mantra: "Safety & Lucid Projection Mantra",
    guidedJourney: "Conscious Out-of-Body Guide",
    destination: "Suggested Planar Destination",
    guardiansMessage: "Message from the Threshold Guardians",
    shareText: "Share Attunement",
    anonymousNote: "Cosmos Note: Your projection log and attunements are stored privately and locally in your browser.",
    
    intentHealing: "💚 Astral Healing Temples",
    intentRecords: "📚 Cosmic Archives / Records",
    intentGuides: "👼 Connect with Spiritual Guides",
    intentFree: "🌌 Free Exploration & Astral Flight",
    intentShield: "🛡️ Auric Shield Strengthening",
    intentAkasha: "🔮 Channeling Stellar Wisdom"
  },
  pt: {
    title: "Viagens Astrais",
    subtitle: "Sintonize seu corpo sutil e projete sua consciência com segurança para outras dimensões ou templos do plano sutil.",
    intentLabel: "Intenção da Viagem Astral",
    intentSelectPlaceholder: "Selecione o foco da sua projeção...",
    tuneBtn: "Sintonizar Frequência Astral",
    tuning: "Sintonizando ressonância vibracional...",
    historyTitle: "Registro de Projeções Astrais",
    noJourneys: "Você ainda não preparou nenhuma projeção astral. Selecione uma intenção planar para sintonizar sua frequência sutil.",
    savedSuccess: "Sintonização guardada em seu Diário Astral!",
    deleteConfirm: "Deseja excluir esta sintonização do seu diário astral para sempre?",
    backBtn: "Voltar ao Diário Astral",
    frequency: "Frequência de Sintonização",
    anchor: "Ancoragem Vibracional",
    mantra: "Mantra de Segurança e Lucidez",
    guidedJourney: "Guia de Desdobramento Consciente",
    destination: "Destino Planar Sugerido",
    guardiansMessage: "Mensagem dos Guardiões do Limiar",
    shareText: "Compartilhar",
    anonymousNote: "Nota do Cosmos: Todo o seu diário de projeções e sintonizações é armazenado de forma privada e local em seu navegador.",
    
    intentHealing: "💚 Templos de Cura Astral",
    intentRecords: "📚 Arquivos Cósmicos / Registros",
    intentGuides: "👼 Conectar com seus Guias Espirituais",
    intentFree: "🌌 Exploração Livre e Voo Astral",
    intentShield: "🛡️ Fortalecimento do Escudo Áurico",
    intentAkasha: "🔮 Canalização de Sabedoria Estelar"
  },
  de: {
    title: "Astralreisen",
    subtitle: "Stimmen Sie Ihren feinstofflichen Körper ein und projizieren Sie Ihr Bewusstsein sicher in andere Dimensionen oder Tempel der Astralebene.",
    intentLabel: "Absicht der Astralreise",
    intentSelectPlaceholder: "Wählen Sie den Fokus Ihrer Projektion...",
    tuneBtn: "Astralfrequenz einstimmen",
    tuning: "Schwingungsresonanz wird eingestimmt...",
    historyTitle: "Astralprojektions-Logbuch",
    noJourneys: "Sie haben noch keine Astralreisen vorbereitet. Wählen Sie eine Absicht, um Ihre feinstoffliche Frequenz einzustimmen.",
    savedSuccess: "Projektionseinstimmung im Astrallogbuch gespeichert!",
    deleteConfirm: "Möchten Sie diese Einstimmung für immer aus Ihrem Astrallogbuch löschen?",
    backBtn: "Zurück zum Astrallogbuch",
    frequency: "Einstimmungsfrequenz",
    anchor: "Schwingungsanker",
    mantra: "Mantra für Sicherheit & luzide Projektion",
    guidedJourney: "Anleitung zur bewussten außerkörperlichen Erfahrung",
    destination: "Empfohlenes planares Ziel",
    guardiansMessage: "Botschaft der Schwellenhüter",
    shareText: "Teilen",
    anonymousNote: "Cosmos-Notiz: Ihr Projektionsprotokoll und Ihre Einstimmungen werden vertraulich in Ihrem Browser gespeichert.",
    
    intentHealing: "💚 Astrale Heilungstempel",
    intentRecords: "📚 Kosmische Archive / Aufzeichnungen",
    intentGuides: "👼 Verbindung mit spirituellen Führern",
    intentFree: "🌌 Freie Erkundung & Astralflug",
    intentShield: "🛡️ Stärkung des Auratrommelschilds",
    intentAkasha: "🔮 Sternenweisheit kanalisieren"
  }
};

export function AstralTravel({ language, showToast }: AstralTravelProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  // States
  const [intent, setIntent] = useState("free");
  const [loading, setLoading] = useState(false);
  const [journeys, setJourneys] = useState<AstralJourney[]>([]);
  const [activeJourney, setActiveJourney] = useState<AstralJourney | null>(null);

  // Load journeys on mount
  useEffect(() => {
    const saved = safeLocalStorage.getItem("zen_astral_archive");
    if (saved) {
      try {
        setJourneys(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing astral journeys archive", e);
      }
    }
  }, []);

  const handleTune = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/astral-travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, language }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      const newJourney: AstralJourney = {
        id: Date.now().toString(),
        intent,
        frequency: data.frequency || "963Hz",
        vibrationalAnchor: data.vibrationalAnchor || "Visualizar cristal azul en tercer ojo",
        astralSafetyMantra: data.astralSafetyMantra || "Yo soy luz, regreso seguro",
        guidedJourney: data.guidedJourney || "Narración guiada",
        planarDestination: data.planarDestination || "Plano astral",
        guardiansMessage: data.guardiansMessage || "Mensaje de los guardianes",
        date: new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "de-DE", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updated = [newJourney, ...journeys];
      setJourneys(updated);
      safeLocalStorage.setItem("zen_astral_archive", JSON.stringify(updated));
      setActiveJourney(newJourney);
      showToast(t.savedSuccess, "success");
    } catch (err: any) {
      console.error(err);
      showToast(language === "en" ? "Planar alignment was disrupted." : "La alineación planar se interrumpió.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.deleteConfirm)) {
      const updated = journeys.filter(j => j.id !== id);
      setJourneys(updated);
      safeLocalStorage.setItem("zen_astral_archive", JSON.stringify(updated));
      if (activeJourney?.id === id) {
        setActiveJourney(null);
      }
      showToast(language === "en" ? "Attunement removed." : "Sintonización eliminada.", "info");
    }
  };

  const handleShare = () => {
    if (!activeJourney) return;
    const shareTitle = `${t.title} - ${getIntentLabel(activeJourney.intent)}`;
    const shareText = `*${t.title}*\n\n*${t.destination}:* ${activeJourney.planarDestination}\n*${t.frequency}:* ${activeJourney.frequency}\n\n*${t.mantra}:*\n"${activeJourney.astralSafetyMantra}"\n\n*${t.guidedJourney}:*\n${activeJourney.guidedJourney}`;
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.origin
      }).then(() => showToast(language === "en" ? "Attunement Shared!" : "¡Sintonización compartida!", "success"))
        .catch(() => fallbackCopy(shareText));
    } else {
      fallbackCopy(shareText);
    }
  };

  const fallbackCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast(language === "en" ? "Copied to clipboard!" : "¡Copiado al portapapeles!", "success"))
      .catch(() => showToast(language === "en" ? "Failed to copy." : "Error al copiar.", "warning"));
  };

  const getIntentLabel = (iVal: string) => {
    switch (iVal) {
      case "healing": return t.intentHealing;
      case "records": return t.intentRecords;
      case "guides": return t.intentGuides;
      case "free": return t.intentFree;
      case "shield": return t.intentShield;
      default: return t.intentAkasha;
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8" id="astral-travel-module">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-18 h-18 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
          <Activity className="w-9 h-9 text-teal-400 animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white mt-2">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        
        {/* Actions row */}
        <div className="flex justify-between items-center gap-3">
          {activeJourney && (
            <button
              onClick={() => setActiveJourney(null)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4.5 h-4.5" /> {t.backBtn}
            </button>
          )}

          {!activeJourney && <div />}
          <span className="text-xs sm:text-sm text-slate-500 max-w-sm text-right leading-normal font-medium hidden sm:inline">
            {t.anonymousNote}
          </span>
        </div>

        {/* 1. PORTAL TUNING SEQUENCE */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 bg-slate-950/45 border border-slate-900 rounded-3xl text-center flex flex-col items-center justify-center gap-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.08)_0%,transparent_70%)]"></div>
            
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-teal-500/20 border-t-teal-500/80 animate-spin"></div>
              <div className="absolute w-20 h-20 rounded-full border border-purple-500/10 border-b-purple-500/60 animate-spin [animation-direction:reverse]"></div>
              <Activity className="w-8 h-8 text-teal-400 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-serif font-black text-teal-300 animate-pulse">{t.tuning}</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed italic">
                {language === "es" && "Alineando tus chakras sutiles, expandiendo la vibración del cuerpo mental y abriendo portales de proyección lúcida segura..."}
                {language === "en" && "Aligning subtle chakras, expanding mental body vibration, and opening safe lucid projection portals..."}
                {language === "pt" && "Alinhando chakras sutis, expandindo vibração do corpo mental e abrindo portais de projeção lúcida segura..."}
                {language === "de" && "Feinstoffliche Chakren werden ausgerichtet, Schwingung des Mentalkörpers erweitert und sichere Astraltore geöffnet..."}
              </p>
            </div>
          </motion.div>
        )}

        {/* 2. COMPREHENSIVE ASTRAL TRAVEL ATTUNEMENT VIEW */}
        {activeJourney && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-teal-500/25 bg-teal-500/10 text-teal-400">
                    {getIntentLabel(activeJourney.intent)}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 ml-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {activeJourney.date}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-white mt-1.5 leading-tight flex items-center gap-2">
                  <Compass className="w-6 h-6 text-teal-400 animate-spin [animation-duration:12s]" /> {activeJourney.planarDestination}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleShare}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title={t.shareText}
                >
                  <Share2 className="w-4 h-4" /> {t.shareText}
                </button>
              </div>
            </div>

            {/* Micro details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Frequency */}
              <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <Volume2 className="w-4.5 h-4.5 text-teal-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.frequency}</span>
                  <h4 className="text-sm font-bold text-teal-300">{activeJourney.frequency}</h4>
                </div>
              </div>

              {/* Anchor */}
              <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <MapPin className="w-4.5 h-4.5 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.anchor}</span>
                  <h4 className="text-sm font-bold text-purple-300 leading-tight">{activeJourney.vibrationalAnchor}</h4>
                </div>
              </div>
            </div>

            {/* Protection Mantra */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-900 flex flex-col items-center text-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> {t.mantra}</span>
              <p className="font-serif italic text-base sm:text-lg text-teal-200 font-bold">
                "{activeJourney.astralSafetyMantra}"
              </p>
            </div>

            {/* Guided journey core */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/10 to-indigo-950/10 border border-teal-500/20 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-teal-300 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400 animate-pulse" /> {t.guidedJourney}
              </h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif font-medium whitespace-pre-wrap">
                {activeJourney.guidedJourney}
              </p>
            </div>

            {/* Guardians Message */}
            <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900/60 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{t.guardiansMessage}</span>
              <p className="text-sm text-slate-300 leading-relaxed font-serif italic">
                "{activeJourney.guardiansMessage}"
              </p>
            </div>

          </motion.div>
        )}

        {/* 3. INPUT FORM AND HISTORIC LOGS */}
        {!activeJourney && !loading && (
          <div className="flex flex-col gap-6">
            
            {/* Tuning Setup Form */}
            <form onSubmit={handleTune} className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

              {/* Destination Intent selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-teal-400" /> {t.intentLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "free", label: t.intentFree },
                    { id: "healing", label: t.intentHealing },
                    { id: "records", label: t.intentRecords },
                    { id: "guides", label: t.intentGuides },
                    { id: "shield", label: t.intentShield },
                    { id: "akasha", label: t.intentAkasha }
                  ].map((intOpt) => (
                    <button
                      key={intOpt.id}
                      type="button"
                      onClick={() => setIntent(intOpt.id)}
                      className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all flex items-center gap-2 cursor-pointer ${
                        intent === intOpt.id
                          ? "bg-teal-950/45 border-teal-500/80 text-teal-300 ring-2 ring-teal-500/20"
                          : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                      }`}
                    >
                      <CheckCircle className={`w-4 h-4 shrink-0 transition-all ${intent === intOpt.id ? "text-teal-400 opacity-100 scale-100" : "opacity-0 scale-50"}`} />
                      {intOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-800 hover:from-teal-600 hover:to-indigo-700 text-white font-black uppercase tracking-wider text-xs transition-all duration-300 shadow-lg shadow-teal-950/40 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                {t.tuneBtn}
              </button>
            </form>

            {/* History Logs */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-serif font-bold text-white tracking-wide border-b border-slate-900 pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400 animate-pulse" /> {t.historyTitle}
              </h3>

              {journeys.length === 0 ? (
                <div className="p-12 bg-slate-900/10 border border-slate-900/60 rounded-3xl text-center flex flex-col items-center gap-3.5">
                  <Clock className="w-10 h-10 text-slate-700 animate-pulse" />
                  <p className="text-xs sm:text-sm text-slate-500 italic max-w-sm leading-relaxed font-semibold">
                    {t.noJourneys}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {journeys.map((journey) => (
                    <motion.div
                      key={journey.id}
                      onClick={() => setActiveJourney(journey)}
                      className="p-5 bg-slate-950/40 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-98 cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/[0.01] group-hover:bg-teal-500/[0.02] rounded-full blur-xl pointer-events-none transition-all"></div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1.5">
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                            {getIntentLabel(journey.intent).split(" ")[1] || getIntentLabel(journey.intent)}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {journey.date.split(" a las")[0] || journey.date}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-teal-300 transition-colors leading-tight">
                          {journey.planarDestination}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                          "{journey.guardiansMessage}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900">
                        <span className="text-[10px] font-bold text-purple-400 font-mono">{journey.frequency}</span>
                        <button
                          onClick={(e) => handleDelete(journey.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-950/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Eliminar sintonización"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom help card */}
            <div className="p-5 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-400">
              <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5 animate-bounce" />
              <p>
                {language === "es" 
                  ? "Recomendación astral: Usa audífonos para escuchar las frecuencias procedenciales del mezclador de sonidos de fondo durante tu preparación. Mantén una respiración abdominal rítmica de 4 tiempos antes de acostarte y repite mentalmente el mantra sintonizado."
                  : "Astral recommendation: Use headphones to listen to procedural ambient background sounds during your preparation. Maintain 4-count abdominal breathing before sleeping and repeat the tuned mantra mentally."}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
