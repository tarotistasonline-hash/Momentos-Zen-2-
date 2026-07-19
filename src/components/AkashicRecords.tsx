import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "../utils/safeStorage";
import { 
  Sparkles, 
  User, 
  Calendar, 
  HelpCircle, 
  Compass, 
  Key, 
  BookOpen, 
  RotateCcw, 
  Share2, 
  Download, 
  ChevronRight, 
  ArrowLeft, 
  Trash2, 
  Info,
  Clock
} from "lucide-react";

interface AkashicConsultation {
  id: string;
  name: string;
  birthdate: string;
  question: string;
  vibration: string;
  akashicKey: string;
  soulOrigin: string;
  pastLifeLesson: string;
  presentBlockage: string;
  futurePotential: string;
  advice: string;
  mantra: string;
  date: string;
}

interface AkashicRecordsProps {
  language: "es" | "en" | "pt" | "de";
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
}

const TRANSLATIONS = {
  es: {
    title: "Registros Akáshicos",
    subtitle: "Acede al libro éterico de la memoria cósmica para comprender el origen, las lecciones kármicas y la misión divina de tu alma.",
    formName: "Nombre completo de encarnación",
    formBirth: "Fecha de nacimiento terrestre",
    formQuestion: "¿Qué deseas consultar en la memoria cósmica?",
    formQuestionPlaceholder: "Ej: ¿Cuál es mi propósito espiritual?, ¿Qué lazo kármico debo disolver?, ¿Cuál es mi lección actual?",
    consultBtn: "Abrir Registros Akáshicos",
    consulting: "Canalizando con los Guardianes del Akasha...",
    historyTitle: "Bitácora de Aperturas Akáshicas",
    noConsults: "Aún no has abierto tus Registros Akáshicos. Formula una intención pura para recibir la sabiduría de tus guías.",
    soulOrigin: "Origen Galáctico del Alma",
    akashicKey: "Sello de Sintonización",
    vibration: "Frecuencia de Resonancia",
    pastLife: "Memoria de Vidas Pasadas",
    presentBlockage: "Bloqueo Energético Actual",
    futurePotential: "Línea Temporal de Mayor Potencial",
    advice: "Mensaje de los Maestros y Guías",
    mantra: "Mantra de Integración",
    deleteConfirm: "¿Deseas borrar esta consulta akáshica para siempre?",
    backBtn: "Volver a la Bitácora",
    savedSuccess: "¡Consulta guardada en tu memoria local del alma!",
    shareText: "Compartir Lectura",
    exportText: "Exportar como PDF",
    anonymousNote: "Nota Sagrada: Todo el contenido de tus consultas akáshicas se almacena de forma local y privada en tu propio navegador.",
  },
  en: {
    title: "Akashic Records",
    subtitle: "Access the etheric book of cosmic memory to understand your soul's origin, karmic lessons, and divine mission.",
    formName: "Full Encarnation Name",
    formBirth: "Earthly Birthdate",
    formQuestion: "What do you wish to consult in the cosmic memory?",
    formQuestionPlaceholder: "E.g., What is my spiritual purpose?, What karmic tie should I dissolve?, What is my current lesson?",
    consultBtn: "Open Akashic Records",
    consulting: "Channeling with the Guardians of Akasha...",
    historyTitle: "Akashic Consultation Logs",
    noConsults: "You haven't opened your Akashic Records yet. Formulate a pure intention to receive wisdom from your guides.",
    soulOrigin: "Galactic Soul Origin",
    akashicKey: "Tuning Seal",
    vibration: "Resonance Frequency",
    pastLife: "Past Life Memory",
    presentBlockage: "Current Energy Blockage",
    futurePotential: "Timeline of Highest Potential",
    advice: "Message from Masters & Guides",
    mantra: "Integration Mantra",
    deleteConfirm: "Do you want to erase this Akashic consultation forever?",
    backBtn: "Back to Logs",
    savedSuccess: "Consultation saved to your soul's local memory!",
    shareText: "Share Reading",
    exportText: "Export as PDF",
    anonymousNote: "Sacred Note: All Akashic consultations are stored locally and privately in your own browser.",
  },
  pt: {
    title: "Registros Akáshicos",
    subtitle: "Acesse o livro etérico da memória cósmica para compreender a origem, lições cármicas e a missão divina da sua alma.",
    formName: "Nome completo de encarnação",
    formBirth: "Data de nascimento terrestre",
    formQuestion: "O que você deseja consultar na memória cósmica?",
    formQuestionPlaceholder: "Ex: Qual é o meu propósito espiritual?, Qual laço cármico devo dissolver?, Qual é a minha lição atual?",
    consultBtn: "Abrir Registros Akáshicos",
    consulting: "Canalizando com os Guardiões do Akasha...",
    historyTitle: "Bitácora de Consultas Akáshicas",
    noConsults: "Você ainda não abriu seus Registros Akáshicos. Formule uma intenção pura para receber a sabedoria dos seus guias.",
    soulOrigin: "Origem Galáctica da Alma",
    akashicKey: "Selo de Sintonização",
    vibration: "Frequência de Ressonância",
    pastLife: "Memória de Vidas Passadas",
    presentBlockage: "Bloqueio Energético Atual",
    futurePotential: "Linha Temporal de Maior Potencial",
    advice: "Mensagem dos Mestres e Guias",
    mantra: "Mantra de Integração",
    deleteConfirm: "Deseja excluir esta consulta akáshica para sempre?",
    backBtn: "Voltar às Consultas",
    savedSuccess: "Consulta salva na sua memória local da alma!",
    shareText: "Compartilhar",
    exportText: "Exportar como PDF",
    anonymousNote: "Nota Sagrada: Todo o conteúdo das suas consultas akáshicas é armazenado de forma local e privada no seu próprio navegador.",
  },
  de: {
    title: "Akasha-Chronik",
    subtitle: "Greifen Sie auf das ätherische Buch des kosmischen Gedächtnisses zu, um die Herkunft, die karmischen Lektionen und die göttliche Mission Ihrer Seele zu verstehen.",
    formName: "Vollständiger Inkarnationsname",
    formBirth: "Irdisches Geburtsdatum",
    formQuestion: "Was möchten Sie im kosmischen Gedächtnis abfragen?",
    formQuestionPlaceholder: "Z.B. Was ist meine spirituelle Bestimmung?, Welche karmischen Bande sollte ich lösen?, Was ist meine aktuelle Lektion?",
    consultBtn: "Akasha-Chronik öffnen",
    consulting: "Kanalisierung mit den Wächtern der Akasha...",
    historyTitle: "Akasha-Konsultationsprotokolle",
    noConsults: "Sie haben Ihre Akasha-Chronik noch nicht geöffnet. Formulieren Sie eine reine Absicht, um Weisheit von Ihren Führern zu erhalten.",
    soulOrigin: "Galaktischer Seelenursprung",
    akashicKey: "Einstimmungssiegel",
    vibration: "Resonanzfrequenz",
    pastLife: "Erinnerung an vergangene Leben",
    presentBlockage: "Aktuelle energetische Blockade",
    futurePotential: "Zeitlinie des höchsten Potenzials",
    advice: "Botschaft der Meister & Führer",
    mantra: "Integrationsmantra",
    deleteConfirm: "Möchten Sie diese Akasha-Konsultation für immer löschen?",
    backBtn: "Zurück zu den Protokollen",
    savedSuccess: "Konsultation im lokalen Gedächtnis Ihrer Seele gespeichert!",
    shareText: "Teilen",
    exportText: "Als PDF exportieren",
    anonymousNote: "Heilige Notiz: Alle Inhalte Ihrer Akasha-Chronik-Konsultationen werden lokal und vertraulich in Ihrem eigenen Browser gespeichert.",
  }
};

