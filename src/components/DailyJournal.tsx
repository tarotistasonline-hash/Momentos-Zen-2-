import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "../utils/safeStorage";
import { 
  Book, 
  PenTool, 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  Smile, 
  Sliders, 
  ChevronRight, 
  Sparkles, 
  X, 
  Save, 
  ArrowLeft,
  BookOpen,
  Info
} from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  mood: string;
  peaceLevel: number;
  date: string;
}

interface DailyJournalProps {
  language: "es" | "en" | "pt" | "de";
}

const TRANSLATIONS = {
  es: {
    title: "Diario Espiritual",
    subtitle: "Un espacio sagrado para registrar tus meditaciones, sueños, sincronicidades y reflexiones místicas.",
    newEntry: "Nueva Entrada",
    noEntries: "Tu diario espiritual está listo. Comienza a registrar tus experiencias para contemplar tu evolución.",
    entryTitlePlaceholder: "Título de tu experiencia...",
    entryContentPlaceholder: "Describe detalladamente lo que has sentido, visualizado o descubierto en tu práctica de hoy...",
    categoryLabel: "Categoría del suceso",
    moodLabel: "Estado vibracional",
    peaceLevelLabel: "Nivel de Paz Interior",
    saveBtn: "Guardar en tu Diario",
    deleteBtn: "Eliminar entrada",
    searchPlaceholder: "Buscar experiencias por título o contenido...",
    filterAll: "Todos los Sucesos",
    catMeditation: "🧘 Meditación Activa",
    catTarot: "🔮 Tarot & Oráculo",
    catDreams: "🌙 Sueños Reveladores",
    catSynchronicity: "✨ Sincronicidades",
    catGeneral: "🌿 Reflexión General",
    savedSuccess: "¡Entrada guardada en tu Diario del Alma!",
    deleteConfirm: "¿Deseas borrar esta vivencia del diario para siempre?",
    viewEntry: "Visualizar Entrada",
    backToList: "Volver al Diario",
    anonymousNote: "Nota Privada: Todo el contenido de este diario se almacena localmente de forma privada en tu navegador.",
    moodPeaceful: "🕊️ Paz Absoluta",
    moodGrateful: "💖 Gratitud",
    moodMystic: "🌌 Conexión Mística",
    moodInspired: "💡 Inspiración",
    moodPensive: "🧘‍♂️ Contemplación",
    moodRestless: "🍃 Búsqueda de Calma",
    welcomeTitle: "Bienvenido a tu Diario del Alma ✨",
    welcomeContent: "Este diario es un refugio privado diseñado para capturar la vibración de tu camino espiritual. Aquí puedes escribir libremente sobre tus estados emocionales después de meditar, las revelaciones de las cartas de Tarot, los sueños que resuenan en tu despertar o las sincronías numéricas y cósmicas de tu día. Cada entrada te ayudará a tejer una bitácora de autodescubrimiento y paz interior.",
  },
  en: {
    title: "Spiritual Journal",
    subtitle: "A sacred space to record your meditations, dreams, synchronicities, and mystical reflections.",
    newEntry: "New Entry",
    noEntries: "Your spiritual journal is ready. Start recording your experiences to contemplate your evolution.",
    entryTitlePlaceholder: "Title of your experience...",
    entryContentPlaceholder: "Describe in detail what you felt, visualized, or discovered in your practice today...",
    categoryLabel: "Event Category",
    moodLabel: "Vibrational State",
    peaceLevelLabel: "Inner Peace Level",
    saveBtn: "Save to your Journal",
    deleteBtn: "Delete entry",
    searchPlaceholder: "Search experiences by title or content...",
    filterAll: "All Events",
    catMeditation: "🧘 Active Meditation",
    catTarot: "🔮 Tarot & Oracle",
    catDreams: "🌙 Revelatory Dreams",
    catSynchronicity: "✨ Synchronicities",
    catGeneral: "🌿 General Reflection",
    savedSuccess: "Entry saved in your Soul Journal!",
    deleteConfirm: "Do you want to erase this experience from the journal forever?",
    viewEntry: "View Entry",
    backToList: "Back to Journal",
    anonymousNote: "Private Note: All contents of this journal are stored locally and privately in your browser.",
    moodPeaceful: "🕊️ Absolute Peace",
    moodGrateful: "💖 Gratitude",
    moodMystic: "🌌 Mystical Connection",
    moodInspired: "💡 Inspiration",
    moodPensive: "🧘‍♂️ Contemplation",
    moodRestless: "🍃 Seeking Calm",
    welcomeTitle: "Welcome to your Soul Journal ✨",
    welcomeContent: "This journal is a private sanctuary designed to capture the vibration of your spiritual journey. Here you can write freely about your emotional states after meditating, the revelations from your Tarot cards, the dreams that resonate upon awakening, or the numerical and cosmic synchronicities of your day. Each entry will help you weave a log of self-discovery and inner peace.",
  },
  pt: {
    title: "Diário Espiritual",
    subtitle: "Um espaço sagrado para registrar suas meditações, sonhos, sincronicidades e reflexões místicas.",
    newEntry: "Nova Entrada",
    noEntries: "Seu diário espiritual está pronto. Comece a registrar suas experiências para contemplar sua evolução.",
    entryTitlePlaceholder: "Título da sua experiência...",
    entryContentPlaceholder: "Descreva em detalhes o que você sentiu, visualizou ou descobriu na sua prática hoje...",
    categoryLabel: "Categoria do Evento",
    moodLabel: "Estado Vibracional",
    peaceLevelLabel: "Nível de Paz Interior",
    saveBtn: "Salvar no seu Diário",
    deleteBtn: "Excluir entrada",
    searchPlaceholder: "Pesquisar experiências por título ou conteúdo...",
    filterAll: "Todos os Eventos",
    catMeditation: "🧘 Meditação Ativa",
    catTarot: "🔮 Tarô & Oráculo",
    catDreams: "🌙 Sonhos Reveladores",
    catSynchronicity: "✨ Sincronicidades",
    catGeneral: "🌿 Reflexão Geral",
    savedSuccess: "Entrada salva no seu Diário da Alma!",
    deleteConfirm: "Deseja apagar essa vivência do diário para sempre?",
    viewEntry: "Visualizar Entrada",
    backToList: "Voltar ao Diário",
    anonymousNote: "Nota Privada: Todo o conteúdo deste diário é armazenado localmente de forma privada no seu navegador.",
    moodPeaceful: "🕊️ Paz Absoluta",
    moodGrateful: "💖 Gratidão",
    moodMystic: "🌌 Conexão Mística",
    moodInspired: "💡 Inspiração",
    moodPensive: "🧘‍♂️ Contemplação",
    moodRestless: "🍃 Buscando Calma",
    welcomeTitle: "Bem-vindo ao seu Diário da Alma ✨",
    welcomeContent: "Este diário é um santuário privado projetado para capturar a vibração do seu caminho espiritual. Aqui você pode escrever livremente sobre seus estados emocionais após meditar, as revelações das cartas de Tarô, os sonhos que ressoam em seu despertar ou as sincronicidades numéricas e cósmicas do seu dia. Cada entrada ajudará você a tecer uma bitácora de autodescoberta e paz interior.",
  },
  de: {
    title: "Spirituelles Tagebuch",
    subtitle: "Ein heiliger Ort, um Ihre Meditationen, Träume, Synchronizitäten und mystischen Reflexionen festzuhalten.",
    newEntry: "Neuer Eintrag",
    noEntries: "Ihr spirituelles Tagebuch ist bereit. Beginnen Sie mit der Aufzeichnung Ihrer Erfahrungen, um Ihre Entwicklung zu betrachten.",
    entryTitlePlaceholder: "Titel Ihrer Erfahrung...",
    entryContentPlaceholder: "Beschreiben Sie im Detail, was Sie heute in Ihrer Praxis gefühlt, visualisiert oder entdeckt haben...",
    categoryLabel: "Ereigniskategorie",
    moodLabel: "Schwingungszustand",
    peaceLevelLabel: "Innere Friedensebene",
    saveBtn: "Im Tagebuch speichern",
    deleteBtn: "Eintrag löschen",
    searchPlaceholder: "Erfahrungen nach Titel oder Inhalt durchsuchen...",
    filterAll: "Alle Ereignisse",
    catMeditation: "🧘 Aktive Meditation",
    catTarot: "🔮 Tarot & Orakel",
    catDreams: "🌙 Offenbarende Träume",
    catSynchronicity: "✨ Synchronizitäten",
    catGeneral: "🌿 Allgemeine Reflexion",
    savedSuccess: "Eintrag im Seelentagebuch gespeichert!",
    deleteConfirm: "Möchten Sie dieses Erlebnis für immer aus dem Tagebuch löschen?",
    viewEntry: "Eintrag anzeigen",
    backToList: "Zurück zum Tagebuch",
    anonymousNote: "Private Notiz: Alle Inhalte dieses Tagebuchs werden lokal und vertraulich in Ihrem Browser gespeichert.",
    moodPeaceful: "🕊️ Absoluter Frieden",
    moodGrateful: "💖 Dankbarkeit",
    moodMystic: "🌌 Mystische Verbindung",
    moodInspired: "💡 Inspiration",
    moodPensive: "🧘‍♂️ Kontemplation",
    moodRestless: "🍃 Suche nach Ruhe",
    welcomeTitle: "Willkommen in Ihrem Seelentagebuch ✨",
    welcomeContent: "Dieses Tagebuch ist ein privater Zufluchtsort, um die Schwingung Ihrer spirituellen Reise festzuhalten. Hier können Sie frei über Ihre emotionalen Zustände nach der Meditation, die Offenbarungen Ihrer Tarotkarten, Ihre Träume oder kosmische Synchronizitäten Ihres Tages schreiben. Jeder Eintrag hilft Ihnen dabei, ein Protokoll der Selbsterkenntnis und des inneren Friedens zu führen.",
  }
};

