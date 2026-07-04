import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "../utils/safeStorage";
import {
  Sparkles,
  Calendar,
  Compass,
  RefreshCw,
  Award,
  AlertCircle,
  TrendingUp,
  Activity,
  Heart,
  Globe,
  Star,
  Zap,
  Flame,
  Droplet,
  Wind,
  Layers,
  Moon,
  Sun
} from "lucide-react";
import { TwinkleText } from "./TwinkleText";
import { NatalChart } from "./NatalChart";

interface AstrologyTabProps {
  language: "es" | "en" | "pt";
}

const LOCALIZED_ASTRO = {
  es: {
    title: "Clima Astrológico & Perfil Zodiacal",
    desc: "Explora los tránsitos astrológicos de hoy y calcula tu perfil zodiacal según tu nacimiento.",
    tabTransits: "🪐 Clima Astrológico de Hoy",
    tabZodiac: "✨ Perfil Zodiacal Personal",
    birthdateLabel: "Introduce tu Fecha de Nacimiento:",
    calculateBtn: "Calcular Perfil Zodiacal",
    calculating: "Analizando posiciones planetarias de tu nacimiento...",
    zodiacSign: "Signo Solar",
    element: "Elemento Astrológico",
    rulingPlanet: "Regente Planetario",
    personalityTitle: "Características de tu Signo",
    strengthsTitle: "Fortalezas y Virtudes",
    challengesTitle: "Desafíos y Áreas de Crecimiento",
    adviceTitle: "Consejo Astrológico para tu Mindfulness",
    todayClim: "Tránsitos Astrológicos del Día",
    todayClimDesc: "El estado del clima astrológico de hoy y su influencia en tu vida interior.",
    generalVibe: "Clima Astrológico General",
    celestialAspects: "Alineaciones Planetarias Activas",
    celestialAdvice: "Recomendación de Conciencia Diaria",
    zenPractice: "Práctica de Mindfulness Recomendada",
    scoreLabel: "Alineación Astrológica",
    forceRefresh: "Tránsitos Astrológicos",
    errorLoading: "Los astros ocultan su rostro por un momento. Mostrando sabiduría tradicional...",
    enterBirthdatePrompt: "Introduce tu fecha de nacimiento para conocer tu perfil astrológico personalizado.",
    datePlaceholder: "Elige una fecha...",
    noAstrologyData: "Estudiando el clima astrológico actual..."
  },
  en: {
    title: "Astrological Climate & Zodiac Profile",
    desc: "Explore today's astrological transits and calculate your zodiac profile based on your birth.",
    tabTransits: "🪐 Daily Astrological Climate",
    tabZodiac: "✨ Personal Zodiac Profile",
    birthdateLabel: "Enter Your Date of Birth:",
    calculateBtn: "Calculate Zodiac Profile",
    calculating: "Analyzing your natal planetary positions...",
    zodiacSign: "Sun Sign",
    element: "Astrological Element",
    rulingPlanet: "Ruling Planet",
    personalityTitle: "Zodiac Sign Characteristics",
    strengthsTitle: "Strengths & Virtues",
    challengesTitle: "Challenges & Areas of Growth",
    adviceTitle: "Astrological Advice for your Mindfulness",
    todayClim: "Stellar Transits of the Day",
    todayClimDesc: "Today's astrological transits and their influence on your inner world.",
    generalVibe: "General Astrological Vibe",
    celestialAspects: "Active Planetary Alignments",
    celestialAdvice: "Daily Awareness Practice",
    zenPractice: "Recommended Mindfulness Practice",
    scoreLabel: "Astrological Alignment",
    forceRefresh: "Astrological Transits",
    errorLoading: "The stars hide their face for a moment. Showing traditional wisdom...",
    enterBirthdatePrompt: "Enter your date of birth to reveal your personalized astrological profile.",
    datePlaceholder: "Choose a date...",
    noAstrologyData: "Studying the current astrological transits..."
  },
  pt: {
    title: "Clima Astrológico & Perfil Zodiacal",
    desc: "Explore os trânisitos astrológicos de hoje e calcule seu perfil zodiacal de acordo com o seu nascimento.",
    tabTransits: "🪐 Clima Astrológico de Hoje",
    tabZodiac: "✨ Perfil Zodiacal Pessoal",
    birthdateLabel: "Insira sua Data de Nascimento:",
    calculateBtn: "Calcular Perfil Zodiacal",
    calculating: "Analisando posições planetárias do seu nascimento...",
    zodiacSign: "Signo Solar",
    element: "Elemento Astrológico",
    rulingPlanet: "Regente Planetário",
    personalityTitle: "Características do seu Signo",
    strengthsTitle: "Forças e Virtudes",
    challengesTitle: "Desafios e Áreas de Crescimento",
    adviceTitle: "Conselho Astrológico para o seu Mindfulness",
    todayClim: "Trânsitos Astrológicos del Dia",
    todayClimDesc: "O estado do clima astrológico de hoje e sua profunda influência na sua vida interior.",
    generalVibe: "Clima Astrológico Geral",
    celestialAspects: "Alinhamentos Planetários Ativos",
    celestialAdvice: "Recomendação de Consciência Diária",
    zenPractice: "Prática de Mindfulness Recomendada",
    scoreLabel: "Sintonia Astrológica",
    forceRefresh: "Trânsitos Astrológicos",
    errorLoading: "Os astros ocultam seu rosto por un momento. Mostrando sabedoria tradicional...",
    enterBirthdatePrompt: "Insira sua data de nascimento para conhecer seu perfil astrológico personalizado.",
    datePlaceholder: "Escolha uma data...",
    noAstrologyData: "Estudando o clima astrológico atual..."
  }
};