export function AkashicRecords({ language, showToast }: AkashicRecordsProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  // States
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [consults, setConsults] = useState<AkashicConsultation[]>([]);
  const [activeConsult, setActiveConsult] = useState<AkashicConsultation | null>(null);

  // Load consults on mount
  useEffect(() => {
    const saved = safeLocalStorage.getItem("zen_akashic_consults");
    if (saved) {
      try {
        setConsults(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing Akashic consults", e);
      }
    }
  }, []);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/akashic-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthdate, question, language }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      const newConsult: AkashicConsultation = {
        id: Date.now().toString(),
        name,
        birthdate,
        question,
        vibration: data.vibration || "528Hz",
        akashicKey: data.akashicKey || "Clave Sagrada",
        soulOrigin: data.soulOrigin || "Semilla Estelar",
        pastLifeLesson: data.pastLifeLesson || "Lección de vidas pasadas",
        presentBlockage: data.presentBlockage || "Bloqueo actual",
        futurePotential: data.futurePotential || "Potencial futuro",
        advice: data.advice || "Consejo akáshico",
        mantra: data.mantra || "Mantra de luz",
        date: new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "de-DE", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updated = [newConsult, ...consults];
      setConsults(updated);
      safeLocalStorage.setItem("zen_akashic_consults", JSON.stringify(updated));
      setActiveConsult(newConsult);
      showToast(t.savedSuccess, "success");

      // Clear form
      setName("");
      setBirthdate("");
      setQuestion("");
    } catch (err: any) {
      console.error(err);
      showToast(language === "en" ? "Connection to the Akashic Records was disrupted." : "La sintonización con los registros se interrumpió.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.deleteConfirm)) {
      const updated = consults.filter(c => c.id !== id);
      setConsults(updated);
      safeLocalStorage.setItem("zen_akashic_consults", JSON.stringify(updated));
      if (activeConsult?.id === id) {
        setActiveConsult(null);
      }
      showToast(language === "en" ? "Consultation removed from logs." : "Consulta eliminada de la bitácora.", "info");
    }
  };

  const handleShare = () => {
    if (!activeConsult) return;
    const shareTitle = `${t.title} - ${activeConsult.name}`;
    const shareText = `*${t.title}*\n\n*${t.soulOrigin}:* ${activeConsult.soulOrigin}\n*${t.vibration}:* ${activeConsult.vibration}\n\n*${t.advice}:*\n"${activeConsult.advice}"\n\n*${t.mantra}:*\n"${activeConsult.mantra}"`;
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.origin
      }).then(() => showToast(language === "en" ? "Reading Shared Successfully!" : "¡Lectura compartida con éxito!", "success"))
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

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8" id="akashic-records-module">
      
      {/* Title block */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-18 h-18 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <BookOpen className="w-9 h-9 text-purple-400 animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white mt-2">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        
        {/* Toggle navigation bar */}
        <div className="flex justify-between items-center gap-3">
          {activeConsult && (
            <button
              onClick={() => setActiveConsult(null)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4.5 h-4.5" /> {t.backBtn}
            </button>
          )}

          {!activeConsult && <div />}
          <span className="text-xs sm:text-sm text-slate-500 max-w-sm text-right leading-normal font-medium hidden sm:inline">
            {t.anonymousNote}
          </span>
        </div>

        {/* 1. PORTAL LOADING OVERLAY */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 bg-slate-950/45 border border-slate-900 rounded-3xl text-center flex flex-col items-center justify-center gap-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)]"></div>
            
            {/* Spinning sacred circles */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-purple-500/20 border-t-purple-500/80 animate-spin"></div>
              <div className="absolute w-20 h-20 rounded-full border border-teal-500/10 border-b-teal-500/60 animate-spin [animation-direction:reverse]"></div>
              <Key className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-serif font-black text-purple-300 animate-pulse">{t.consulting}</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed italic">
                {language === "es" && "Leyendo los campos vibratorios, los lazos kármicos y canalizando la sabiduría de tu Yo Superior..."}
                {language === "en" && "Reading vibrational fields, karmic ties, and channeling wisdom from your Higher Self..."}
                {language === "pt" && "Lendo campos vibracionais, laços cármicos e canalizando a sabedoria do seu Eu Superior..."}
                {language === "de" && "Schwingungsfelder und karmische Verbindungen werden gelesen, Weisheit deines Höheren Selbst wird kanalisiert..."}
              </p>
            </div>
          </motion.div>
        )}

        {/* 2. CONSULTATION RESULTS SCREEN */}
        {activeConsult && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-purple-500/25 bg-purple-500/10 text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeConsult.soulOrigin}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-teal-500/20 bg-teal-500/5 text-teal-300">
                    {activeConsult.vibration}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 ml-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {activeConsult.date}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white mt-1 leading-tight">
                  {activeConsult.name}
                </h3>
                <p className="text-xs text-slate-400 italic">
                  <strong>Consulta:</strong> "{activeConsult.question}"
                </p>
              </div>

              {/* Action Buttons */}
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

            {/* Akashic Seal Visual Key */}
            <div className="bg-slate-900/30 p-4 border border-slate-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Key className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.akashicKey}</span>
                  <h4 className="font-serif text-sm font-black text-purple-300">{activeConsult.akashicKey}</h4>
                </div>
              </div>
              <div className="text-xs text-right text-slate-400 italic max-w-sm sm:block hidden">
                {language === "es" ? "Sintoniza con este sello visualizando su geometría sagrada durante tus meditaciones." : "Tune in to this seal by visualizing its sacred geometry during your meditations."}
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              
              {/* Past Life Lesson */}
              <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" /> {t.pastLife}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {activeConsult.pastLifeLesson}
                </p>
              </div>

              {/* Present Blockage */}
              <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> {t.presentBlockage}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {activeConsult.presentBlockage}
                </p>
              </div>

              {/* Future Potential */}
              <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900 flex flex-col gap-2 md:col-span-2">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> {t.futurePotential}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {activeConsult.futurePotential}
                </p>
              </div>
            </div>

            {/* Masters Message (Callout Card) */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-purple-500/20 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400 animate-pulse" /> {t.advice}
              </h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif font-medium">
                "{activeConsult.advice}"
              </p>
            </div>

            {/* Integration Mantra */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900/60 flex flex-col items-center text-center gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.mantra}</span>
              <p className="font-serif italic text-base sm:text-lg text-amber-200 font-bold">
                "{activeConsult.mantra}"
              </p>
            </div>

          </motion.div>
        )}

        {/* 3. INPUT FORM AND CONSULTATION HISTORIC LOGS */}
        {!activeConsult && !loading && (
          <div className="flex flex-col gap-6">
            
            {/* Form */}
            <form onSubmit={handleConsult} className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" /> {t.formName}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Sofía Elena Martínez"
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/40 transition-all text-sm font-semibold"
                  />
                </div>

                {/* Terrestrial Birthdate */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> {t.formBirth}
                  </label>
                  <input
                    type="text"
                    required
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    placeholder="Ej: 14 de Marzo de 1994"
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/40 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Inquiry Question */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> {t.formQuestion}
                </label>
                <textarea
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.formQuestionPlaceholder}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/40 transition-all text-sm font-serif leading-relaxed"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white font-black uppercase tracking-wider text-xs transition-all duration-300 shadow-lg shadow-purple-950/40 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                {t.consultBtn}
              </button>
            </form>

            {/* History Logs */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-serif font-bold text-white tracking-wide border-b border-slate-900 pb-2 flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400 animate-pulse" /> {t.historyTitle}
              </h3>

              {consults.length === 0 ? (
                <div className="p-12 bg-slate-900/10 border border-slate-900/60 rounded-3xl text-center flex flex-col items-center gap-3.5">
                  <Clock className="w-10 h-10 text-slate-700 animate-pulse" />
                  <p className="text-xs sm:text-sm text-slate-500 italic max-w-sm leading-relaxed font-semibold">
                    {t.noConsults}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {consults.map((consult) => (
                    <motion.div
                      key={consult.id}
                      onClick={() => setActiveConsult(consult)}
                      className="p-5 bg-slate-950/40 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-98 cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/[0.01] group-hover:bg-purple-500/[0.02] rounded-full blur-xl pointer-events-none transition-all"></div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1.5">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{consult.soulOrigin}</span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {consult.date.split(" a las")[0] || consult.date}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-300 transition-colors leading-tight">
                          {consult.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                          "{consult.question}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900">
                        <span className="text-[10px] font-bold text-teal-400 font-mono">{consult.vibration}</span>
                        <button
                          onClick={(e) => handleDelete(consult.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-950/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Eliminar consulta"
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
              <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 animate-bounce" />
              <p>
                {language === "es" 
                  ? "Para abrir tus Registros de forma terapéutica y segura, conéctate con la vibración de tu nombre real de encarnación (el nombre legal o de nacimiento). Esto establece una sintonía directa con tus guías akáshicos. Todo el material canalizado es confidencial y privado."
                  : "To open your Records therapeutically and safely, connect with the vibration of your real incarnation name (your legal or birth name). This establishes a direct attunement with your Akashic guides."}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