export function DailyJournal({ language }: DailyJournalProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  // Local state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("meditation");
  const [formMood, setFormMood] = useState("peaceful");
  const [formPeaceLevel, setFormPeaceLevel] = useState(7);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Load entries
  useEffect(() => {
    const saved = safeLocalStorage.getItem("zen_journal_entries");
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing journal entries", e);
      }
    } else {
      // Pre-populate with beautiful welcome entry
      const welcome: JournalEntry = {
        id: "welcome",
        title: t.welcomeTitle,
        content: t.welcomeContent,
        category: "general",
        mood: "mystic",
        peaceLevel: 9,
        date: new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "de-DE", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setEntries([welcome]);
      safeLocalStorage.setItem("zen_journal_entries", JSON.stringify([welcome]));
    }
  }, [language, t.welcomeTitle, t.welcomeContent]);

  // Save new entry
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: formTitle,
      content: formContent,
      category: formCategory,
      mood: formMood,
      peaceLevel: formPeaceLevel,
      date: new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "de-DE", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    safeLocalStorage.setItem("zen_journal_entries", JSON.stringify(updated));

    // Clear form
    setFormTitle("");
    setFormContent("");
    setFormCategory("meditation");
    setFormMood("peaceful");
    setFormPeaceLevel(7);
    setIsCreating(false);

    // Toast feedback
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Delete entry
  const handleDelete = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      safeLocalStorage.setItem("zen_journal_entries", JSON.stringify(updated));
      if (viewingEntry?.id === id) {
        setViewingEntry(null);
      }
    }
  };

  // Filter logic
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "meditation": return t.catMeditation;
      case "tarot": return t.catTarot;
      case "dreams": return t.catDreams;
      case "synchronicity": return t.catSynchronicity;
      default: return t.catGeneral;
    }
  };

  const getMoodLabel = (moodVal: string) => {
    switch (moodVal) {
      case "peaceful": return t.moodPeaceful;
      case "grateful": return t.moodGrateful;
      case "mystic": return t.moodMystic;
      case "inspired": return t.moodInspired;
      case "pensive": return t.moodPensive;
      default: return t.moodRestless;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "meditation": return "bg-emerald-500/10 border-emerald-500/25 text-emerald-400";
      case "tarot": return "bg-purple-500/10 border-purple-500/25 text-purple-400";
      case "dreams": return "bg-indigo-500/10 border-indigo-500/25 text-indigo-400";
      case "synchronicity": return "bg-amber-500/10 border-amber-500/25 text-amber-400";
      default: return "bg-slate-500/10 border-slate-500/25 text-slate-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8" id="daily-journal-module">
      {/* Toast Notification */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-sm sm:text-base"
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            {t.savedSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-18 h-18 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Book className="w-9 h-9 text-emerald-400 animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white mt-2">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Main Action Bar & Display area */}
      <div className="w-full flex flex-col gap-6">
        
        {/* Toggle between writing & list */}
        <div className="flex justify-between items-center gap-3">
          {!isCreating && !viewingEntry ? (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-emerald-950/30 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" /> {t.newEntry}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCreating(false);
                setViewingEntry(null);
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4.5 h-4.5" /> {t.backToList}
            </button>
          )}

          {/* Privacy disclaimer */}
          <span className="text-xs sm:text-sm text-slate-500 max-w-sm text-right hidden sm:inline leading-normal font-medium">
            {t.anonymousNote}
          </span>
        </div>

        {/* 1. VIEWING FULL DETAIL OF AN ENTRY */}
        {viewingEntry && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(viewingEntry.category)}`}>
                    {getCategoryLabel(viewingEntry.category)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300">
                    {getMoodLabel(viewingEntry.mood)}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 ml-1">
                    <Calendar className="w-4 h-4 text-slate-500" /> {viewingEntry.date}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white mt-1.5 leading-tight">
                  {viewingEntry.title}
                </h3>
              </div>

              {viewingEntry.id !== "welcome" && (
                <button
                  onClick={() => handleDelete(viewingEntry.id)}
                  className="px-4 py-2.5 rounded-xl bg-red-950/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  title={t.deleteBtn}
                >
                  <Trash2 className="w-4 h-4" /> {t.deleteBtn}
                </button>
              )}
            </div>

            {/* Inner peace visual badge */}
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex items-center gap-4">
              <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">{t.peaceLevelLabel}:</span>
              <div className="flex items-center gap-3 flex-1">
                <div className="h-2.5 bg-slate-900 rounded-full flex-1 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${viewingEntry.peaceLevel * 10}%` }}
                  />
                </div>
                <span className="text-sm sm:text-base font-mono font-black text-emerald-400">{viewingEntry.peaceLevel}/10</span>
              </div>
            </div>

            <div className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-normal whitespace-pre-wrap font-serif tracking-normal">
              {viewingEntry.content}
            </div>
          </motion.div>
        )}

        {/* 2. CREATING A NEW ENTRY */}
        {isCreating && (
          <motion.form
            onSubmit={handleSave}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white flex items-center gap-2">
                <PenTool className="w-5.5 h-5.5 text-emerald-400" /> {t.newEntry}
              </h3>
            </div>

            {/* Input fields */}
            <div className="flex flex-col gap-5">
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={t.entryTitlePlaceholder}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-semibold text-sm sm:text-base"
              />

              {/* Grid selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.categoryLabel}</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <option value="meditation">{t.catMeditation}</option>
                    <option value="tarot">{t.catTarot}</option>
                    <option value="dreams">{t.catDreams}</option>
                    <option value="synchronicity">{t.catSynchronicity}</option>
                    <option value="general">{t.catGeneral}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.moodLabel}</label>
                  <select
                    value={formMood}
                    onChange={(e) => setFormMood(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <option value="peaceful">{t.moodPeaceful}</option>
                    <option value="grateful">{t.moodGrateful}</option>
                    <option value="mystic">{t.moodMystic}</option>
                    <option value="inspired">{t.moodInspired}</option>
                    <option value="pensive">{t.moodPensive}</option>
                    <option value="restless">{t.moodRestless}</option>
                  </select>
                </div>
              </div>

              {/* Peace slider */}
              <div className="flex flex-col gap-3 bg-slate-900/30 p-5 border border-slate-900 rounded-2xl mt-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{t.peaceLevelLabel}</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm sm:text-base">{formPeaceLevel} / 10</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formPeaceLevel}
                    onChange={(e) => setFormPeaceLevel(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-500 cursor-pointer h-2 rounded-full bg-slate-900"
                  />
                </div>
              </div>

              {/* Text area */}
              <textarea
                required
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder={t.entryContentPlaceholder}
                rows={8}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all text-sm sm:text-base md:text-lg leading-relaxed font-serif"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2"
            >
              <Save className="w-5 h-5" /> {t.saveBtn}
            </button>
          </motion.form>
        )}

        {/* 3. ENTRIES LIST VIEW */}
        {!isCreating && !viewingEntry && (
          <div className="flex flex-col gap-5">
            
            {/* Search and Category Filter box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-slate-900/60 border border-slate-900 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/35 transition-all"
                />
              </div>

              {/* Category filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900/60 border border-slate-900 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-300 focus:outline-none focus:border-emerald-500/35 transition-all cursor-pointer"
              >
                <option value="all">{t.filterAll}</option>
                <option value="meditation">{t.catMeditation}</option>
                <option value="tarot">{t.catTarot}</option>
                <option value="dreams">{t.catDreams}</option>
                <option value="synchronicity">{t.catSynchronicity}</option>
                <option value="general">{t.catGeneral}</option>
              </select>
            </div>

            {/* List entries layout */}
            {filteredEntries.length === 0 ? (
              <div className="p-14 bg-slate-900/10 border border-slate-900/60 rounded-3xl text-center flex flex-col items-center gap-3.5">
                <BookOpen className="w-12 h-12 text-slate-600 animate-pulse" />
                <p className="text-sm sm:text-base text-slate-400 max-w-md italic leading-relaxed font-semibold">
                  {t.noEntries}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    onClick={() => setViewingEntry(entry)}
                    className="p-6 bg-slate-950/45 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 rounded-3xl flex flex-col gap-3.5 shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.01] group-hover:bg-emerald-500/[0.03] rounded-full blur-xl pointer-events-none transition-all duration-300"></div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryColor(entry.category)}`}>
                        {getCategoryLabel(entry.category)}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {entry.date}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-base sm:text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition-colors leading-tight font-serif">
                        {entry.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mt-1 font-serif">
                        {entry.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2 border-t border-slate-900 pt-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
                        <Smile className="w-4 h-4 text-slate-500" /> {getMoodLabel(entry.mood)}
                      </span>
                      <span className="text-xs text-slate-300 flex items-center gap-1 font-bold">
                        Paz: <span className="font-mono text-emerald-400 text-sm">{entry.peaceLevel}/10</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Bottom help card */}
            <div className="p-5 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-400 mt-2">
              <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                {language === "es" 
                  ? "Este diario es completamente privado. Nadie más puede leer tus notas ya que solo existen en la memoria segura de tu propio navegador web local. Ideal para hacer balances diarios después de meditar y contemplar el camino del alma."
                  : language === "en"
                  ? "This journal is completely private. Nobody else can read your notes as they only exist in your own local web browser's secure memory. Ideal for daily reflection after meditating and contemplating the soul's path."
                  : language === "pt"
                  ? "Este diário é completamente privado. Ninguém mais pode ler suas notas, pois elas existem apenas na memória segura do seu próprio navegador web local. Ideal para fazer reflexões diárias após meditar e contemplar o caminho da alma."
                  : "Dieses Tagebuch ist absolut vertraulich. Niemand sonst kann Ihre Notizen lesen, da sie nur im sicheren Speicher Ihres eigenen lokalen Webbrowsers existieren. Ideal für tägliche Reflexionen nach der Meditation."}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
