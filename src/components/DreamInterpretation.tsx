import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "../utils/safeStorage";
import { 
  Moon, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Info, 
  Trash2, 
  Share2, 
  ArrowLeft, 
  Eye, 
  HelpCircle,
  Clock,
  Compass
} from "lucide-react";

interface DreamSymbol {
  name: string;
  meaning: string;
}

interface DreamInterpretation {
  id: string;
  dreamDescription: string;
  dreamMood: string;
  symbols: DreamSymbol[];
  psychologicalMeaning: string;
  mysticalMeaning: string;
  message: string;
  advice: string;
  date: string;
}

interface DreamInterpretationProps {
  language: "es" | "en" | "pt" | "de";
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
}

const TRANSLATIONS = {
  es: {
    title: "Interpretación de Sueños",
    subtitle: "Descifra los mensajes ocultos de tu mente subconsciente. Analiza los símbolos, la psicología profunda y las advertencias del plano astral.",
    formLabel: "Describe tu sueño detalladamente",
    formPlaceholder: "Escribe lo que has visto, oído y sentido... los objetos, colores, personas, animales o emociones que recuerdes al despertar.",
    moodLabel: "Tono emocional del sueño",
    interpretBtn: "Interpretar Sueño",
    interpreting: "Analizando hilos del inconsciente...",
    historyTitle: "Bitácora de Sueños (Diario Onírico)",
    noDreams: "Tu diario onírico está listo. Registra tus sueños al despertar para descubrir los patrones y mensajes de tu psique.",
    savedSuccess: "¡Interpretación guardada en tu Bitácora de Sueños!",
    deleteConfirm: "¿Deseas eliminar este registro de tu diario onírico para siempre?",
    backBtn: "Volver al Diario Onírico",
    symbolsTitle: "Símbolos y Arquetipos Oníricos",
    psychologicalTitle: "Significado Psicológico (Análisis Junguiano)",
    mysticalTitle: "Mensaje de los Planos Sutiles (Astral)",
    messageTitle: "Revelación del Subconsciente",
    adviceTitle: "Integración en el Despertar",
    shareText: "Compartir Sueño",
    anonymousNote: "Nota del Templo: Tus sueños son íntimos. Todo el diario onírico y su análisis se almacena estrictamente de forma local y privada en tu navegador.",
    moodPeaceful: "🧘 Pacífico & Armónico",
    moodAnxious: "😰 Ansioso & Estresante",
    moodBizarre: "🌀 Extraño & Surrealista",
    moodLucid: "✨ Lúcido & Consciente",
    moodNightmare: "👹 Pesadilla o Temor",
    moodEpic: "🦅 Épico o Trascendental"
  },
  en: {
    title: "Dream Interpretation",
    subtitle: "Decode the hidden messages of your subconscious mind. Analyze symbols, depth psychology, and subtle messages from the astral plane.",
    formLabel: "Describe your dream in detail",
    formPlaceholder: "Describe what you saw, heard, and felt... the objects, colors, people, animals, or emotions you remember upon waking.",
    moodLabel: "Emotional Tone of the Dream",
    interpretBtn: "Interpret Dream",
    interpreting: "Analyzing threads of the unconscious...",
    historyTitle: "Dream Journal (Oneiric Log)",
    noDreams: "Your dream journal is ready. Record your dreams upon waking to discover patterns and messages from your psyche.",
    savedSuccess: "Interpretation saved to your Dream Journal!",
    deleteConfirm: "Do you want to delete this log from your dream journal forever?",
    backBtn: "Back to Dream Journal",
    symbolsTitle: "Dream Symbols & Archetypes",
    psychologicalTitle: "Psychological Meaning (Jungian Analysis)",
    mysticalTitle: "Message from Subtle Planes (Astral)",
    messageTitle: "Subconscious Revelation",
    adviceTitle: "Waking Life Integration",
    shareText: "Share Dream",
    anonymousNote: "Temple Note: Your dreams are deeply personal. All dream logs and analyses are strictly stored locally and privately in your browser.",
    moodPeaceful: "🧘 Peaceful & Harmonious",
    moodAnxious: "😰 Anxious & Stressful",
    moodBizarre: "🌀 Bizarre & Surreal",
    moodLucid: "✨ Lucid & Aware",
    moodNightmare: "👹 Nightmare or Fearful",
    moodEpic: "🦅 Epic or Transcendental"
  },
  pt: {
    title: "Interpretação de Sonhos",
    subtitle: "Decifre as mensagens ocultas da sua mente subconsciente. Analise os símbolos, a psicologia profunda e as revelações do plano astral.",
    formLabel: "Descreva seu sonho detalhadamente",
    formPlaceholder: "Descreva o que você viu, ouviu e sentiu... os objetos, cores, pessoas, animais ou emoções que se lembra ao acordar.",
    moodLabel: "Tom emocional do sonho",
    interpretBtn: "Interpretar Sonho",
    interpreting: "Analisando fios do inconsciente...",
    historyTitle: "Bitácora de Sonhos (Diário Onírico)",
    noDreams: "Seu diário onírico está pronto. Registre seus sonhos ao acordar para descobrir os padrões e mensagens da sua psique.",
    savedSuccess: "Sonho guardado e interpretado no seu Diário Onírico!",
    deleteConfirm: "Deseja excluir este registro do seu diário onírico para sempre?",
    backBtn: "Voltar ao Diário Onírico",
    symbolsTitle: "Símbolos e Arquétipos Oníricos",
    psychologicalTitle: "Significado Psicológico (Análise Junguiana)",
    mysticalTitle: "Mensagem dos Planos Sutis (Astral)",
    messageTitle: "Revelação do Subconsciente",
    adviceTitle: "Integração no Despertar",
    shareText: "Compartilhar",
    anonymousNote: "Nota do Templo: Seus sonhos são íntimos. Todo o diário onírico e sua análise são armazenados estritamente de forma local e privada no seu navegador.",
    moodPeaceful: "🧘 Pacífico & Harmônico",
    moodAnxious: "😰 Ansioso & Estressante",
    moodBizarre: "🌀 Estranho & Surrealista",
    moodLucid: "✨ Lúcido & Consciente",
    moodNightmare: "👹 Pesadelo ou Temor",
    moodEpic: "🦅 Épico ou Transcendental"
  },
  de: {
    title: "Traumdeutung",
    subtitle: "Entschlüsseln Sie die verborgenen Botschaften Ihres Unterbewusstseins. Analysieren Sie Symbole, Tiefenpsychologie und Botschaften aus der Astralebene.",
    formLabel: "Beschreiben Sie Ihren Traum im Detail",
    formPlaceholder: "Beschreiben Sie, was Sie gesehen, gehört und gefühlt haben... Objekte, Farben, Personen, Tiere oder Emotionen, an die Sie sich beim Aufwachen erinnern.",
    moodLabel: "Emotionaler Ton des Traums",
    interpretBtn: "Traum deuten",
    interpreting: "Die Fäden des Unbewussten werden analysiert...",
    historyTitle: "Traumtagebuch (Onirisches Logbuch)",
    noDreams: "Ihr Traumtagebuch ist bereit. Schreiben Sie Ihre Träume nach dem Aufwachen auf, um Muster und Botschaften Ihrer Psyche zu entdecken.",
    savedSuccess: "Deutung im Traumtagebuch gespeichert!",
    deleteConfirm: "Möchten Sie diesen Traum für immer aus Ihrem Tagebuch löschen?",
    backBtn: "Zurück zum Traumtagebuch",
    symbolsTitle: "Traumsymbole & Archetypen",
    psychologicalTitle: "Psychologische Bedeutung (Jung'sche Analyse)",
    mysticalTitle: "Botschaft aus feinstofflichen Ebenen (Astral)",
    messageTitle: "Offenbarung des Unterbewusstseins",
    adviceTitle: "Integration in den Alltag",
    shareText: "Teilen",
    anonymousNote: "Tempel-Notiz: Ihre Träume sind intim. Das gesamte Traumtagebuch und seine Analyse werden lokal und vertraulich in Ihrem Browser gespeichert.",
    moodPeaceful: "🧘 Friedlich & Harmonisch",
    moodAnxious: "😰 Ängstlich & Stressig",
    moodBizarre: "🌀 Seltsam & Surreal",
    moodLucid: "✨ Luzid & Bewusst",
    moodNightmare: "👹 Albtraum oder Ängstlich",
    moodEpic: "🦅 Episch oder Transzendental"
  }
};