export function AstrologyTab({ language }: AstrologyTabProps) {
  const dict = LOCALIZED_ASTRO[language] || LOCALIZED_ASTRO.es;

  // Tabs: 'transits' | 'profile'
  const [subTab, setSubTab] = useState<"transits" | "profile">("transits");

  // Daily Transits State
  const [transitsData, setTransitsData] = useState<any>(null);
  const [loadingTransits, setLoadingTransits] = useState<boolean>(false);
  const [transitsError, setTransitsError] = useState<string | null>(null);

  // Zodiac Profile State
  const [birthDate, setBirthDate] = useState<string>(() => {
    return safeLocalStorage.getItem("user_birthdate") || "";
  });
  const [zodiacData, setZodiacData] = useState<any>(null);
  const [loadingZodiac, setLoadingZodiac] = useState<boolean>(false);
  const [zodiacError, setZodiacError] = useState<string | null>(null);

  // Fetch Daily Transits
  const fetchTransits = async (force = false) => {
    if (transitsData && !force) return;
    setLoadingTransits(true);
    setTransitsError(null);
    try {
      const res = await fetch("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTransitsData(data);
    } catch (err: any) {
      console.error(err);
      setTransitsError(dict.errorLoading);
    } finally {
      setLoadingTransits(false);
    }
  };

  // Fetch / Generate Zodiac Profile
  const calculateZodiacProfile = async (dateVal: string) => {
    if (!dateVal) return;
    setLoadingZodiac(true);
    setZodiacError(null);
    safeLocalStorage.setItem("user_birthdate", dateVal);

    try {
      const res = await fetch("/api/zodiac-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: dateVal, language })
      });
      if (!res.ok) throw new Error("Failed to fetch zodiac profile");
      const data = await res.json();
      setZodiacData(data);
    } catch (err: any) {
      console.error(err);
      setZodiacError(dict.errorLoading);
    } finally {
      setLoadingZodiac(false);
    }
  };

  // Load transits on mount or language change
  useEffect(() => {
    fetchTransits(true);
  }, [language]);

  // If birthdate changes or is loaded, auto compute profile
  useEffect(() => {
    if (birthDate && subTab === "profile" && !zodiacData) {
      calculateZodiacProfile(birthDate);
    }
  }, [birthDate, subTab]);

  const getElementIcon = (elementStr: string) => {
    const text = elementStr.toLowerCase();
    if (text.includes("fuego") || text.includes("fire") || text.includes("fogo")) {
      return <Flame className="w-5 h-5 text-amber-500 animate-pulse" />;
    }
    if (text.includes("agua") || text.includes("water") || text.includes("água")) {
      return <Droplet className="w-5 h-5 text-sky-400 animate-pulse" />;
    }
    if (text.includes("aire") || text.includes("air") || text.includes("ar")) {
      return <Wind className="w-5 h-5 text-teal-300 animate-pulse" />;
    }
    return <Layers className="w-5 h-5 text-emerald-400 animate-pulse" />;
  };

  const getElementColor = (elementStr: string) => {
    const text = elementStr.toLowerCase();
    if (text.includes("fuego") || text.includes("fire") || text.includes("fogo")) {
      return "from-amber-500/10 to-red-500/10 border-amber-500/30 text-amber-200";
    }
    if (text.includes("agua") || text.includes("water") || text.includes("água")) {
      return "from-blue-500/10 to-sky-500/10 border-blue-500/30 text-sky-200";
    }
    if (text.includes("aire") || text.includes("air") || text.includes("ar")) {
      return "from-teal-500/10 to-cyan-500/10 border-teal-500/30 text-teal-200";
    }
    return "from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-200";
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-100">
      {/* HEADER SECTION */}
      <div className="text-center flex flex-col items-center gap-3 bg-slate-900/10 border border-slate-900/10 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent"></div>
        
        <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-gradient-gold tracking-widest leading-relaxed flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
          <TwinkleText text={dict.title.toUpperCase()} className="animate-title-twinkle tracking-wider" />
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
        </h3>
        
        <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed italic">
          {dict.desc}
        </p>

        {/* TAB CONTROLLERS */}
        <div className="flex gap-1.5 p-1 bg-slate-950/60 rounded-full border border-slate-900/50 mt-4">
          <button
            onClick={() => setSubTab("transits")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 ${
              subTab === "transits"
                ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-900/20"
                : "border border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {dict.tabTransits}
          </button>
          <button
            onClick={() => setSubTab("profile")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 ${
              subTab === "profile"
                ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-900/20"
                : "border border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {dict.tabZodiac}
          </button>
        </div>
      </div>

      {/* SUB-TABS RENDER WITH FRAMER-MOTION */}
      <AnimatePresence mode="wait">
        {subTab === "transits" && (
          <motion.div
            key="transits"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6 relative overflow-hidden rounded-3xl p-1"
          >
            {/* Floating Celestial Astros Decoration */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-3xl z-20">
              {[
                { value: "🪐", size: "text-4xl sm:text-5xl", top: "12%", left: "6%", delay: 0, duration: 14, rotate: [0, 360], scale: [0.95, 1.1, 0.95], glow: "drop-shadow-[0_0_15px_rgba(168,85,247,0.45)]" },
                { value: "🌙", size: "text-3xl sm:text-4xl", top: "42%", left: "12%", delay: 1.5, duration: 11, rotate: [0, -30, 30, 0], scale: [1, 1.15, 1], glow: "drop-shadow-[0_0_12px_rgba(147,197,253,0.4)]" },
                { value: "☀️", size: "text-5xl sm:text-6xl", top: "18%", right: "6%", delay: 0.5, duration: 18, rotate: [0, 360], scale: [0.95, 1.05, 0.95], glow: "drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" },
                { value: "🌟", size: "text-2xl sm:text-3xl", top: "58%", right: "18%", delay: 2, duration: 8, rotate: [0, 180, 0], scale: [0.85, 1.25, 0.85], glow: "drop-shadow-[0_0_10px_rgba(253,224,71,0.55)]" },
                { value: "☄️", size: "text-3xl sm:text-4xl", top: "68%", left: "8%", delay: 1, duration: 12, rotate: [-15, 15, -15], scale: [0.9, 1.1, 0.9], glow: "drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]" },
                { value: "🌓", size: "text-4xl sm:text-5xl", top: "28%", right: "22%", delay: 2.5, duration: 13, rotate: [0, 360], scale: [1, 1.15, 1], glow: "drop-shadow-[0_0_12px_rgba(226,232,240,0.4)]" },
                { value: "🌏", size: "text-3xl sm:text-4xl", top: "8%", left: "42%", delay: 3, duration: 16, rotate: [0, -360], scale: [0.95, 1.05, 0.95], glow: "drop-shadow-[0_0_15px_rgba(16,185,129,0.45)]" },
                { value: "💫", size: "text-2xl sm:text-3xl", top: "48%", right: "42%", delay: 0.8, duration: 9, rotate: [0, 360], scale: [0.85, 1.2, 0.85], glow: "drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" },
              ].map((astro, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    top: astro.top,
                    left: astro.left,
                    right: astro.right,
                  }}
                  className={`${astro.size} opacity-25 sm:opacity-35 font-bold filter ${astro.glow}`}
                  animate={{
                    y: [0, -25, 0],
                    x: [0, 12, 0],
                    rotate: astro.rotate,
                    scale: astro.scale,
                  }}
                  transition={{
                    duration: astro.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: astro.delay,
                  }}
                >
                  {astro.value}
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col gap-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-serif tracking-wide">
                  <Globe className="w-4 h-4 text-emerald-400 animate-pulse" /> {dict.todayClim}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {dict.todayClimDesc}
                </p>
              </div>
              <button
                onClick={() => fetchTransits(true)}
                disabled={loadingTransits}
                className="self-start sm:self-center px-3 py-1.5 bg-slate-900/50 border border-slate-900 hover:border-emerald-500/25 rounded-xl text-[10px] font-bold tracking-wider text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingTransits ? "animate-spin" : ""}`} />
                {dict.forceRefresh}
              </button>
            </div>

            {/* Error fallback banner */}
            {transitsError && (
              <div className="p-4 bg-red-950/20 border border-red-500/15 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-red-300 font-medium leading-relaxed">{transitsError}</span>
              </div>
            )}

            {loadingTransits ? (
              <div className="flex flex-col items-center justify-center p-20 text-center gap-4 bg-slate-900/10 border border-slate-900/40 rounded-3xl relative overflow-hidden">
                <div className="spin-zen w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                <div className="mt-2 text-xs font-serif italic text-emerald-400 tracking-widest animate-pulse">
                  {dict.calculating}
                </div>
                {/* Celestial particles background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-950/5 to-transparent pointer-events-none"></div>
              </div>
            ) : transitsData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. General Vibe Card */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  <div className="bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-slate-950/60 border border-slate-900/60 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl hover:border-emerald-500/10 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none"></div>
                    <div>
                      <span className="text-[10px] font-extrabold tracking-widest text-amber-400 font-serif uppercase">
                        {dict.generalVibe}
                      </span>
                      <h3 className="text-base font-extrabold font-serif text-slate-200 mt-2 tracking-wide leading-relaxed animate-title-twinkle">
                        {transitsData.transitTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                      "{transitsData.generalClimate}"
                    </p>
                    <div className="flex items-center gap-3 mt-2 p-3 rounded-2xl bg-slate-950/40 border border-slate-900/50">
                      <div className="p-2 rounded-xl bg-amber-500/10">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.scoreLabel}</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">Alto potencial espiritual y mental</div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Aspects / List */}
                  <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 flex flex-col gap-4">
                    <h5 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-serif">
                      {dict.celestialAspects}
                    </h5>
                    <div className="flex flex-col gap-3">
                      {transitsData.transits?.map((transit: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl hover:border-emerald-500/10 hover:bg-slate-900/20 transition-all duration-300 flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-serif text-xs font-bold shrink-0">
                            {transit.score || 4}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 font-serif tracking-wide">{transit.aspect}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-medium">{transit.influence}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Right Sidebar Advices */}
                <div className="flex flex-col gap-6">
                  {/* Today advice card */}
                  <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/60 border border-slate-900/60 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl">
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none"></div>
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: "16s" }} />
                      <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-serif">
                        {dict.celestialAdvice}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif">
                      {transitsData.advice}
                    </p>
                  </div>

                  {/* recommended practice card */}
                  <div className="bg-gradient-to-br from-emerald-950/20 via-slate-950/60 to-slate-900/30 border border-emerald-500/20 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl hover:border-emerald-500/35 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full filter blur-xl pointer-events-none"></div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-serif">
                        {dict.zenPractice}
                      </h4>
                    </div>
                    <p className="text-xs text-white font-serif leading-relaxed italic">
                      "{transitsData.recommendedPractice}"
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center p-8 text-slate-500 text-xs font-bold font-serif tracking-widest animate-pulse">
                {dict.noAstrologyData}
              </div>
            )}
            </div>
          </motion.div>
        )}

        {subTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
          >
            {/* INPUT PORTAL */}
            <div className="bg-gradient-to-br from-slate-900/40 via-slate-950/80 to-slate-900/20 border border-slate-900/60 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Calendar className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-serif tracking-wide">{dict.birthdateLabel}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Calcula la resonancia estelar e imprime tu Perfil de Consciencia.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full sm:w-44 px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-emerald-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/35 transition-all text-center uppercase font-mono font-bold tracking-widest"
                  />
                  <button
                    onClick={() => calculateZodiacProfile(birthDate)}
                    disabled={!birthDate || loadingZodiac}
                    className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs tracking-wider shadow-md shadow-emerald-950/50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 disabled:opacity-40 disabled:scale-100"
                  >
                    {loadingZodiac ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{dict.calculating}</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "14s" }} />
                        <span>{dict.calculateBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ERROR PORTAL */}
            {zodiacError && (
              <div className="p-4 bg-red-950/20 border border-red-500/15 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-red-300 font-medium leading-relaxed">{zodiacError}</span>
              </div>
            )}

            {/* RESULTS RENDERING */}
            {loadingZodiac ? (
              <div className="flex flex-col items-center justify-center p-24 text-center gap-4 bg-slate-900/10 border border-slate-900/40 rounded-3xl relative overflow-hidden">
                <div className="spin-zen w-14 h-14 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                <div className="mt-2 text-xs font-serif italic text-gradient-gold tracking-widest animate-pulse">
                  {dict.calculating}
                </div>
                {/* Rotating celestial map simulator lines */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-950/5 to-transparent pointer-events-none"></div>
              </div>
            ) : zodiacData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Header Profile Banner Card */}
                <div className="md:col-span-3 bg-gradient-to-br from-slate-900/50 via-slate-900/20 to-slate-950/70 border border-slate-900/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col gap-6 hover:border-emerald-500/10 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900/60">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-900 flex items-center justify-center text-3xl shadow-lg select-none">
                        {zodiacData.signName?.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)?.[0] || "✨"}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.zodiacSign}</div>
                        <h2 className="text-xl font-serif font-extrabold text-gradient-gold tracking-widest mt-0.5 animate-title-twinkle">
                          {zodiacData.signName}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Element Tag */}
                      <div className={`px-4 py-2 rounded-2xl border bg-gradient-to-r flex items-center gap-2 text-[11px] font-bold font-serif ${getElementColor(zodiacData.element)}`}>
                        {getElementIcon(zodiacData.element)}
                        <span>{zodiacData.element}</span>
                      </div>

                      {/* Planet Tag */}
                      <div className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 text-slate-300 flex items-center gap-2 text-[11px] font-bold font-serif">
                        <Moon className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>{zodiacData.rulingPlanet}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personality Section */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-serif">
                      {dict.personalityTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic text-justify pr-2">
                      "{zodiacData.personality}"
                    </p>
                  </div>
                </div>

                {/* Interactive Natal Chart (Astrological Birth Chart) */}
                <div className="md:col-span-3">
                  <NatalChart
                    birthDate={birthDate}
                    sign={zodiacData.sign || "aries"}
                    language={language}
                  />
                </div>

                {/* 2. Dones & Virtudes (Strengths) */}
                <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 flex flex-col gap-4 hover:border-emerald-500/10 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 animate-pulse" />
                    <h4 className="text-xs font-bold tracking-widest text-amber-400 uppercase font-serif">
                      {dict.strengthsTitle}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    {zodiacData.strengths?.map((str: string, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 font-serif text-xs font-bold shrink-0">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-slate-200 font-medium leading-relaxed font-serif">{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Sombras Evolutivas (Challenges) */}
                <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 flex flex-col gap-4 hover:border-emerald-500/10 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-teal-400 animate-pulse" />
                    <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase font-serif">
                      {dict.challengesTitle}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    {zodiacData.challenges?.map((chal: string, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 font-serif text-xs font-bold shrink-0">
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-slate-200 font-medium leading-relaxed font-serif">{chal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Golden Wisdom Advice */}
                <div className="bg-gradient-to-br from-emerald-950/25 via-slate-950/60 to-slate-900/40 border border-emerald-500/25 rounded-3xl p-6 flex flex-col gap-4 shadow-xl hover:border-emerald-500/35 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl pointer-events-none"></div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <h4 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-serif">
                      {dict.adviceTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-serif">
                    {zodiacData.advice}
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-14 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-950/10 text-slate-500">
                <Compass className="w-10 h-10 text-slate-700 mb-3 animate-spin" style={{ animationDuration: "35s" }} />
                <p className="text-xs font-medium font-serif italic max-w-sm">
                  {dict.enterBirthdatePrompt}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