export function DreamInterpretation({ language, showToast }: DreamInterpretationProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  // States
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("peaceful");
  const [loading, setLoading] = useState(false);
  const [dreams, setDreams] = useState<DreamInterpretation[]>([]);
  const [activeDream, setActiveDream] = useState<DreamInterpretation | null>(null);

  // Load dream log on mount
  useEffect(() => {
    const saved = safeLocalStorage.getItem("zen_dreams_archive");
    if (saved) {
      try {
        setDreams(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing dreams archive", e);
      }
    }
  }, []);

  const handleInterpret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/dream-interpretation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamDescription: description, dreamMood: mood, language }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      const newInterpretation: DreamInterpretation = {
        id: Date.now().toString(),
        dreamDescription: description,
        dreamMood: mood,
        symbols: data.symbols || [],
        psychologicalMeaning: data.psychologicalMeaning || "Análisis psicológico",
        mysticalMeaning: data.mysticalMeaning || "Mensaje del plano astral",
        message: data.message || "Revelación clave",
        advice: data.advice || "Consejo diario",
        date: new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "de-DE", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updated = [newInterpretation, ...dreams];
      setDreams(updated);
      safeLocalStorage.setItem("zen_dreams_archive", JSON.stringify(updated));
      setActiveDream(newInterpretation);
      showToast(t.savedSuccess, "success");

      // Clear form
      setDescription("");
      setMood("peaceful");
    } catch (err: any) {
      console.error(err);
      showToast(language === "en" ? "Subconscious connection was interrupted." : "La sintonización con el subconsciente se interrumpió.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.deleteConfirm)) {
      const updated = dreams.filter(d => d.id !== id);
      setDreams(updated);
      safeLocalStorage.setItem("zen_dreams_archive", JSON.stringify(updated));
      if (activeDream?.id === id) {
        setActiveDream(null);
      }
      showToast(language === "en" ? "Dream removed from logs." : "Sueño eliminado de la bitácora.", "info");
    }
  };

  const handleShare = () => {
    if (!activeDream) return;
    const shareTitle = `${t.title} - ${getMoodEmojiLabel(activeDream.dreamMood)}`;
    const symbolsStr = activeDream.symbols.map(s => `*${s.name}:* ${s.meaning}`).join("\n");
    const shareText = `*${t.title}*\n\n*${t.messageTitle}:*\n"${activeDream.message}"\n\n*Símbolos destacados:*\n${symbolsStr}\n\n*${t.adviceTitle}:*\n${activeDream.advice}`;
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.origin
      }).then(() => showToast(language === "en" ? "Reading Shared!" : "¡Lectura compartida!", "success"))
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

  const getMoodEmojiLabel = (mVal: string) => {
    switch (mVal) {
      case "peaceful": return t.moodPeaceful;
      case "anxious": return t.moodAnxious;
      case "bizarre": return t.moodBizarre;
      case "lucid": return t.moodLucid;
      case "nightmare": return t.moodNightmare;
      default: return t.moodEpic;
    }
  };

  const getMoodColor = (mVal: string) => {
    switch (mVal) {
      case "peaceful": return "bg-emerald-500/10 border-emerald-500/25 text-emerald-400";
      case "anxious": return "bg-amber-500/10 border-amber-500/25 text-amber-400";
      case "bizarre": return "bg-indigo-500/10 border-indigo-500/25 text-indigo-400";
      case "lucid": return "bg-purple-500/10 border-purple-500/25 text-purple-400";
      case "nightmare": return "bg-red-500/10 border-red-500/25 text-red-400";
      default: return "bg-cyan-500/10 border-cyan-500/25 text-cyan-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8" id="dream-interpretation-module">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-18 h-18 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Moon className="w-9 h-9 text-indigo-400 animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white mt-2">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        
        {/* Actions bar */}
        <div className="flex justify-between items-center gap-3">
          {activeDream && (
            <button
              onClick={() => setActiveDream(null)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4.5 h-4.5" /> {t.backBtn}
            </button>
          )}

          {!activeDream && <div />}
          <span className="text-xs sm:text-sm text-slate-500 max-w-sm text-right leading-normal font-medium hidden sm:inline">
            {t.anonymousNote}
          </span>
        </div>

        {/* 1. ONIRIC TUNING LOADER */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 bg-slate-950/45 border border-slate-900 rounded-3xl text-center flex flex-col items-center justify-center gap-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]"></div>
            
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-indigo-500/20 border-t-indigo-500/80 animate-spin"></div>
              <div className="absolute w-20 h-20 rounded-full border border-teal-500/10 border-b-teal-500/60 animate-spin [animation-direction:reverse]"></div>
              <Moon className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-serif font-black text-indigo-300 animate-pulse">{t.interpreting}</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed italic">
                {language === "es" && "Desenredando los hilos oníricos del plano astral, mapeando símbolos y arquetipos del inconsciente..."}
                {language === "en" && "Untangling dream threads from the astral plane, mapping subconscious symbols and archetypes..."}
                {language === "pt" && "Desembaraçando fios oníricos do plano astral, mapeando símbolos e arquétipos do inconsciente..."}
                {language === "de" && "Traumfäden aus der Astralebene werden entwirrt, Symbole und Archetypen des Unterbewusstseins werden kartiert..."}
              </p>
            </div>
          </motion.div>
        )}

        {/* 2. COMPREHENSIVE DREAM INTERPRETATION VIEW */}
        {activeDream && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getMoodColor(activeDream.dreamMood)}`}>
                    {getMoodEmojiLabel(activeDream.dreamMood)}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 ml-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {activeDream.date}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-white mt-1.5 leading-tight">
                  {language === "en" ? "Dream Insight" : language === "pt" ? "Análise Onírica" : "Revelación Onírica"}
                </h3>
                <p className="text-xs text-slate-400 italic font-serif leading-relaxed mt-1">
                  <strong>Sueño:</strong> "{activeDream.dreamDescription}"
                </p>
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

            {/* Glowing Revelation Message */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/20 to-purple-950/20 border border-indigo-500/25 flex flex-col gap-2 text-center items-center">
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">{t.messageTitle}</span>
              <p className="font-serif italic text-base sm:text-lg text-indigo-200 font-bold leading-relaxed max-w-2xl">
                "{activeDream.message}"
              </p>
            </div>

            {/* Dream symbols list */}
            {activeDream.symbols && activeDream.symbols.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> {t.symbolsTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeDream.symbols.map((symbol, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 flex flex-col gap-1.5 hover:border-slate-850 transition-colors">
                      <span className="text-xs font-black text-indigo-300 font-serif flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" /> {symbol.name}
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed font-serif">{symbol.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Depth analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              {/* Psychological */}
              <div className="p-5 rounded-2xl bg-slate-900/10 border border-slate-900 flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {t.psychologicalTitle}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {activeDream.psychologicalMeaning}
                </p>
              </div>

              {/* Mystical */}
              <div className="p-5 rounded-2xl bg-slate-900/10 border border-slate-900 flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> {t.mysticalTitle}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {activeDream.mysticalMeaning}
                </p>
              </div>
            </div>

            {/* Practical integration advice */}
            <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">{t.adviceTitle}</span>
              <p className="text-sm text-slate-300 leading-relaxed font-serif">
                {activeDream.advice}
              </p>
            </div>

          </motion.div>
        )}

        {/* 3. LIST OF PAST ENTRIES & FORM */}
        {!activeDream && !loading && (
          <div className="flex flex-col gap-6">
            
            {/* Form to submit dream */}
            <form onSubmit={handleInterpret} className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

              {/* Textarea dream description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" /> {t.formLabel}
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.formPlaceholder}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all text-sm font-serif leading-relaxed"
                />
              </div>

              {/* Mood selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> {t.moodLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "peaceful", label: t.moodPeaceful },
                    { id: "anxious", label: t.moodAnxious },
                    { id: "bizarre", label: t.moodBizarre },
                    { id: "lucid", label: t.moodLucid },
                    { id: "nightmare", label: t.moodNightmare },
                    { id: "epic", label: t.moodEpic },
                  ].map((mOpt) => (
                    <button
                      key={mOpt.id}
                      type="button"
                      onClick={() => setMood(mOpt.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        mood === mOpt.id
                          ? "bg-indigo-950/45 border-indigo-500/80 text-indigo-300 ring-2 ring-indigo-500/20"
                          : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                      }`}
                    >
                      {mOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-600 hover:to-purple-700 text-white font-black uppercase tracking-wider text-xs transition-all duration-300 shadow-lg shadow-indigo-950/40 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                {t.interpretBtn}
              </button>
            </form>

            {/* Dream Log list */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-serif font-bold text-white tracking-wide border-b border-slate-900 pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400 animate-pulse" /> {t.historyTitle}
              </h3>

              {dreams.length === 0 ? (
                <div className="p-12 bg-slate-900/10 border border-slate-900/60 rounded-3xl text-center flex flex-col items-center gap-3.5">
                  <Clock className="w-10 h-10 text-slate-700 animate-pulse" />
                  <p className="text-xs sm:text-sm text-slate-500 italic max-w-sm leading-relaxed font-semibold">
                    {t.noDreams}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dreams.map((dream) => (
                    <motion.div
                      key={dream.id}
                      onClick={() => setActiveDream(dream)}
                      className="p-5 bg-slate-950/40 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-98 cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.01] group-hover:bg-indigo-500/[0.02] rounded-full blur-xl pointer-events-none transition-all"></div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getMoodColor(dream.dreamMood)}`}>
                            {getMoodEmojiLabel(dream.dreamMood).split(" ")[1] || getMoodEmojiLabel(dream.dreamMood)}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {dream.date.split(" a las")[0] || dream.date}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-serif line-clamp-2 leading-relaxed italic">
                          "{dream.dreamDescription}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900">
                        <span className="text-[10px] font-bold text-indigo-300 font-serif leading-tight truncate max-w-[200px]">
                          {dream.message}
                        </span>
                        <button
                          onClick={(e) => handleDelete(dream.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-950/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Eliminar sueño"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Help Card */}
            <div className="p-5 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-slate-400">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
              <p>
                {language === "es" 
                  ? "Para registrar mejor tus sueños, escribe en presente tal como si los estuvieras reviviendo. Los símbolos, colores y animales contienen códigos evolutivos del inconsciente colectivo."
                  : "To record your dreams best, write them in the present tense as if you were reliving them. Symbols, colors, and animals contain evolutionary codes from the collective unconscious."}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
