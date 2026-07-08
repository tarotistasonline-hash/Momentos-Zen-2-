import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "./utils/safeStorage";
import {
  Compass,
  Heart,
  Sparkles,
  Clock,
  Settings,
  User,
  Calendar,
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
  Wind,
  Play,
  Square,
  CheckCircle,
  Moon,
  Sun,
  ZapOff,
  TrendingUp,
  Feather,
  BookOpen,
  Bell,
  RotateCcw,
  RotateCw,
  Check,
  Info,
  HelpCircle,
  Image,
  Download,
  Coffee,
} from "lucide-react";
import { DICTIONARY, MINDFULNESS_ARTICLES_LOCALIZED, VOICE_SCRIPTS } from "./dictionary";
import { MEDITATION_PACKS, PACK_LABELS } from "./meditationPacks";
import { TwinkleText } from "./components/TwinkleText";
import { AstrologyTab } from "./components/AstrologyTab";
import { MetricsTab } from "./components/MetricsTab";
import { ZenVisualizer } from "./components/ZenVisualizer";
import { BoxBreathingGuide } from "./components/BoxBreathingGuide";
import { KabbalahGuide } from "./components/KabbalahGuide";
import TreeOfLifeVisualizer from "./components/TreeOfLifeVisualizer";
import { exportReadingAsImage } from "./utils/exportImage";
import { exportReadingAsPdf } from "./utils/exportPdf";
// @ts-ignore
import kabbalahTreeOfLifeImg from "./assets/images/kabbalah_tree_of_life_1782922797280.jpg";
// @ts-ignore
import zenMeditationImg from "./assets/images/zen_medit_red_1783213377427.jpg";

function MovingDigit() {
  const [val, setVal] = useState<number>(() => Math.floor(Math.random() * 10));
  useEffect(() => {
    const timer = setInterval(() => {
      setVal(Math.floor(Math.random() * 10));
    }, 200 + Math.random() * 300);
    return () => clearInterval(timer);
  }, []);
  return <span>{val}</span>;
}

interface VoicePlayerButtonProps {
  text: string;
  language: "es" | "en" | "pt" | "de";
  readingSpeechPlaying: boolean;
  readingSpeechText: string | null;
  speakReadingResult: (text: string) => void;
  stopReadingResultSpeech: () => void;
}

function VoicePlayerButton({ 
  text, 
  language, 
  readingSpeechPlaying, 
  readingSpeechText, 
  speakReadingResult, 
  stopReadingResultSpeech 
}: VoicePlayerButtonProps) {
  const isPlaying = readingSpeechPlaying && readingSpeechText === text;
  
  const label = isPlaying
    ? (language === "en" ? "Stop Voice" : language === "pt" ? "Parar Voz" : language === "de" ? "Stoppen" : "Detener Voz")
    : (language === "en" ? "Listen" : language === "pt" ? "Ouvir Leitura" : language === "de" ? "Anhören" : "Escuchar Lectura");

  return (
    <button
      onClick={() => isPlaying ? stopReadingResultSpeech() : speakReadingResult(text)}
      className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all duration-300 flex items-center gap-2 select-none cursor-pointer ${
        isPlaying
          ? "bg-amber-500/25 border border-amber-500/80 text-amber-300 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]"
          : "bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 hover:bg-slate-900/90 shadow-md hover:scale-[1.02]"
      }`}
      title={label}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{label}</span>
          <span className="flex gap-0.5 items-center h-2.5 shrink-0">
            <span className="w-0.5 bg-amber-400 h-2 rounded animate-pulse" style={{ animationDuration: "0.6s" }}></span>
            <span className="w-0.5 bg-amber-400 h-3.5 rounded animate-pulse" style={{ animationDelay: "150ms", animationDuration: "0.8s" }}></span>
            <span className="w-0.5 bg-amber-400 h-2.5 rounded animate-pulse" style={{ animationDelay: "300ms", animationDuration: "0.5s" }}></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-amber-400 transition-colors shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}





export default function App() {
  const [activeTab, setActiveTab] = useState<string>("inicio");
  const [language, setLanguage] = useState<"es" | "en" | "pt" | "de">(() => {
    const saved = safeLocalStorage.getItem("zen_language");
    return (saved as "es" | "en" | "pt" | "de") || "es";
  });
  
  // Voice guided meditation states
  const [voicePlaying, setVoicePlaying] = useState<boolean>(false);
  const [activeVoiceMed, setActiveVoiceMed] = useState<string>("calm-anxiety");
  const [activePackId, setActivePackId] = useState<string>("stress-reduction");
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => {
    return safeLocalStorage.getItem("zen_voice_uri") || "";
  });

  const [mood, setMood] = useState<string>("calmado");
  const [stressLevel, setStressLevel] = useState<number>(5);
  
  // Daily Zen Advice State
  const [dailyZen, setDailyZen] = useState<any>(null);
  const [loadingZen, setLoadingZen] = useState<boolean>(false);
  const [zenError, setZenError] = useState<string>("");

  // Tarot State
  const [tarotQuestion, setTarotQuestion] = useState<string>("");
  const [tarotSpread, setTarotSpread] = useState<string>("3-card");
  const [tarotReading, setTarotReading] = useState<any>(null);
  const [loadingTarot, setLoadingTarot] = useState<boolean>(false);
  const [tarotAnimateState, setTarotAnimateState] = useState<"idle" | "shuffling" | "dealing" | "revealing" | "done">("idle");
  const [tempTarotReading, setTempTarotReading] = useState<any | null>(null);
  const [tarotFlippedCards, setTarotFlippedCards] = useState<boolean[]>([]);

  // Runes State
  const [runesQuestion, setRunesQuestion] = useState<string>("");
  const [runesSpread, setRunesSpread] = useState<string>("3-runes");
  const [runesReading, setRunesReading] = useState<any>(null);
  const [loadingRunes, setLoadingRunes] = useState<boolean>(false);
  const [runesAnimateState, setRunesAnimateState] = useState<"idle" | "shuffling" | "dealing" | "revealing" | "done">("idle");
  const [tempRunesReading, setTempRunesReading] = useState<any | null>(null);
  const [runesFlippedStones, setRunesFlippedStones] = useState<boolean[]>([]);

  // Numerology State
  const [numName, setNumName] = useState<string>("");
  const [numBirth, setNumBirth] = useState<string>("");
  const [numerologyReading, setNumerologyReading] = useState<any>(null);
  const [loadingNum, setLoadingNum] = useState<boolean>(false);

  // Tree of Life State
  const [treeBirth, setTreeBirth] = useState<string>("");
  const [treeArea, setTreeArea] = useState<string>("Desarrollo Espiritual");
  const [treeReading, setTreeReading] = useState<any>(null);
  const [loadingTree, setLoadingTree] = useState<boolean>(false);

  // Lunar Phase State (Calculated locally & parsed by Gemini)
  const [lunaPhase, setLunaPhase] = useState<any>(null);
  const [lunaReading, setLunaReading] = useState<any>(null);
  const [loadingLuna, setLoadingTreeLuna] = useState<boolean>(false);

  // Daily Astrological Transits State
  const [astrologyData, setAstrologyData] = useState<any>(null);
  const [loadingAstrology, setLoadingAstrology] = useState<boolean>(false);
  const [astrologyError, setAstrologyError] = useState<string | null>(null);

  const fetchAstrology = async (forceRefresh = false) => {
    if (astrologyData && !forceRefresh) return;
    setLoadingAstrology(true);
    setAstrologyError(null);
    try {
      const response = await fetch("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });
      if (!response.ok) {
        throw new Error("Error fetching astrological transits");
      }
      const data = await response.json();
      setAstrologyData(data);
    } catch (err: any) {
      console.error(err);
      setAstrologyError(err.message || "Failed to load");
    } finally {
      setLoadingAstrology(false);
    }
  };



  // Expanded Article State (For interactive blog modal)
  const [expandedArticle, setExpandedArticle] = useState<any>(null);
  const [loadingArticle, setLoadingArticle] = useState<boolean>(false);

  // Angels Oracle State
  const [angelsQuestion, setAngelsQuestion] = useState<string>("");
  const [angelsReading, setAngelsReading] = useState<any>(null);
  const [loadingAngels, setLoadingAngels] = useState<boolean>(false);
  const [angelsAnimateState, setAngelsAnimateState] = useState<"idle" | "shuffling" | "revealing" | "done">("idle");
  const [angelsFlipped, setAngelsFlipped] = useState<boolean>(false);

  // Affirmations & Custom Reminders State
  const [reminderInterval, setReminderInterval] = useState<number>(4); // default 4 hours
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
  const [activeReminder, setActiveReminder] = useState<string>("");

  // Progress Tracking (localStorage Persisted)
  const [streak, setStreak] = useState<number>(0);
  const [minutesMeditated, setMinutesMeditated] = useState<number>(0);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [readingsHistory, setReadingsHistory] = useState<any[]>([]);

  // Visitor counter state
  const [visitorCount, setVisitorCount] = useState<number>(12847);
  const [onlineCount, setOnlineCount] = useState<number>(18);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showCoffeeOptions, setShowCoffeeOptions] = useState<boolean>(false);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Reading Speech Synthesis States
  const [readingSpeechText, setReadingSpeechText] = useState<string | null>(null);
  const [readingSpeechPlaying, setReadingSpeechPlaying] = useState<boolean>(false);
  const readingUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Guestbook (Libro de Visitas) States
  const [guestbookMessages, setGuestbookMessages] = useState<any[]>(() => {
    const saved = safeLocalStorage.getItem("zen_guestbook_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "m1",
        name: "Sofía",
        city: "Buenos Aires, Argentina",
        message: "Este espacio ha sido mi faro de luz hoy. La meditación para disolver preocupaciones me devolvió el centro. ¡Gracias por crear esta maravilla! 🧘✨",
        date: "2026-07-02T10:15:00.000Z",
        avatar: "🧘",
        color: "from-emerald-500 to-teal-600"
      },
      {
        id: "m2",
        name: "Alejandro",
        city: "Madrid, España",
        message: "Las lecturas de runas combinadas con la música ambiental son mágicas. Un antes y un después en mi rutina de paz diaria. 🌊🔮",
        date: "2026-07-03T18:45:00.000Z",
        avatar: "🔮",
        color: "from-amber-500 to-orange-600"
      },
      {
        id: "m3",
        name: "Mariana",
        city: "Santiago, Chile",
        message: "¡La voz de meditación guiada es hermosa! Realmente me ayuda a dormir profundamente. El detalle del cafecito es precioso, ya te invité uno. ☕❤️",
        date: "2026-07-04T02:30:00.000Z",
        avatar: "☕",
        color: "from-rose-500 to-pink-600"
      }
    ];
  });
  const [guestbookName, setGuestbookName] = useState<string>("");
  const [guestbookCity, setGuestbookCity] = useState<string>("");
  const [guestbookMessage, setGuestbookMessage] = useState<string>("");
  const [guestbookFormspreeId, setGuestbookFormspreeId] = useState<string>(() => {
    return safeLocalStorage.getItem("zen_formspree_id") || "xldebdzk";
  });
  const [adsensePublisherId, setAdsensePublisherId] = useState<string>(() => {
    return safeLocalStorage.getItem("zen_adsense_publisher_id") || "";
  });
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState<boolean>(false);
  const [guestbookSuccess, setGuestbookSuccess] = useState<boolean>(false);
  const [showFormspreeConfig, setShowFormspreeConfig] = useState<boolean>(false);
  const [isGuestbookExpanded, setIsGuestbookExpanded] = useState<boolean>(false);

  useEffect(() => {
    safeLocalStorage.setItem("zen_formspree_id", guestbookFormspreeId);
  }, [guestbookFormspreeId]);

  useEffect(() => {
    safeLocalStorage.setItem("zen_adsense_publisher_id", adsensePublisherId);
    const existing = document.getElementById("google-adsense-script");
    if (existing) {
      existing.remove();
    }
    if (adsensePublisherId && adsensePublisherId.trim() !== "") {
      const script = document.createElement("script");
      script.id = "google-adsense-script";
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId.trim()}`;
      script.setAttribute("crossorigin", "anonymous");
      document.head.appendChild(script);
    }
  }, [adsensePublisherId]);

  // Client-side Global Observability & Error Reporting Hook
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      fetch("/api/observability/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "error",
          name: event.error?.name || "UncaughtError",
          message: event.message || event.error?.message || "Unknown client error",
          info: `Agent: ${navigator.userAgent}`
        })
      }).catch(() => {});
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      fetch("/api/observability/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "error",
          name: "UnhandledRejection",
          message: String(event.reason?.message || event.reason),
          info: `Agent: ${navigator.userAgent}`
        })
      }).catch(() => {});
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Track application session start
    fetch("/api/observability/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "event",
        name: "session_start",
        info: `Lang: ${language}`
      })
    }).catch(() => {});

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [language]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (coffeeRef.current && !coffeeRef.current.contains(event.target as Node)) {
        setShowCoffeeOptions(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName.trim() || !guestbookMessage.trim()) return;

    setIsSubmittingGuestbook(true);
    setGuestbookSuccess(false);

    const avatars = ["🧘", "🔮", "✨", "🌸", "🌊", "🍃", "🕊️", "☀️", "🌙", "🕯️", "☕", "☯️"];
    const colors = [
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-indigo-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-teal-500 to-emerald-600"
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMessage = {
      id: "user-" + Date.now(),
      name: guestbookName,
      city: guestbookCity || (language === "en" ? "Earth Temple" : language === "pt" ? "Templo da Terra" : "Templo de la Tierra"),
      message: guestbookMessage,
      date: new Date().toISOString(),
      avatar: randomAvatar,
      color: randomColor
    };

    try {
      await fetch(`https://formspree.io/f/${guestbookFormspreeId}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: guestbookName,
          city: guestbookCity,
          message: guestbookMessage,
          date: newMessage.date
        })
      });
    } catch (err) {
      console.error("Formspree submit error:", err);
    }

    const updatedMessages = [newMessage, ...guestbookMessages];
    setGuestbookMessages(updatedMessages);
    safeLocalStorage.setItem("zen_guestbook_messages", JSON.stringify(updatedMessages));

    setGuestbookName("");
    setGuestbookCity("");
    setGuestbookMessage("");
    setGuestbookSuccess(true);
    setIsSubmittingGuestbook(false);

    setTimeout(() => {
      setGuestbookSuccess(false);
    }, 5000);
  };

  // Interactive Breathing Guide State
  const [breathingState, setBreathingState] = useState<"idle" | "inhale" | "hold1" | "exhale" | "hold2">("idle");
  const [breathingTimer, setBreathingStateTimer] = useState<number>(4); // countdown for each state
  const [breathingTotalSeconds, setBreathingTotalSeconds] = useState<number>(0);
  const [breathingSessionLength, setBreathingSessionLength] = useState<number>(2); // minutes (1, 2, 5)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingVoiceGuide, setBreathingVoiceGuide] = useState<boolean>(true);
  const [breathingMusicBackground, setBreathingMusicBackground] = useState<boolean>(true);

  // Web Audio Procedural Synthesizers
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainNodeRef = useRef<BiquadFilterNode | null>(null);
  const wavesGainRef = useRef<GainNode | null>(null);
  const bowlGainRef = useRef<GainNode | null>(null);
  const birdsIntervalRef = useRef<any>(null);
  const bonfireGainRef = useRef<GainNode | null>(null);
  const bonfireIntervalRef = useRef<any>(null);
  const cosmicWindGainRef = useRef<GainNode | null>(null);
  const bellsIntervalRef = useRef<any>(null);
  const musicOscRef = useRef<OscillatorNode[]>([]);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicIntervalRef = useRef<any>(null);
  const allActiveOscsRef = useRef<OscillatorNode[]>([]);
  const voiceTimerRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Library nature ambient sound refs
  const libraryWindSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const libraryWindGainRef = useRef<GainNode | null>(null);
  const libraryWindLfoRef = useRef<OscillatorNode | null>(null);
  const libraryCricketsIntervalRef = useRef<any>(null);

  // Library nature ambient sound states
  const [librarySoundActive, setLibrarySoundActive] = useState<boolean>(true);
  const [librarySoundType, setLibrarySoundType] = useState<"wind" | "crickets">("wind");
  const [librarySoundVolume, setLibrarySoundVolume] = useState<number>(0.25);

  const [soundRain, setSoundRain] = useState<boolean>(false);
  const [soundWaves, setSoundWaves] = useState<boolean>(false);
  const [soundBowl, setSoundBowl] = useState<boolean>(false);
  const [soundBirds, setSoundBirds] = useState<boolean>(false);
  const [soundBonfire, setSoundBonfire] = useState<boolean>(false);
  const [soundCosmicWind, setSoundCosmicWind] = useState<boolean>(false);
  const [soundBells, setSoundBells] = useState<boolean>(false);
  const [soundMusic, setSoundMusic] = useState<boolean>(false);

  const [rainVolume, setRainVolume] = useState<number>(0.3);
  const [wavesVolume, setWavesVolume] = useState<number>(0.3);
  const [bowlVolume, setBowlVolume] = useState<number>(0.3);
  const [birdsVolume, setBirdsVolume] = useState<number>(0.3);
  const [bonfireVolume, setBonfireVolume] = useState<number>(0.3);
  const [cosmicWindVolume, setCosmicWindVolume] = useState<number>(0.3);
  const [bellsVolume, setBellsVolume] = useState<number>(0.3);
  const [musicVolume, setMusicVolume] = useState<number>(0.3);
  const [musicPreset, setMusicPreset] = useState<string>("celestial");
  const [isCosmicOffline, setIsCosmicOffline] = useState<boolean>(false);

  // 1. Calculate and Fetch Moon Phase on Mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const localPhase = calculateLocalMoonPhase(todayStr);
    setLunaPhase(localPhase);
    fetchLunarGuidance(todayStr, localPhase);

    // Initial values from localStorage
    const savedStreak = safeLocalStorage.getItem("zen_streak");
    const savedMinutes = safeLocalStorage.getItem("zen_minutes");
    const savedActions = safeLocalStorage.getItem("zen_actions");
    const savedHistory = safeLocalStorage.getItem("zen_history");

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedMinutes) setMinutesMeditated(parseInt(savedMinutes));
    if (savedActions) setCompletedActions(JSON.parse(savedActions));
    if (savedHistory) setReadingsHistory(JSON.parse(savedHistory));

    // Increment and fetch visits count from server
    fetch("/api/visits/increment", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (typeof data.count === "number") {
            setVisitorCount(data.count);
          }
          if (typeof data.online === "number") {
            setOnlineCount(data.online);
          }
        }
      })
      .catch((err) => console.error("Failed to increment visits:", err));
  }, []);

  // Poll visits and online visitors every 30 seconds
  useEffect(() => {
    const fetchCounts = () => {
      fetch("/api/visits")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            if (typeof data.count === "number") setVisitorCount(data.count);
            if (typeof data.online === "number") setOnlineCount(data.online);
          }
        })
        .catch((err) => console.error("Failed to fetch visits/online:", err));
    };

    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    safeLocalStorage.setItem("zen_language", language);
    if (activeTab === "astrology") {
      fetchAstrology(true);
    }
  }, [language]);

  useEffect(() => {
    if (activeTab === "astrology") {
      fetchAstrology();
    }
  }, [activeTab]);

  // Stop voice speech synthesis when active tab or language changes
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setReadingSpeechPlaying(false);
      setReadingSpeechText(null);
    };
  }, [activeTab, language]);

  // Load and listen to speechSynthesis voices
  useEffect(() => {
    if (!window.speechSynthesis) return;
    
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setSystemVoices(voices);
      
      const savedVoiceURI = safeLocalStorage.getItem("zen_voice_uri");
      if (savedVoiceURI && voices.some(v => v.voiceURI === savedVoiceURI)) {
        setSelectedVoiceURI(savedVoiceURI);
      } else {
        let defaultVoice: SpeechSynthesisVoice | undefined;
        
        if (language === "es") {
          // Find neutral/Latin American Spanish voices
          const neutralSpanish = voices.filter(v => 
            v.lang.toLowerCase().startsWith("es") && 
            !v.lang.toLowerCase().endsWith("-es") && 
            !v.name.toLowerCase().includes("spain") && 
            !v.name.toLowerCase().includes("españa") &&
            !v.name.toLowerCase().includes("castilla") &&
            !v.name.toLowerCase().includes("castellano")
          );
          
          // Prioritize male/deep/google voices for a deeper mystical sound
          const deepMaleNeutral = neutralSpanish.filter(v => 
            v.name.toLowerCase().includes("male") || 
            v.name.toLowerCase().includes("hombre") || 
            v.name.toLowerCase().includes("varon") || 
            v.name.toLowerCase().includes("raul") || 
            v.name.toLowerCase().includes("andres") || 
            v.name.toLowerCase().includes("carlos") || 
            v.name.toLowerCase().includes("miguel") || 
            v.name.toLowerCase().includes("mateo") || 
            v.name.toLowerCase().includes("google")
          );
          
          if (deepMaleNeutral.length > 0) {
            defaultVoice = deepMaleNeutral[0];
          } else if (neutralSpanish.length > 0) {
            defaultVoice = neutralSpanish[0];
          }
        }
        
        if (!defaultVoice) {
          defaultVoice = voices.find(v => v.lang.toLowerCase().startsWith(language));
        }
        
        if (defaultVoice) {
          setSelectedVoiceURI(defaultVoice.voiceURI);
          safeLocalStorage.setItem("zen_voice_uri", defaultVoice.voiceURI);
        }
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [language]);


  // 2. Client-side Moon Phase Approximation
  const calculateLocalMoonPhase = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0;
    let e = 0;
    let jd = 0;
    let b = 0;

    if (month < 3) {
      const adjustedYear = year - 1;
      const adjustedMonth = month + 12;
      const a = Math.floor(adjustedYear / 100);
      b = Math.floor(a / 4);
      c = 2 - a + b;
      e = Math.floor(365.25 * (adjustedYear + 4716));
      jd = e + Math.floor(30.6001 * (adjustedMonth + 1)) + day + c - 1524.5;
    } else {
      const a = Math.floor(year / 100);
      b = Math.floor(a / 4);
      c = 2 - a + b;
      e = Math.floor(365.25 * (year + 4716));
      jd = e + Math.floor(30.6001 * (month + 1)) + day + c - 1524.5;
    }

    const daysSinceNew = jd - 2451543.5;
    const newMoons = daysSinceNew / 29.53058867;
    const phaseCycle = (newMoons - Math.floor(newMoons)) * 29.53058867;

    let phaseName = "Luna Nueva";
    let icon = "🌑";

    if (phaseCycle < 1.845) {
      phaseName = "Luna Nueva";
      icon = "🌑";
    } else if (phaseCycle < 5.5369) {
      phaseName = "Luna Creciente Cóncava";
      icon = "🌒";
    } else if (phaseCycle < 9.2288) {
      phaseName = "Cuarto Creciente";
      icon = "🌓";
    } else if (phaseCycle < 12.920) {
      phaseName = "Luna Creciente Giba";
      icon = "🌔";
    } else if (phaseCycle < 16.611) {
      phaseName = "Luna Llena";
      icon = "🌕";
    } else if (phaseCycle < 20.30) {
      phaseName = "Luna Menguante Giba";
      icon = "🌖";
    } else if (phaseCycle < 23.99) {
      phaseName = "Cuarto Menguante";
      icon = "🌗";
    } else if (phaseCycle < 27.68) {
      phaseName = "Luna Menguante Cóncava";
      icon = "🌘";
    }

    return {
      cycleDay: phaseCycle,
      phaseName,
      icon,
    };
  };

  // 3. Fetch Lunar Guidance from Gemini API
  const fetchLunarGuidance = async (dateStr: string, phaseObj: any) => {
    setLoadingTreeLuna(true);
    try {
      const res = await fetch("/api/tree-of-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: dateStr, focusArea: "Espiritualidad", language }),
      });
      const data = await res.json();
      if (data && data.isFallback) {
        setIsCosmicOffline(true);
      } else if (data && !data.error) {
        setIsCosmicOffline(false);
      }
      setLunaReading(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTreeLuna(false);
    }
  };

  // 4. Fetch Daily Zen Advice
  const generateDailyZen = async () => {
    setLoadingZen(true);
    setZenError("");
    try {
      const res = await fetch("/api/zen-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, stressLevel, language }),
      });
      const data = await res.json();
      if (data && data.isFallback) {
        setIsCosmicOffline(true);
      } else if (data && !data.error) {
        setIsCosmicOffline(false);
      }
      if (data.error) {
        setZenError(data.message);
      } else {
        setDailyZen(data);
        // Regenerate custom notification mindfulness reminder right away
        triggerCustomNotification(data.mantra || "Respira, estás aquí ahora.");
      }
    } catch (err) {
      setZenError("No se pudo conectar con el servidor Zen.");
    } finally {
      setLoadingZen(false);
    }
  };

  // 5. Custom Notification Generator
  const triggerCustomNotification = (message: string) => {
    setActiveReminder(message);
    setTimeout(() => {
      setActiveReminder("");
    }, 7000); // show for 7 seconds
  };

  // 6. Tarot Reading Generator
  const runTarotReading = async () => {
    setLoadingTarot(true);
    setTarotReading(null);
    setTempTarotReading(null);
    setTarotAnimateState("shuffling");
    
    // Determine card count based on spread
    const cardCount = tarotSpread === "1-card" ? 1 : tarotSpread === "3-card" ? 3 : 5;
    setTarotFlippedCards(new Array(cardCount).fill(false));

    // Start background fetch immediately
    const fetchPromise = (async () => {
      try {
        const res = await fetch("/api/tarot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: tarotQuestion, spreadType: tarotSpread, language }),
        });
        const data = await res.json();
        if (data && data.isFallback) {
          setIsCosmicOffline(true);
        } else if (data && !data.error) {
          setIsCosmicOffline(false);
        }
        return data;
      } catch (e) {
        console.error(e);
        return { error: true, summary: "Error de conexión." };
      }
    })();

    // 1. Shuffling (2200ms)
    setTimeout(async () => {
      setTarotAnimateState("dealing");

      // 2. Dealing: 450ms per card
      const dealTime = cardCount * 450;
      setTimeout(async () => {
        setTarotAnimateState("revealing");

        // Wait for the background API fetch to complete if it hasn't yet
        const data = await fetchPromise;
        setTempTarotReading(data);

        // 3. Staggered flip-over of each card (revealing the arcanos)
        for (let i = 0; i < cardCount; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setTarotFlippedCards(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }

        // Wait a small moment to let the user admire the revealed cards, then set results
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setTarotReading(data);
        saveReadingToHistory("Tarot", tarotQuestion, data.summary);
        setTarotAnimateState("done");
        setLoadingTarot(false);
      }, dealTime);

    }, 2200);
  };

  // 7. Norse Runes Reading Generator
  const runRunesReading = async () => {
    setLoadingRunes(true);
    setRunesReading(null);
    setTempRunesReading(null);
    setRunesAnimateState("shuffling");

    const runeCount = runesSpread === "1-rune" ? 1 : 3;
    setRunesFlippedStones(new Array(runeCount).fill(false));

    // Start background fetch
    const fetchPromise = (async () => {
      try {
        const res = await fetch("/api/runes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: runesQuestion, spreadType: runesSpread, language }),
        });
        const data = await res.json();
        if (data && data.isFallback) {
          setIsCosmicOffline(true);
        } else if (data && !data.error) {
          setIsCosmicOffline(false);
        }
        return data;
      } catch (e) {
        console.error(e);
        return { error: true, summary: "Error de conexión." };
      }
    })();

    // 1. Shuffling / Shaking pouch (2200ms)
    setTimeout(async () => {
      setRunesAnimateState("dealing");

      // 2. Dealing: 400ms per stone
      const dealTime = runeCount * 400;
      setTimeout(async () => {
        setRunesAnimateState("revealing");

        const data = await fetchPromise;
        setTempRunesReading(data);

        // 3. Staggered activation glow of stones
        for (let i = 0; i < runeCount; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setRunesFlippedStones(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }

        // Wait to show revealed runic energies
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setRunesReading(data);
        saveReadingToHistory("Runas Nórdicas", runesQuestion, data.summary);
        setRunesAnimateState("done");
        setLoadingRunes(false);
      }, dealTime);

    }, 2200);
  };

  // 8. Numerology Calculator
  const runNumerology = async () => {
    if (!numName || !numBirth) return;
    setLoadingNum(true);
    setNumerologyReading(null);
    try {
      const res = await fetch("/api/numerology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: numName, birthDate: numBirth, language }),
      });
      const data = await res.json();
      if (data && data.isFallback) {
        setIsCosmicOffline(true);
      } else if (data && !data.error) {
        setIsCosmicOffline(false);
      }
      setNumerologyReading(data);
      saveReadingToHistory("Numerología", `Vibración de ${numName}`, data.cosmicAdvice);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNum(false);
    }
  };

  // 9. Tree of Life Alignment Generator
  const runTreeOfLife = async () => {
    if (!treeBirth) return;
    setLoadingTree(true);
    setTreeReading(null);
    try {
      const res = await fetch("/api/tree-of-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: treeBirth, focusArea: treeArea, language }),
      });
      const data = await res.json();
      if (data && data.isFallback) {
        setIsCosmicOffline(true);
      } else if (data && !data.error) {
        setIsCosmicOffline(false);
      }
      setTreeReading(data);
      saveReadingToHistory("Árbol de la Vida", `Foco en ${treeArea}`, data.blessing);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTree(false);
    }
  };

  // 10. Expand Article Interactive Modal
  const handleExpandArticle = async (title: string) => {
    setLoadingArticle(true);
    setExpandedArticle(null);
    try {
      const res = await fetch("/api/articles/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language }),
      });
      const data = await res.json();
      if (data && data.isFallback) {
        setIsCosmicOffline(true);
      } else if (data && !data.error) {
        setIsCosmicOffline(false);
      }
      setExpandedArticle(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingArticle(false);
    }
  };

  // Angels Oracle Reading Fetcher
  const fetchAngelsReading = async () => {
    setLoadingAngels(true);
    setAngelsAnimateState("shuffling");
    setAngelsFlipped(false);
    setAngelsReading(null);

    // Simulate shuffling/dealing
    setTimeout(async () => {
      setAngelsAnimateState("revealing");
      try {
        const response = await fetch("/api/angels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: angelsQuestion,
            language: language
          })
        });
        if (!response.ok) {
          throw new Error("Failed to fetch angel message");
        }
        const data = await response.json();
        setAngelsReading(data);
        
        // Trigger card flipping animation
        setTimeout(() => {
          setAngelsFlipped(true);
          setAngelsAnimateState("done");
        }, 500);

        // Save to historic readings
        saveReadingToHistory(
          language === "en" ? "Angel Oracle" : language === "pt" ? "Oráculo de Anjos" : "Oráculo de Ángeles",
          angelsQuestion || (language === "en" ? "General Message" : language === "pt" ? "Mensagem Geral" : "Mensaje General"),
          data.coreMessage
        );

        // Record completed action
        setCompletedActions((prev) => {
          const updated = { ...prev, angels: true };
          safeLocalStorage.setItem("zen_completed_actions", JSON.stringify(updated));
          return updated;
        });

      } catch (err) {
        console.error("Error drawing angel:", err);
        setAngelsAnimateState("idle");
      } finally {
        setLoadingAngels(false);
      }
    }, 1500);
  };

  // 11. Helper to save readings in client-side history (localStorage)
  const saveReadingToHistory = (type: string, query: string, summary: string) => {
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString("es-ES"),
      type,
      query: query || "Alineación General",
      summary
    };
    const updated = [newRecord, ...readingsHistory].slice(0, 15); // keep last 15
    setReadingsHistory(updated);
    safeLocalStorage.setItem("zen_history", JSON.stringify(updated));
  };

  // 12. Checklist Toggle
  const toggleAction = (actionKey: string) => {
    const updated = {
      ...completedActions,
      [actionKey]: !completedActions[actionKey]
    };
    setCompletedActions(updated);
    safeLocalStorage.setItem("zen_actions", JSON.stringify(updated));

    // Increase score marginally or update streak if first check
    const countCompleted = Object.values(updated).filter(Boolean).length;
    if (countCompleted === 1 && streak === 0) {
      setStreak(1);
      safeLocalStorage.setItem("zen_streak", "1");
    }
  };

  // 13. Interactive Breathing Timer
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingStateTimer((prev) => {
          if (prev <= 1) {
            // Cycle through states (Inhale -> Hold1 -> Exhale -> Hold2 -> Inhale)
            setBreathingState((prevState) => {
              switch (prevState) {
                case "inhale":
                  return "hold1";
                case "hold1":
                  return "exhale";
                case "exhale":
                  return "hold2";
                case "hold2":
                default:
                  return "inhale";
              }
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });

        setBreathingTotalSeconds((prevTotal) => {
          const newTotal = prevTotal + 1;
          const targetTotal = breathingSessionLength * 60;
          if (newTotal >= targetTotal) {
            // Session completed! Update progress
            setIsBreathingActive(false);
            setBreathingState("idle");
            const newMinutes = minutesMeditated + breathingSessionLength;
            setMinutesMeditated(newMinutes);
            safeLocalStorage.setItem("zen_minutes", String(newMinutes));
            setStreak((prev) => {
              const newStreak = prev + 1;
              safeLocalStorage.setItem("zen_streak", String(newStreak));
              return newStreak;
            });
            triggerCustomNotification("¡Felicidades! Completaste tu sesión de Respiración Consciente.");
            return 0;
          }
          return newTotal;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingSessionLength, breathingState, minutesMeditated]);

  const speakBreathingInstruction = (phase: string) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    
    let text = "";
    if (language === "en") {
      if (phase === "inhale") text = "Inhale deeply";
      else if (phase === "hold1") text = "Hold your breath";
      else if (phase === "exhale") text = "Exhale slowly";
      else if (phase === "hold2") text = "Stay empty";
    } else if (language === "pt") {
      if (phase === "inhale") text = "Inspire profundamente";
      else if (phase === "hold1") text = "Prenda a respiração";
      else if (phase === "exhale") text = "Expire devagar";
      else if (phase === "hold2") text = "Mantenha o vazio";
    } else { // default "es"
      if (phase === "inhale") text = "Inhala profundamente";
      else if (phase === "hold1") text = "Retén el aire";
      else if (phase === "exhale") text = "Exhala despacio";
      else if (phase === "hold2") text = "Mantén en vacío";
    }

    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "es-ES";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(language));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isBreathingActive && breathingVoiceGuide && breathingState !== "idle") {
      speakBreathingInstruction(breathingState);
    }
  }, [breathingState, isBreathingActive, breathingVoiceGuide]);

  useEffect(() => {
    if (!breathingVoiceGuide && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }, [breathingVoiceGuide]);

  // Dynamic background music control during active breathing session
  useEffect(() => {
    if (isBreathingActive) {
      if (breathingMusicBackground) {
        if (!soundMusic) {
          startMusicInternal(musicPreset);
          setSoundMusic(true);
        }
      } else {
        if (soundMusic) {
          stopMusicInternal();
          setSoundMusic(false);
        }
      }
    }
  }, [breathingMusicBackground, isBreathingActive, soundMusic, musicPreset]);

  const startBreathingSession = () => {
    // Resume audio context to enable user gesture requirement for relax sounds too
    initAudioContext();
    setBreathingState("inhale");
    setBreathingStateTimer(4);
    setBreathingTotalSeconds(0);
    setIsBreathingActive(true);

    if (breathingMusicBackground && !soundMusic) {
      startMusicInternal(musicPreset);
      setSoundMusic(true);
    }
  };

  const stopBreathingSession = () => {
    setIsBreathingActive(false);
    setBreathingState("idle");
    setBreathingTotalSeconds(0);
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (breathingMusicBackground && soundMusic) {
      stopMusicInternal();
      setSoundMusic(false);
    }
  };

  // 14. Web Audio API Procedural Sound Engine Setup
  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const stopMusicInternal = () => {
    if (musicOscRef.current.length > 0) {
      musicOscRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      musicOscRef.current = [];
    }
    if (allActiveOscsRef.current.length > 0) {
      allActiveOscsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      allActiveOscsRef.current = [];
    }
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
    if (musicGainRef.current) {
      try { musicGainRef.current.disconnect(); } catch(e) {}
      musicGainRef.current = null;
    }
  };

  const startMusicInternal = (presetToPlay: string) => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Ensure we stop any active oscillators/intervals first to prevent doubling/orphans!
    stopMusicInternal();

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(musicVolume * 0.15, ctx.currentTime);
    gainNode.connect(ctx.destination);
    musicGainRef.current = gainNode;

    const playChord = (freqs: number[]) => {
      // stop old oscillators first
      if (musicOscRef.current.length > 0) {
        const oldOscs = musicOscRef.current;
        const now = ctx.currentTime;
        // fade out
        gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
        setTimeout(() => {
          oldOscs.forEach(o => { try { o.stop(); } catch(e) {} });
          allActiveOscsRef.current = allActiveOscsRef.current.filter(o => !oldOscs.includes(o));
        }, 1000);
        musicOscRef.current = [];
      }

      // fade in new chord
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(musicVolume * 0.15, now + 1.2);

      const newOscsAndLfos: OscillatorNode[] = [];
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        // Add subtle detuning vibrato
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2 + Math.random() * 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 3;
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        
        osc.connect(gainNode);
        
        lfo.start(now);
        osc.start(now);
        
        newOscsAndLfos.push(osc, lfo);
        allActiveOscsRef.current.push(osc, lfo);
      });

      musicOscRef.current = newOscsAndLfos;
    };

    // Define presets
    let chords = [
      [174.61, 220.00, 261.63, 329.63], // Celestial Chords: Fmaj7 (F3, A3, C4, E4)
      [196.00, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
      [130.81, 164.81, 196.00, 261.63], // Cmaj7 (C3, E3, G3, C4)
      [220.00, 261.63, 329.63, 392.00]  // Am7 (A3, C4, E4, G4)
    ];

    if (presetToPlay === "solfeggio") {
      chords = [
        [264.00, 396.00, 528.00, 792.00], // 528Hz Golden tuning tree
        [216.00, 324.00, 432.00, 648.00], // 432Hz Cosmic tuning tree
        [293.66, 440.00, 587.33, 880.00]  // 440Hz healing frequency harmonic
      ];
    } else if (presetToPlay === "cosmic") {
      chords = [
        [110.00, 165.00, 220.00, 330.00], // A2 deep space drone
        [116.54, 174.61, 233.08, 349.23], // Bb2 dark cosmic drone
        [130.81, 196.00, 261.63, 392.00]  // C3 deep space drone
      ];
    } else if (presetToPlay === "pentatonic") {
      chords = [
        [196.00, 220.00, 293.66, 329.63], // G3, A3, D4, E4 Zen Pentatonic
        [220.00, 293.66, 329.63, 392.00], // A3, D4, E4, G4
        [293.66, 329.63, 392.00, 440.00]  // D4, E4, G4, A4
      ];
    }

    let chordIdx = 0;
    playChord(chords[chordIdx]);

    const interval = setInterval(() => {
      chordIdx = (chordIdx + 1) % chords.length;
      playChord(chords[chordIdx]);
    }, 6000);

    musicIntervalRef.current = interval;
  };

  // Helper to stop all other active ambient sounds when background music starts
  const stopAllAmbientSounds = () => {
    // Bonfire
    if (bonfireGainRef.current) {
      try { (bonfireGainRef.current as any).source.stop(); } catch(e) {}
      bonfireGainRef.current = null;
    }
    if (bonfireIntervalRef.current) {
      clearInterval(bonfireIntervalRef.current);
      bonfireIntervalRef.current = null;
    }
    setSoundBonfire(false);

    // Cosmic Wind
    if (cosmicWindGainRef.current) {
      try { (cosmicWindGainRef.current as any).source.stop(); } catch(e) {}
      try { (cosmicWindGainRef.current as any).lfo.stop(); } catch(e) {}
      cosmicWindGainRef.current = null;
    }
    setSoundCosmicWind(false);

    // Bells
    if (bellsIntervalRef.current) {
      clearInterval(bellsIntervalRef.current);
      bellsIntervalRef.current = null;
    }
    setSoundBells(false);

    // Rain
    if (rainNodeRef.current) {
      try { (rainNodeRef.current as any).source.stop(); } catch(e) {}
      rainNodeRef.current = null;
    }
    setSoundRain(false);

    // Waves
    if (wavesGainRef.current) {
      try { (wavesGainRef.current as any).source.stop(); } catch(e) {}
      try { (wavesGainRef.current as any).lfo.stop(); } catch(e) {}
      wavesGainRef.current = null;
    }
    setSoundWaves(false);

    // Tibetan Bowl
    if (bowlGainRef.current) {
      try { (bowlGainRef.current as any).oscillators.forEach((osc: any) => osc.stop()); } catch(e) {}
      bowlGainRef.current = null;
    }
    setSoundBowl(false);

    // Birds
    if (birdsIntervalRef.current) {
      clearInterval(birdsIntervalRef.current);
      birdsIntervalRef.current = null;
    }
    setSoundBirds(false);
  };

  // Helper to interrupt background music if active when user toggles an ambient sound
  const interruptMusicIfActive = () => {
    if (soundMusic) {
      stopMusicInternal();
      setSoundMusic(false);
    }
  };

  // Generate procedural loopable Ambient Background Music with customizable presets
  const toggleMusic = () => {
    if (soundMusic) {
      stopMusicInternal();
      setSoundMusic(false);
    } else {
      stopAllAmbientSounds();
      startMusicInternal(musicPreset);
      setSoundMusic(true);
    }
  };

  // Automatically restart music if preset changes while playing (cleanly)
  useEffect(() => {
    if (soundMusic) {
      startMusicInternal(musicPreset);
    }
  }, [musicPreset]);

  // Procedural bonfire/campfire synthesizer (Pinkish bandpass noise + randomized triangle crackles)
  const toggleBonfire = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundBonfire) {
      if (bonfireGainRef.current) {
        try { (bonfireGainRef.current as any).source.stop(); } catch(e) {}
        bonfireGainRef.current = null;
      }
      if (bonfireIntervalRef.current) {
        clearInterval(bonfireIntervalRef.current);
        bonfireIntervalRef.current = null;
      }
      setSoundBonfire(false);
    } else {
      interruptMusicIfActive();
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 85;
      filter.Q.value = 1.0;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(bonfireVolume * 0.12, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();

      bonfireGainRef.current = gainNode;
      (gainNode as any).source = whiteNoise;

      // Pops and crackles generator
      const playPop = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const popGain = audioCtxRef.current.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(150 + Math.random() * 1000, now);
        
        popGain.gain.setValueAtTime(0, now);
        popGain.gain.linearRampToValueAtTime(bonfireVolume * 0.15, now + 0.002);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

        osc.connect(popGain);
        popGain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 0.02);
      };

      const popInterval = setInterval(() => {
        const popsCount = Math.floor(Math.random() * 4);
        for (let j = 0; j < popsCount; j++) {
          setTimeout(() => playPop(), Math.random() * 800);
        }
      }, 900);

      bonfireIntervalRef.current = popInterval;
      setSoundBonfire(true);
    }
  };

  useEffect(() => {
    if (soundBonfire && bonfireGainRef.current) {
      bonfireGainRef.current.gain.setValueAtTime(bonfireVolume * 0.12, audioCtxRef.current!.currentTime);
    }
  }, [bonfireVolume, soundBonfire]);

  // Procedural Cosmic Wind Synthesizer (White noise with sweeping resonant bandpass filter)
  const toggleCosmicWind = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundCosmicWind) {
      if (cosmicWindGainRef.current) {
        try { (cosmicWindGainRef.current as any).source.stop(); } catch(e) {}
        try { (cosmicWindGainRef.current as any).lfo.stop(); } catch(e) {}
        cosmicWindGainRef.current = null;
      }
      setSoundCosmicWind(false);
    } else {
      interruptMusicIfActive();
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 15;
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(cosmicWindVolume * 0.18, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.04, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();
      lfo.start();

      cosmicWindGainRef.current = gainNode;
      (gainNode as any).source = whiteNoise;
      (gainNode as any).lfo = lfo;

      setSoundCosmicWind(true);
    }
  };

  useEffect(() => {
    if (soundCosmicWind && cosmicWindGainRef.current) {
      cosmicWindGainRef.current.gain.setValueAtTime(cosmicWindVolume * 0.18, audioCtxRef.current!.currentTime);
    }
  }, [cosmicWindVolume, soundCosmicWind]);

  // Periodic Celestial Bells Synthesizer
  const toggleBells = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundBells) {
      if (bellsIntervalRef.current) {
        clearInterval(bellsIntervalRef.current);
        bellsIntervalRef.current = null;
      }
      setSoundBells(false);
    } else {
      interruptMusicIfActive();
      const playBell = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(bellsVolume * 0.22, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        const base = 440 + Math.random() * 880;
        const ratios = [1, 1.5, 2.2, 3.14, 4.2];
        ratios.forEach((ratio, idx) => {
          const osc = audioCtxRef.current!.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(base * ratio, now);
          
          const subGain = audioCtxRef.current!.createGain();
          subGain.gain.setValueAtTime(0.3 / (idx + 1), now);

          osc.connect(subGain);
          subGain.connect(gainNode);
          osc.start(now);
          osc.stop(now + 3.1);
        });

        gainNode.connect(audioCtxRef.current.destination);
      };

      playBell();

      bellsIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.3) {
          playBell();
        }
      }, 4000);

      setSoundBells(true);
    }
  };

  useEffect(() => {
    if (musicGainRef.current && audioCtxRef.current) {
      musicGainRef.current.gain.setValueAtTime(musicVolume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [musicVolume]);

  // Generate procedural loopable Rain Sound
  const toggleRain = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundRain) {
      // Turn Off
      if (rainNodeRef.current) {
        (rainNodeRef.current as any).source.stop();
        rainNodeRef.current = null;
      }
      setSoundRain(false);
    } else {
      // Turn On
      interruptMusicIfActive();
      // Create random noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "lowpass";
      rainFilter.frequency.value = 1000;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(rainVolume * 0.25, ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();

      rainNodeRef.current = rainFilter;
      (rainFilter as any).source = whiteNoise;
      (rainFilter as any).gainNode = gainNode;

      setSoundRain(true);
    }
  };

  useEffect(() => {
    if (soundRain && rainNodeRef.current) {
      (rainNodeRef.current as any).gainNode.gain.setValueAtTime(rainVolume * 0.25, audioCtxRef.current!.currentTime);
    }
  }, [rainVolume, soundRain]);

  // Generate procedural Ocean Waves Sound with slow LFO
  const toggleWaves = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundWaves) {
      if (wavesGainRef.current) {
        (wavesGainRef.current as any).source.stop();
        (wavesGainRef.current as any).lfo.stop();
        wavesGainRef.current = null;
      }
      setSoundWaves(false);
    } else {
      interruptMusicIfActive();
      // Procedural ocean waves
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Pink-ish noise filter
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // rescue clipping
        b6 = white * 0.115926;
      }

      const pinkNoise = ctx.createBufferSource();
      pinkNoise.buffer = noiseBuffer;
      pinkNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);

      // Create LFO for rising/falling tide
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08; // extremely slow wave cycles (12.5 seconds)
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = wavesVolume * 0.3;

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);

      pinkNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      pinkNoise.start();
      lfo.start();

      wavesGainRef.current = gainNode;
      (gainNode as any).source = pinkNoise;
      (gainNode as any).lfo = lfo;
      (gainNode as any).lfoGain = lfoGain;

      setSoundWaves(true);
    }
  };

  useEffect(() => {
    if (soundWaves && wavesGainRef.current) {
      (wavesGainRef.current as any).lfoGain.gain.setValueAtTime(wavesVolume * 0.3, audioCtxRef.current!.currentTime);
    }
  }, [wavesVolume, soundWaves]);

  // Generate resonant Tibetan Singing Bowl Sound
  const toggleBowl = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundBowl) {
      if (bowlGainRef.current) {
        (bowlGainRef.current as any).oscillators.forEach((osc: any) => osc.stop());
        bowlGainRef.current = null;
      }
      setSoundBowl(false);
    } else {
      interruptMusicIfActive();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(bowlVolume * 0.4, ctx.currentTime + 1.5);

      // Create rich resonant harmonic oscillators
      const frequencies = [144, 288, 432, 576]; // Pythagorean tuning ratios
      const oscillators = frequencies.map((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + (idx * 0.5), ctx.currentTime); // subtle detune for warmth
        
        // Sub-gain to balance high harmonics
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(1 / (idx + 1), ctx.currentTime);

        osc.connect(subGain);
        subGain.connect(gainNode);
        osc.start();
        return osc;
      });

      gainNode.connect(ctx.destination);

      bowlGainRef.current = gainNode;
      (gainNode as any).oscillators = oscillators;

      setSoundBowl(true);
    }
  };

  useEffect(() => {
    if (soundBowl && bowlGainRef.current) {
      bowlGainRef.current.gain.setValueAtTime(bowlVolume * 0.4, audioCtxRef.current!.currentTime);
    }
  }, [bowlVolume, soundBowl]);

  // Generate procedural periodical Forest Birds
  const toggleBirds = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (soundBirds) {
      clearInterval(birdsIntervalRef.current);
      birdsIntervalRef.current = null;
      setSoundBirds(false);
    } else {
      interruptMusicIfActive();
      // Periodically trigger synthetical chirps
      const playChirp = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const chirpGain = audioCtxRef.current.createGain();

        osc.type = "sine";
        
        // Synthesise rapid frequency pitch sweep like a real bird chirp!
        const baseFreq = 1200 + Math.random() * 600;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.2);

        chirpGain.gain.setValueAtTime(0, now);
        chirpGain.gain.linearRampToValueAtTime(birdsVolume * 0.08, now + 0.05);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(chirpGain);
        chirpGain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      };

      // Set intervals for chirping
      const interval = setInterval(() => {
        if (Math.random() > 0.4) {
          playChirp();
          // double-chirp sometimes!
          setTimeout(() => playChirp(), 150 + Math.random() * 100);
        }
      }, 3500);

      birdsIntervalRef.current = interval;
      setSoundBirds(true);
    }
  };

  // 15. Library Nature Ambient Sounds
  const startLibraryAmbientSound = (type: "wind" | "crickets", vol: number) => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Stop first to ensure clean state
    stopLibraryAmbientSound();

    if (type === "wind") {
      // Gentle wind: White noise buffer + Bandpass filter slowly swept by LFO
      const bufferSize = ctx.sampleRate * 3; // 3 seconds buffer
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const windSource = ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 2.0; // Moderate resonance
      filter.frequency.setValueAtTime(250, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(vol * 0.15, ctx.currentTime + 1.5); // Fade in over 1.5s

      // LFO to sweep filter frequency
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.06, ctx.currentTime); // 0.06 Hz = slow swept cycles

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(100, ctx.currentTime); // Sweep +/- 100 Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      windSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      windSource.start();
      lfo.start();

      libraryWindSourceRef.current = windSource;
      libraryWindGainRef.current = gainNode;
      libraryWindLfoRef.current = lfo;
    } else if (type === "crickets") {
      // Crickets chirping periodically
      const playCricketSequence = () => {
        if (!audioCtxRef.current) return;
        const currentCtx = audioCtxRef.current;
        const now = currentCtx.currentTime;
        const pulses = 3 + Math.floor(Math.random() * 2); // 3 to 4 pulses per chirp
        
        for (let p = 0; p < pulses; p++) {
          const pulseStart = now + p * 0.06;
          const osc = currentCtx.createOscillator();
          const gainNode = currentCtx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(4000 + Math.random() * 200, pulseStart); // High pitch crickets
          
          gainNode.gain.setValueAtTime(0, pulseStart);
          gainNode.gain.linearRampToValueAtTime(vol * 0.04, pulseStart + 0.015);
          gainNode.gain.exponentialRampToValueAtTime(0.001, pulseStart + 0.05);
          
          osc.connect(gainNode);
          gainNode.connect(currentCtx.destination);
          
          osc.start(pulseStart);
          osc.stop(pulseStart + 0.055);
        }
      };

      // Play once immediately
      playCricketSequence();

      // Trigger every 2-2.5 seconds with slight randomization
      const interval = setInterval(() => {
        if (Math.random() > 0.3) {
          playCricketSequence();
        }
      }, 2200);

      libraryCricketsIntervalRef.current = interval;
    }
  };

  const stopLibraryAmbientSound = () => {
    if (libraryWindSourceRef.current) {
      try { libraryWindSourceRef.current.stop(); } catch(e) {}
      libraryWindSourceRef.current = null;
    }
    if (libraryWindLfoRef.current) {
      try { libraryWindLfoRef.current.stop(); } catch(e) {}
      libraryWindLfoRef.current = null;
    }
    if (libraryWindGainRef.current) {
      try { libraryWindGainRef.current.disconnect(); } catch(e) {}
      libraryWindGainRef.current = null;
    }
    if (libraryCricketsIntervalRef.current) {
      clearInterval(libraryCricketsIntervalRef.current);
      libraryCricketsIntervalRef.current = null;
    }
  };

  // Adjust volume dynamically for Wind if active
  useEffect(() => {
    if (libraryWindGainRef.current && audioCtxRef.current) {
      libraryWindGainRef.current.gain.setValueAtTime(librarySoundVolume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [librarySoundVolume]);

  // Effect to automatically start and stop library sound
  useEffect(() => {
    if (activeTab === "biblioteca" && expandedArticle && librarySoundActive) {
      startLibraryAmbientSound(librarySoundType, librarySoundVolume);
    } else {
      stopLibraryAmbientSound();
    }

    return () => {
      stopLibraryAmbientSound();
    };
  }, [expandedArticle, librarySoundActive, librarySoundType, activeTab]);

  // Reference localized dictionary
  const dict = DICTIONARY[language];

  // Speech Synthesis Helper
  const speakSentence = (text: string, langCode: string, onEnd: () => void) => {
    if (!window.speechSynthesis) {
      onEnd();
      return;
    }
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;
    // Use neutral Spanish (es-MX) instead of Castilian (es-ES) for neutral voice fallback
    utterance.lang = langCode === "en" ? "en-US" : langCode === "pt" ? "pt-BR" : "es-MX";
    utterance.rate = 0.82; // beautiful, slow, relaxed meditative reading pace
    utterance.pitch = 0.80; // slightly lower, deeper pitch for a warmer, calmer, deeper voice

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      if (langCode === "es") {
        const neutralSpanish = voices.find(v => 
          v.lang.toLowerCase().startsWith("es") && 
          !v.lang.toLowerCase().endsWith("-es") &&
          !v.name.toLowerCase().includes("spain") &&
          !v.name.toLowerCase().includes("españa") &&
          !v.name.toLowerCase().includes("castilla")
        );
        if (neutralSpanish) {
          utterance.voice = neutralSpanish;
          utterance.lang = neutralSpanish.lang;
        } else {
          const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
          if (matchedVoice) {
            utterance.voice = matchedVoice;
            utterance.lang = matchedVoice.lang;
          }
        }
      } else {
        const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        }
      }
    }

    let ended = false;
    const handleEnd = () => {
      if (ended) return;
      ended = true;
      activeUtteranceRef.current = null;
      onEnd();
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    // Small delay after cancel to prevent audio thread stuttering or freezing
    setTimeout(() => {
      if (window.speechSynthesis && activeUtteranceRef.current === utterance) {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          handleEnd();
        }
      }
    }, 100);
  };

  // Helper to read cosmic/spiritual results aloud with a deep, neutral Spanish voice
  const speakReadingResult = (textToRead: string) => {
    if (!window.speechSynthesis) return;

    if (readingSpeechPlaying && readingSpeechText === textToRead) {
      stopReadingResultSpeech();
      return;
    }

    // Stop active meditation voice guide if playing
    if (voicePlaying) {
      stopVoiceMeditation();
    }

    // Strip out emojis and excessive markdown characters for clean, high-quality speech synthesis
    const cleanText = textToRead
      .replace(/[🔮✨🌙🌟🌿📜💎🧘‍♂️🧘‍♀️☸️⚓🤍🍃🌬️🎈💨🔳📖🧠🔱🕯️🧬🗝️🌠🪐☄️🛡️⚔️]/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/-\s+/g, "")
      .replace(/•\s+/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    readingUtteranceRef.current = utterance;
    
    // Deep, resonant, slow reading pace for mystical readings
    utterance.pitch = 0.78; // Very deep, spiritual pitch
    utterance.rate = 0.84; // Perfect cadence for deep, wise listening

    // Language
    utterance.lang = language === "en" ? "en-US" : language === "pt" ? "pt-BR" : "es-MX";

    // Select the best deep/neutral voice
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      // Look for a neutral Spanish voice first
      if (language === "es") {
        const neutralSpanish = voices.find(v => 
          v.lang.toLowerCase().startsWith("es") && 
          !v.lang.toLowerCase().endsWith("-es") &&
          !v.name.toLowerCase().includes("spain") &&
          !v.name.toLowerCase().includes("españa") &&
          !v.name.toLowerCase().includes("castilla")
        );
        if (neutralSpanish) {
          utterance.voice = neutralSpanish;
          utterance.lang = neutralSpanish.lang;
        } else {
          const generalEs = voices.find(v => v.lang.toLowerCase().startsWith("es"));
          if (generalEs) {
            utterance.voice = generalEs;
            utterance.lang = generalEs.lang;
          }
        }
      } else {
        const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(language));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        }
      }
    }

    utterance.onend = () => {
      setReadingSpeechPlaying(false);
      setReadingSpeechText(null);
    };

    utterance.onerror = () => {
      setReadingSpeechPlaying(false);
      setReadingSpeechText(null);
    };

    setReadingSpeechText(textToRead);
    setReadingSpeechPlaying(true);

    try {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      }, 100);
    } catch (e) {
      console.error("Speech Synthesis error:", e);
      setReadingSpeechPlaying(false);
      setReadingSpeechText(null);
    }
  };

  const stopReadingResultSpeech = () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    setReadingSpeechPlaying(false);
    setReadingSpeechText(null);
  };

  const playScript = (sentences: string[], index: number) => {
    if (index >= sentences.length) {
      setVoicePlaying(false);
      setActiveSentenceIndex(-1);
      return;
    }
    if (voiceTimerRef.current) {
      clearTimeout(voiceTimerRef.current);
    }
    setActiveSentenceIndex(index);
    speakSentence(sentences[index], language, () => {
      // Create a 1.8 seconds silent pause between sentences for perfect meditation pauses
      voiceTimerRef.current = setTimeout(() => {
        setVoicePlaying(curr => {
          if (curr) {
            playScript(sentences, index + 1);
          }
          return curr;
        });
      }, 1800);
    });
  };

  const getActiveVoiceScriptSentences = (): string[] => {
    let scripts = VOICE_SCRIPTS[language][activeVoiceMed];
    if (!scripts) {
      const packs = MEDITATION_PACKS[language];
      for (const pack of packs) {
        const found = pack.exercises.find(ex => ex.id === activeVoiceMed);
        if (found) {
          scripts = found.sentences;
          break;
        }
      }
    }
    return scripts || [];
  };

  const startVoiceMeditation = () => {
    if (voicePlaying) {
      stopVoiceMeditation();
      return;
    }
    // Cancel any active speech synthesis and clear timers
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (voiceTimerRef.current) {
      clearTimeout(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }

    // Stop any active breathing session
    if (isBreathingActive) {
      stopBreathingSession();
    }

    // Stop background music and any other ambient sounds
    stopMusicInternal();
    setSoundMusic(false);
    stopAllAmbientSounds();

    const scripts = getActiveVoiceScriptSentences();
    if (scripts.length === 0) return;
    setVoicePlaying(true);
    playScript(scripts, 0);
  };

  const stopVoiceMeditation = () => {
    setVoicePlaying(false);
    setActiveSentenceIndex(-1);
    if (voiceTimerRef.current) {
      clearTimeout(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const resetTarot = () => {
    setTarotAnimateState("idle");
    setTarotReading(null);
    setTempTarotReading(null);
  };

  const resetRunes = () => {
    setRunesAnimateState("idle");
    setRunesReading(null);
    setTempRunesReading(null);
  };

  const handleVisitsClick = () => {
    setShowResetModal(true);
  };

  const handleReturnHome = () => {
    setActiveTab("inicio");
    setExpandedArticle(null);
    resetTarot();
    resetRunes();
    stopVoiceMeditation();
    if (isBreathingActive) {
      setIsBreathingActive(false);
      setBreathingState("idle");
    }
    setShowResetModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFullReset = () => {
    safeLocalStorage.clear();
    window.location.reload();
  };

  const renderVisualCard = (index: number, positionLabel: string) => {
    const isFlipped = tarotFlippedCards[index];
    const cardData = tempTarotReading?.interpretations?.[index];
    const rawCard = tempTarotReading?.drawnCards?.[index];

    return (
      <div className="flex flex-col items-center gap-1.5 w-20 sm:w-24 shrink-0">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center truncate w-full">
          {positionLabel}
        </span>
        
        <div className="relative w-16 sm:w-20 h-28 sm:h-32 [perspective:800px]">
          <motion.div
            className="w-full h-full relative [transform-style:preserve-3d] rounded-xl"
            animate={
              tarotAnimateState === "shuffling" 
                ? { scale: 0.8, y: [0, -10, 0], rotate: [0, 5, 0] }
                : {
                    scale: 1,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    rotateY: isFlipped ? 180 : 0,
                  }
            }
            transition={
              tarotAnimateState === "shuffling"
                ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                : { type: "spring", stiffness: 100, damping: 15 }
            }
          >
            {/* CARD BACK */}
            <div className="absolute inset-0 w-full h-full rounded-xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-indigo-950 p-1 flex flex-col items-center justify-between shadow-lg shadow-black/60 [backface-visibility:hidden]">
              <div className="w-full h-full rounded-lg border border-amber-500/10 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.15),transparent)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-8 h-8 rounded-full border border-amber-500/20 animate-[spin_10s_linear_infinite]" />
                <span className="text-sm font-serif text-amber-500/50">✨</span>
              </div>
            </div>

            {/* CARD FRONT */}
            <div className="absolute inset-0 w-full h-full rounded-xl border border-amber-500 bg-slate-950 p-1 flex flex-col items-center justify-between text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl shadow-amber-950/20">
              <div className="w-full h-full rounded-lg border border-amber-500/10 flex flex-col items-center justify-between p-1 bg-gradient-to-b from-slate-900/40 to-slate-950">
                <span className="text-[8px] font-bold text-amber-500 tracking-wider block truncate w-full">
                  {positionLabel}
                </span>
                <div className="flex flex-col items-center">
                  <div className={`transition-transform duration-300 ${rawCard?.isReversed ? "rotate-180" : ""}`}>
                    <span className="text-2xl block select-none">🃏</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-200 mt-1 uppercase tracking-tight block max-h-8 overflow-hidden line-clamp-2 leading-none">
                    {cardData?.cardName || "Cargando..."}
                  </span>
                </div>
                <span className="text-[7px] font-semibold text-amber-400 block max-w-full truncate">
                  {rawCard?.isReversed ? "Invertida 🔄" : "Al Derecho"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderVisualStone = (index: number, positionLabel: string) => {
    const isFlipped = runesFlippedStones[index];
    const runeData = tempRunesReading?.interpretations?.[index];
    const rawRune = tempRunesReading?.drawn?.[index];

    return (
      <div className="flex flex-col items-center gap-2 w-20 sm:w-24 shrink-0">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center truncate w-full">
          {positionLabel}
        </span>

        <div className="relative w-16 sm:w-16 h-16 sm:h-16 [perspective:600px]">
          <motion.div
            className="w-full h-full relative [transform-style:preserve-3d] rounded-2xl"
            animate={
              runesAnimateState === "shuffling"
                ? { scale: 0.8, y: [0, -6, 0] }
                : {
                    scale: 1,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    rotateY: isFlipped ? 180 : 0,
                  }
            }
            transition={
              runesAnimateState === "shuffling"
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                : { type: "spring", stiffness: 90, damping: 12 }
            }
          >
            {/* STONE BACK */}
            <div className="absolute inset-0 w-full h-full rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center shadow-lg shadow-black/80 [backface-visibility:hidden]">
              <div className="w-10 h-10 rounded-full border border-slate-800/40 bg-slate-950/60 flex items-center justify-center">
                <span className="text-xs text-slate-600">ᛉ</span>
              </div>
            </div>

            {/* STONE FRONT */}
            <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl shadow-purple-950/30 p-1">
              <span className="text-xl font-extrabold text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                {runeData?.symbol || rawRune?.symbol || "ᛉ"}
              </span>
              <span className="text-[8px] font-bold text-slate-300 mt-0.5 uppercase block truncate max-w-full px-0.5 leading-none">
                {runeData?.runeName || rawRune?.name || "Runa"}
              </span>
              {rawRune?.isReversed && (
                <span className="text-[6px] font-bold text-purple-400 uppercase tracking-widest mt-0.5 leading-none">
                  Invertida
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header Area with Prominent, Accessible Translator */}
      <header className="relative md:sticky md:top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 py-3.5 px-4 sm:px-6 flex flex-col gap-3.5">
        
        {/* Top Bar: Title & Beautiful Prominent Language Switcher */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-900/60 pb-3">
          
          <div 
            onClick={() => {
              setActiveTab("inicio");
              setExpandedArticle(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 cursor-pointer select-none hover:opacity-90 active:scale-95 transition-all"
            title={language === "es" ? "Volver al Inicio" : language === "en" ? "Go to Home" : language === "pt" ? "Ir para o Início" : "Zur Startseite"}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <span className="text-lg">🧘</span>
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-xl font-bold tracking-wide text-slate-100 flex items-center gap-1.5">
                <TwinkleText text={dict.title} glowColor="rgba(249, 168, 37, 0.5)" />
                {activeTab !== "inicio" && (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full ml-1 select-none">
                    {language === "es" ? "Volver" : language === "en" ? "Home" : language === "pt" ? "Voltar" : "Zurück"}
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Vertical Dropdown Language Selector ("Pestaña Desplegable Vertical") */}
          <div className="relative shrink-0" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 bg-slate-900/60 hover:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 transition-all duration-200 shadow-md hover:border-amber-500/30 text-xs font-bold uppercase select-none cursor-pointer"
              title={language === "es" ? "Cambiar idioma" : language === "en" ? "Change language" : language === "pt" ? "Alterar idioma" : "Sprache ändern"}
              id="btn-language-selector-trigger"
            >
              <span className="text-sm">
                {language === "es" ? "🇪🇸" : language === "en" ? "🇺🇸" : language === "pt" ? "🇵🇹" : "🇩🇪"}
              </span>
              <span className="text-[10px] tracking-widest text-slate-200">
                {language === "es" ? "ESP" : language === "en" ? "ENG" : language === "pt" ? "POR" : "DEU"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 4, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full z-[100] mt-1 w-32 bg-slate-950/95 border border-slate-800 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] py-1.5 flex flex-col divide-y divide-slate-900/60 backdrop-blur-md"
                >
                  {(["es", "en", "pt", "de"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs font-bold uppercase transition-all duration-200 flex items-center gap-2 text-left hover:bg-slate-900 ${
                        language === lang
                          ? "text-amber-300 bg-amber-500/5 font-extrabold"
                          : "text-slate-400 hover:text-slate-100"
                      }`}
                      title={lang === "es" ? "Español" : lang === "en" ? "English" : lang === "pt" ? "Português" : "Deutsch"}
                    >
                      <span className="text-sm shrink-0">
                        {lang === "es" ? "🇪🇸" : lang === "en" ? "🇺🇸" : lang === "pt" ? "🇵🇹" : "🇩🇪"}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] tracking-wider leading-none">
                          {lang === "es" ? "ESP" : lang === "en" ? "ENG" : lang === "pt" ? "POR" : "DEU"}
                        </span>
                        <span className="text-[8px] text-slate-500 capitalize leading-normal mt-0.5">
                          {lang === "es" ? "Español" : lang === "en" ? "English" : lang === "pt" ? "Português" : "Deutsch"}
                        </span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Navigation Tabs - Arranged in EXACTLY two lines with a grid layout for elegant visibility without scrolling */}
        <nav className="grid grid-cols-4 gap-1 sm:gap-1.5 bg-slate-950/85 p-1 rounded-xl border border-slate-900 shadow-2xl w-full max-w-4xl mx-auto">
            <button
              onClick={() => {
                setActiveTab("inicio");
                setExpandedArticle(null);
                setTimeout(() => {
                  const el = document.getElementById("meditacion-guiada-voz");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }, 100);
              }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "inicio"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabHome}
                glowColor={activeTab === "inicio" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("tarot"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "tarot"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabTarot}
                glowColor={activeTab === "tarot" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("runas"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "runas"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabRunes}
                glowColor={activeTab === "runas" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("cabal"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "cabal"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabKabbalah}
                glowColor={activeTab === "cabal" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("numerologia"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "numerologia"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabNumerology}
                glowColor={activeTab === "numerologia" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("astrology"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "astrology"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabAstrology}
                glowColor={activeTab === "astrology" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("angels"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "angels"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabProgress}
                glowColor={activeTab === "angels" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("biblioteca"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "biblioteca"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={dict.tabArticles}
                glowColor={activeTab === "biblioteca" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
            <button
              onClick={() => { setActiveTab("metrics"); setExpandedArticle(null); }}
              className={`px-1 py-2 sm:py-2.5 rounded-lg font-serif text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-0 text-center select-none ${
                activeTab === "metrics"
                  ? "bg-emerald-950/45 border border-amber-500/35 text-amber-300 shadow-lg shadow-amber-950/45"
                  : "border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TwinkleText
                text={language === "en" ? "Metrics" : language === "de" ? "Metriken" : language === "pt" ? "Métricas" : "Métricas"}
                glowColor={activeTab === "metrics" ? "rgba(251, 191, 36, 0.75)" : "rgba(16, 185, 129, 0.15)"}
              />
            </button>
        </nav>
      </header>

      {/* On-screen Mindfulness Reminder Alert Banner */}
      {activeReminder && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto z-50 bg-gradient-to-r from-emerald-900 to-indigo-950 border border-emerald-500/30 text-emerald-100 px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 max-w-sm animate-bounce">
          <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold tracking-wider text-amber-300">RECORDATORIO ZEN</h4>
            <p className="text-sm mt-1 leading-relaxed font-semibold">{activeReminder}</p>
          </div>
        </div>
      )}

      {/* Main Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto pt-3 px-4 pb-6 sm:pt-4 sm:px-6 flex flex-col gap-5">

        {/* Beautiful Offline Spiritual Mode Status Banner */}
        {isCosmicOffline && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 max-w-4xl mx-auto w-full shadow-lg backdrop-blur-sm shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="leading-relaxed">
              {language === "en"
                ? "The cosmic channel is temporarily silent due to high demand, but the Zen Temple continues to guide you with pre-calculated offline wisdom and full meditations."
                : language === "pt"
                ? "O canal do cosmos está temporariamente silencioso devido à alta demanda, mas o Templo Zen continua a guiar você com sabedoria offline pré-calculada e meditações completas."
                : "El canal del cosmos está en silencio temporal debido a alta demanda, pero el Templo Zen sigue guiándote con sabiduría offline precalculada y lecturas completas."}
            </span>
          </motion.div>
        )}

        {/* TAB 1: INICIO & DAILY MINDFULNESS */}
        {activeTab === "inicio" && !expandedArticle && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">


            
            {/* Horizontal Quick Jump Navigation Menu */}
            <div className="bg-slate-950/85 border border-slate-900 rounded-2xl p-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-2xl backdrop-blur-sm shrink-0">
              <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase pl-2 shrink-0 hidden sm:inline mr-1">
                {language === "en" ? "Jump to:" : language === "pt" ? "Ir para:" : "Ir a:"}
              </span>
              {((language === "en" ? [
                { name: "🧘 Daily Guide", id: "guia-diaria" },
                { name: "🎵 Music & Sounds", id: "mezclador-sonidos" },
                { name: "🗣️ Voice Guided", id: "meditacion-guiada-voz" },
                { name: "🌸 Thematic Packs", id: "colecciones-tematicas-meditacion" },
                { name: "📚 Blog & Articles", id: "blog-inicio" },
                { name: "✍️ Guestbook", id: "libro-visitas" }
              ] : language === "pt" ? [
                { name: "🧘 Guia Diário", id: "guia-diaria" },
                { name: "🎵 Música e Sons", id: "mezclador-sonidos" },
                { name: "🗣️ Guiada por Voz", id: "meditacion-guiada-voz" },
                { name: "🌸 Coleções Temáticas", id: "colecciones-tematicas-meditacion" },
                { name: "📚 Blog e Artigos", id: "blog-inicio" },
                { name: "✍️ Livro de Visitas", id: "libro-visitas" }
              ] : [
                { name: "🧘 Guía Diaria", id: "guia-diaria" },
                { name: "🎵 Música y Sonidos", id: "mezclador-sonidos" },
                { name: "🗣️ Guiada por Voz", id: "meditacion-guiada-voz" },
                { name: "🌸 Colecciones Temáticas", id: "colecciones-tematicas-meditacion" },
                { name: "📚 Blog y Artículos", id: "blog-inicio" },
                { name: "✍️ Libro de Visitas", id: "libro-visitas" }
              ])).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "libro-visitas") {
                      setIsGuestbookExpanded(true);
                    }
                    setTimeout(() => {
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, item.id === "libro-visitas" ? 150 : 0);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 text-slate-300 hover:text-emerald-300 text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-300 shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Center Content: Daily Mood Tracker & Reflection */}
            <div className="flex flex-col gap-5">
              
              {/* Daily Mood Selection Card */}
              <div id="guia-diaria" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 scroll-mt-24">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide text-slate-100 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <TwinkleText text={dict.howIsMind} glowColor="rgba(249, 168, 37, 0.5)" />
                  </h3>
                </div>

                {/* Mood buttons grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "calmado", label: "🧘 Calmado", style: "border-emerald-900/30 hover:border-emerald-500 text-emerald-400" },
                    { id: "ansioso", label: "😰 Ansioso", style: "border-amber-900/30 hover:border-amber-500 text-amber-400" },
                    { id: "triste", label: "😢 Triste", style: "border-indigo-900/30 hover:border-indigo-500 text-indigo-400" },
                    { id: "frustrado", label: "😤 Frustrado", style: "border-red-900/30 hover:border-red-500 text-red-400" },
                    { id: "cansado", label: "😴 Cansado", style: "border-slate-800 hover:border-slate-400 text-slate-300" },
                    { id: "alegre", label: "😊 Alegre", style: "border-pink-900/30 hover:border-pink-500 text-pink-400" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${m.style} ${
                        mood === m.id ? "bg-slate-850/80 border-slate-600 ring-2 ring-emerald-500/20" : "bg-slate-900/20"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Stress Level Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>NIVEL DE ESTRÉS / AGITACIÓN:</span>
                    <span className="text-emerald-400">{stressLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={generateDailyZen}
                  disabled={loadingZen}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-800 text-slate-100 font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2"
                >
                  {loadingZen ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin"></div>
                      <span>Generando Espacio de Calma...</span>
                    </>
                  ) : (
                    <span>Generar Guía Zen de Hoy</span>
                  )}
                </button>
              </div>

              {/* Zen Error Display */}
              {zenError && (
                <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 rounded-2xl text-xs leading-relaxed">
                  {zenError}
                </div>
              )}

              {/* Daily Zen Reflection Panel */}
              {dailyZen && (
                <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">ENFOQUE DE HOY</span>
                    <h2 className="font-serif text-xl font-bold text-gradient-gold mt-1">
                      {dailyZen.title}
                    </h2>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {dailyZen.reflection}
                  </p>

                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider">MANTRA SANADOR DE HOY</span>
                    <p className="font-serif italic text-base text-amber-200">
                      "{dailyZen.mantra}"
                    </p>
                  </div>

                  {/* Mindfulness Exercise Section */}
                  <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase">PRÁCTICA DEL DÍA: {dailyZen.mindfulnessExercise?.name}</span>
                      <span className="text-xs text-slate-500">{dailyZen.mindfulnessExercise?.durationMinutes} min</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {dailyZen.mindfulnessExercise?.description}
                    </p>
                  </div>

                  {/* Practical Actions Checklist */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-400 tracking-widest">ACCIONES PRÁCTICAS RECOMENDADAS</h4>
                    <div className="flex flex-col gap-2">
                      {dailyZen.practicalActions?.map((action: string, i: number) => {
                        const isDone = completedActions[action];
                        return (
                          <button
                            key={i}
                            onClick={() => toggleAction(action)}
                            className="flex items-center gap-3 text-left p-3 rounded-xl border border-slate-900/60 bg-slate-900/10 hover:bg-slate-900/30 transition-all"
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isDone ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-slate-800 text-transparent"
                            }`}>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-xs font-medium ${isDone ? "line-through text-slate-500" : "text-slate-200"}`}>
                              {action}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Breathing Guide & Sounds Panel */}
            <div id="seccion-meditacion-musica" className="flex flex-col gap-6 scroll-mt-24">
              
              {/* Interactive Breathing Guide */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col items-center gap-6">
                <div className="w-full">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" /> Respiración Zen
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Guía de respiración cuadrada para calmar tu mente de inmediato.
                  </p>
                </div>

                {/* Animated Breathing Circle */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  
                  {/* Outer breathing aura 1 */}
                  <motion.div
                    className="absolute rounded-full bg-emerald-500/5 border border-emerald-500/10"
                    animate={{
                      scale: isBreathingActive
                        ? breathingState === "inhale" || breathingState === "hold1"
                          ? 1.3
                          : 0.8
                        : [1.0, 1.06, 1.0],
                    }}
                    transition={isBreathingActive ? {
                      type: "spring",
                      stiffness: 30,
                      damping: 12,
                    } : {
                      type: "tween",
                      ease: "easeInOut",
                      repeat: Infinity,
                      duration: 4,
                    }}
                    style={{
                      width: "100%",
                      height: "100%"
                    }}
                  />

                  {/* Outer breathing aura 2 */}
                  <motion.div
                    className="absolute rounded-full bg-teal-500/5 border border-teal-500/10"
                    animate={{
                      scale: isBreathingActive
                        ? breathingState === "inhale" || breathingState === "hold1"
                          ? 1.15
                          : 0.7
                        : [0.9, 0.96, 0.9],
                    }}
                    transition={isBreathingActive ? {
                      type: "spring",
                      stiffness: 22,
                      damping: 10,
                    } : {
                      type: "tween",
                      ease: "easeInOut",
                      repeat: Infinity,
                      duration: 4,
                      delay: 0.5,
                    }}
                    style={{
                      width: "85%",
                      height: "85%"
                    }}
                  />

                  {/* Inner breathing circle */}
                  <motion.div
                    className={`absolute rounded-full bg-gradient-to-br border-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
                      !isBreathingActive
                        ? "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300 shadow-emerald-950/20"
                        : breathingState === "inhale"
                        ? "from-emerald-500/35 to-teal-500/20 border-emerald-400/60 text-emerald-200 shadow-emerald-900/40"
                        : breathingState === "hold1"
                        ? "from-amber-500/35 to-orange-400/25 border-amber-400/60 text-amber-200 shadow-amber-900/40"
                        : breathingState === "exhale"
                        ? "from-indigo-500/35 to-violet-500/25 border-indigo-400/60 text-indigo-200 shadow-indigo-900/40"
                        : "from-slate-800/40 to-slate-700/25 border-slate-600/60 text-slate-300 shadow-slate-900/40"
                    }`}
                    style={{
                      width: "72%",
                      height: "72%"
                    }}
                    animate={{
                      scale: isBreathingActive
                        ? breathingState === "inhale" || breathingState === "hold1"
                          ? 1.1
                          : 0.65
                        : [0.85, 0.9, 0.85],
                    }}
                    transition={isBreathingActive ? {
                      type: "spring",
                      stiffness: 40,
                      damping: 14,
                    } : {
                      type: "tween",
                      ease: "easeInOut",
                      repeat: Infinity,
                      duration: 4,
                    }}
                  >
                    {isBreathingActive ? (
                      <>
                        <span className="text-3xl font-serif font-black text-slate-100 select-none drop-shadow">
                          {breathingTimer}
                        </span>
                        <span className="text-[9px] font-black tracking-widest text-slate-200 uppercase mt-1.5 select-none animate-pulse">
                          {breathingState === "inhale" && "Inhala"}
                          {breathingState === "hold1" && "Retén"}
                          {breathingState === "exhale" && "Exhala"}
                          {breathingState === "hold2" && "Vacío"}
                        </span>
                      </>
                    ) : (
                      <motion.div
                        className="w-24 h-24 rounded-full overflow-hidden border border-emerald-500/20 shadow-lg cursor-pointer select-none"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        <img
                          src={zenMeditationImg}
                          alt="Zen Meditation"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Session configuration & controls */}
                <div className="w-full flex flex-col gap-4">
                  {/* Audio Accompaniment (Música de fondo y Guía de Voz) */}
                  <div className="flex flex-col gap-2.5 bg-slate-950/40 p-3 rounded-2xl border border-slate-900/60">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      {language === "en" ? "SESSION SOUNDS" : language === "pt" ? "SONS DA SESSÃO" : "ACOMPAÑAMIENTO DE AUDIO"}
                    </span>
                    
                    {/* Background Music Option */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5 select-none">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        {language === "en" ? "Background Music" : language === "pt" ? "Música de Fundo" : "Música de Fondo"}
                      </span>
                      <button
                        onClick={() => setBreathingMusicBackground(!breathingMusicBackground)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          breathingMusicBackground ? "bg-emerald-600" : "bg-slate-800"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            breathingMusicBackground ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Voice Guide Option */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5 select-none">
                          <span className="text-sm">🧘</span>
                          {language === "en" ? "Voice Guide" : language === "pt" ? "Guia de Voz" : "Guía de Voz"}
                        </span>
                        <button
                          onClick={() => setBreathingVoiceGuide(!breathingVoiceGuide)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            breathingVoiceGuide ? "bg-emerald-600" : "bg-slate-800"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              breathingVoiceGuide ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {breathingVoiceGuide && systemVoices.filter(v => {
                        if (language === "es") {
                          const hasNeutral = systemVoices.some(sv => 
                            sv.lang.toLowerCase().startsWith("es") && 
                            !(sv.lang.toLowerCase().endsWith("-es") || sv.name.toLowerCase().includes("spain") || sv.name.toLowerCase().includes("españa") || sv.name.toLowerCase().includes("castilla") || sv.name.toLowerCase().includes("castellano"))
                          );
                          if (hasNeutral) {
                            const isCastilian = v.lang.toLowerCase().endsWith("-es") || v.name.toLowerCase().includes("spain") || v.name.toLowerCase().includes("españa") || v.name.toLowerCase().includes("castilla") || v.name.toLowerCase().includes("castellano");
                            return v.lang.toLowerCase().startsWith("es") && !isCastilian;
                          }
                        }
                        return v.lang.toLowerCase().startsWith(language);
                      }).length > 0 && (
                        <div className="mt-1.5 pt-2 border-t border-slate-900/40 flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-semibold select-none">
                            {language === "en" ? "Select Voice Tone" : language === "pt" ? "Tom da Voz" : "Seleccionar Voz / Tono"}
                          </label>
                          <div className="flex gap-2 items-center">
                            <select
                              value={selectedVoiceURI}
                              onChange={(e) => {
                                const newUri = e.target.value;
                                setSelectedVoiceURI(newUri);
                                safeLocalStorage.setItem("zen_voice_uri", newUri);
                                
                                // Play a short preview
                                try {
                                  if (window.speechSynthesis) {
                                    window.speechSynthesis.cancel();
                                    const previewText = language === "en" 
                                      ? "This is your meditation voice." 
                                      : language === "pt" 
                                        ? "Esta é a voz do seu guia." 
                                        : "Esta es tu voz de meditación.";
                                    const utt = new SpeechSynthesisUtterance(previewText);
                                    const v = systemVoices.find(v => v.voiceURI === newUri);
                                    if (v) {
                                      utt.voice = v;
                                      utt.lang = v.lang;
                                    }
                                    utt.rate = 0.85;
                                    window.speechSynthesis.speak(utt);
                                  }
                                } catch (err) {}
                              }}
                              className="bg-slate-900/60 border border-slate-800 text-slate-200 text-[11px] rounded-xl px-2 py-1 flex-1 focus:outline-none focus:border-emerald-500/50 min-w-0"
                            >
                              {systemVoices
                                .filter(v => {
                                  if (language === "es") {
                                    const hasNeutral = systemVoices.some(sv => 
                                      sv.lang.toLowerCase().startsWith("es") && 
                                      !(sv.lang.toLowerCase().endsWith("-es") || sv.name.toLowerCase().includes("spain") || sv.name.toLowerCase().includes("españa") || sv.name.toLowerCase().includes("castilla") || sv.name.toLowerCase().includes("castellano"))
                                    );
                                    if (hasNeutral) {
                                      const isCastilian = v.lang.toLowerCase().endsWith("-es") || v.name.toLowerCase().includes("spain") || v.name.toLowerCase().includes("españa") || v.name.toLowerCase().includes("castilla") || v.name.toLowerCase().includes("castellano");
                                      return v.lang.toLowerCase().startsWith("es") && !isCastilian;
                                    }
                                  }
                                  return v.lang.toLowerCase().startsWith(language);
                                })
                                .map((voice) => {
                                  let cleanName = voice.name;
                                  cleanName = cleanName
                                    .replace("Microsoft", "")
                                    .replace("Google", "")
                                    .replace("Desktop", "")
                                    .trim();
                                  
                                  const parts = voice.lang.split("-");
                                  const country = parts[1] ? parts[1].toUpperCase() : "";
                                  const displayLang = country ? `(${country})` : "";
                                  
                                  const isMale = (
                                    voice.name.toLowerCase().includes("male") || 
                                    voice.name.toLowerCase().includes("masculin") || 
                                    voice.name.toLowerCase().includes("hombre") || 
                                    voice.name.toLowerCase().includes("varon") || 
                                    voice.name.toLowerCase().includes("david") || 
                                    voice.name.toLowerCase().includes("julio") || 
                                    voice.name.toLowerCase().includes("pablo") || 
                                    voice.name.toLowerCase().includes("jorge") || 
                                    voice.name.toLowerCase().includes("carlos") || 
                                    voice.name.toLowerCase().includes("miguel") || 
                                    voice.name.toLowerCase().includes("mateo") || 
                                    voice.name.toLowerCase().includes("andres") || 
                                    voice.name.toLowerCase().includes("enrique") || 
                                    voice.name.toLowerCase().includes("tomas") || 
                                    voice.name.toLowerCase().includes("microsoft paul") || 
                                    voice.name.toLowerCase().includes("google español")
                                  );
                                  
                                  const genderTag = isMale 
                                    ? (language === "en" ? " ♂ Male" : language === "pt" ? " ♂ Masculino" : " ♂ Masculina")
                                    : (language === "en" ? " ♀ Female" : language === "pt" ? " ♀ Feminina" : " ♀ Femenina");

                                  return (
                                    <option key={voice.voiceURI} value={voice.voiceURI}>
                                      {cleanName} {displayLang}{genderTag}
                                    </option>
                                  );
                                })}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  if (window.speechSynthesis) {
                                    window.speechSynthesis.cancel();
                                    const previewText = language === "en" 
                                      ? "Breathing in, breathing out." 
                                      : language === "pt" 
                                        ? "Inspirando, expirando." 
                                        : "Inhalando, exhalando.";
                                    const utt = new SpeechSynthesisUtterance(previewText);
                                    const v = systemVoices.find(v => v.voiceURI === selectedVoiceURI);
                                    if (v) {
                                      utt.voice = v;
                                      utt.lang = v.lang;
                                    }
                                    utt.rate = 0.85;
                                    window.speechSynthesis.speak(utt);
                                  }
                                } catch (err) {}
                              }}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 active:scale-95 transition-all flex items-center justify-center shrink-0"
                              title={language === "en" ? "Test Voice" : language === "pt" ? "Testar Voz" : "Probar Voz"}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isBreathingActive ? (
                    <>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {language === "en" ? "SESSION DURATION:" : language === "pt" ? "DURAÇÃO DA SESSÃO:" : language === "de" ? "SITZUNGSDAUER:" : "DURACIÓN DE SESIÓN:"}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-400 font-mono">
                            {breathingSessionLength} {language === "en" ? "min" : language === "de" ? "Min." : "min"}
                          </span>
                        </div>

                        {/* Presets and Slider Block */}
                        <div className="flex flex-col gap-2.5 bg-slate-950/20 p-3 rounded-2xl border border-slate-900">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {language === "en" ? "Presets:" : language === "pt" ? "Atalhos:" : language === "de" ? "Vorlagen:" : "Ajustes rápidos:"}
                            </span>
                            <div className="flex gap-1">
                              {[1, 2, 5, 10, 15, 20].map((mins) => (
                                <button
                                  key={mins}
                                  onClick={() => setBreathingSessionLength(mins)}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                    breathingSessionLength === mins
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : "bg-slate-950/40 text-slate-400 hover:text-slate-200 border border-slate-900"
                                  }`}
                                >
                                  {mins}M
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              <span>{language === "en" ? "Slider:" : language === "pt" ? "Ajuste Fino:" : language === "de" ? "Regler:" : "Ajuste Fino:"}</span>
                              <span className="text-slate-400 font-mono">{breathingSessionLength}m</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="30"
                              value={breathingSessionLength}
                              onChange={(e) => setBreathingSessionLength(parseInt(e.target.value, 10))}
                              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                            />
                            <div className="flex justify-between text-[9px] font-semibold text-slate-600 font-mono">
                              <span>1m</span>
                              <span>15m</span>
                              <span>30m</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={startBreathingSession}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-950/20 flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {language === "en" ? "Start Breathing" : language === "pt" ? "Iniciar Respiração" : language === "de" ? "Atmung starten" : "Comenzar Respiración"}
                        </span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="text-[10px] text-center font-semibold text-slate-400 tracking-wider uppercase">
                        {language === "en" ? "SESSION PROGRESS:" : language === "pt" ? "PROGRESSO DA SESSÃO:" : language === "de" ? "SITZUNGSFORTSCHRITT:" : "PROGRESO DE LA SESIÓN:"} {Math.floor(breathingTotalSeconds / 60)}:
                        {(breathingTotalSeconds % 60).toString().padStart(2, "0")} / {breathingSessionLength}:00
                      </div>
                      <button
                        onClick={stopBreathingSession}
                        className="w-full bg-red-950/40 hover:bg-red-900/30 border border-red-500/20 text-red-400 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {language === "en" ? "Stop Session" : language === "pt" ? "Parar Sessão" : language === "de" ? "Sitzung beenden" : "Detener Sesión"}
                        </span>
                      </button>
                    </div>
                  )}
                  
                  <BoxBreathingGuide language={language} />
                </div>
              </div>

              {/* Zen Visualizer Component */}
              <ZenVisualizer
                language={language}
                soundRain={soundRain}
                soundWaves={soundWaves}
                soundBowl={soundBowl}
                soundBirds={soundBirds}
                soundBonfire={soundBonfire}
                soundCosmicWind={soundCosmicWind}
                soundBells={soundBells}
                soundMusic={soundMusic}
                rainVolume={rainVolume}
                wavesVolume={wavesVolume}
                bowlVolume={bowlVolume}
                birdsVolume={birdsVolume}
                bonfireVolume={bonfireVolume}
                cosmicWindVolume={cosmicWindVolume}
                bellsVolume={bellsVolume}
                musicVolume={musicVolume}
                breathingState={breathingState}
              />

              {/* Relax Music & Ambient Sounds Mixer Panel */}
              <div id="mezclador-sonidos" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4 scroll-mt-24">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" /> {dict.soundMixer}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {dict.soundMixerDesc}
                  </p>
                </div>

                {/* Mixers Grid */}
                <div className="flex flex-col gap-4 mt-2">
                  
                  {/* Sound 1: Rain */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleRain}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundRain ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundRain ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundRain}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(rainVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={rainVolume}
                      onChange={(e) => setRainVolume(parseFloat(e.target.value))}
                      disabled={!soundRain}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 2: Ocean Waves */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleWaves}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundWaves ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundWaves ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundWaves}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(wavesVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={wavesVolume}
                      onChange={(e) => setWavesVolume(parseFloat(e.target.value))}
                      disabled={!soundWaves}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 3: Singing Bowl */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleBowl}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundBowl ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundBowl ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundBowl}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(bowlVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bowlVolume}
                      onChange={(e) => setBowlVolume(parseFloat(e.target.value))}
                      disabled={!soundBowl}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 4: Forest Birds */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleBirds}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundBirds ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundBirds ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundBirds}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(birdsVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={birdsVolume}
                      onChange={(e) => setBirdsVolume(parseFloat(e.target.value))}
                      disabled={!soundBirds}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 5: Bonfire */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleBonfire}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundBonfire ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundBonfire ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundBonfire}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(bonfireVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bonfireVolume}
                      onChange={(e) => setBonfireVolume(parseFloat(e.target.value))}
                      disabled={!soundBonfire}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 6: Cosmic Wind */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleCosmicWind}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundCosmicWind ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundCosmicWind ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundCosmicWind}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(cosmicWindVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={cosmicWindVolume}
                      onChange={(e) => setCosmicWindVolume(parseFloat(e.target.value))}
                      disabled={!soundCosmicWind}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 7: Celestial Bells */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleBells}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundBells ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundBells ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundBells}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(bellsVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bellsVolume}
                      onChange={(e) => setBellsVolume(parseFloat(e.target.value))}
                      disabled={!soundBells}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Sound 8: Background Music */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/30 border border-slate-900/60">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={toggleMusic}
                        className={`text-xs font-bold transition-all flex items-center gap-1.5 ${
                          soundMusic ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {soundMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{dict.soundMusic}</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-500">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      disabled={!soundMusic}
                      className="w-full accent-emerald-500 bg-slate-800/40 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />

                    {/* Music Presets Pill Buttons */}
                    <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-slate-900/40">
                      <button
                        onClick={() => setMusicPreset("celestial")}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          musicPreset === "celestial"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        ✨ Celestial
                      </button>
                      <button
                        onClick={() => setMusicPreset("solfeggio")}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          musicPreset === "solfeggio"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        🎵 528/432Hz
                      </button>
                      <button
                        onClick={() => setMusicPreset("cosmic")}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          musicPreset === "cosmic"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        🌌 Space
                      </button>
                      <button
                        onClick={() => setMusicPreset("pentatonic")}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          musicPreset === "pentatonic"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        🎋 Zen
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* 🗣️ Voice Guided Meditations Card */}
              <div id="meditacion-guiada-voz" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4 scroll-mt-24">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" /> {dict.voiceGuide}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {dict.voiceGuideDesc}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{dict.voiceMedSession}</span>
                  
                  <div className="flex flex-col gap-2">
                    {dict.voiceMeds.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => {
                          stopVoiceMeditation();
                          setActiveVoiceMed(med.id);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          activeVoiceMed === med.id
                            ? "bg-slate-850/80 border-emerald-500/50 shadow-md shadow-emerald-950/20"
                            : "bg-slate-950/20 border-slate-900 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-300">{med.name}</span>
                          <span className="text-[10px] text-slate-500">VOICE</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{med.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Playback Controls & Subtitle Highlight */}
                  <div className="mt-2 flex flex-col gap-3 p-3 rounded-2xl bg-emerald-950/10 border border-emerald-900/30">
                    <button
                      onClick={startVoiceMeditation}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        voicePlaying
                          ? "bg-amber-600 hover:bg-amber-500 text-white"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/30"
                      }`}
                    >
                      {voicePlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>{dict.stopVoice}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{dict.playVoice}</span>
                        </>
                      )}
                    </button>

                    {/* Active subtitle caption renderer */}
                    {voicePlaying && activeSentenceIndex >= 0 && (
                      <div className="mt-1 text-center py-2 px-1">
                        <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase block mb-1">
                          {dict.playingVoice}
                        </span>
                        <p className="text-xs italic text-slate-100 font-medium leading-relaxed font-serif animate-pulse">
                          "{getActiveVoiceScriptSentences()[activeSentenceIndex]}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 🌸 Themed Meditation Packs Section */}
            <div id="colecciones-tematicas-meditacion" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 scroll-mt-24">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> {PACK_LABELS[language].packsTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {PACK_LABELS[language].packsSubtitle}
                </p>
              </div>

              {/* 3 Packs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MEDITATION_PACKS[language].map((pack) => {
                  const isSelected = activePackId === pack.id;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => {
                        setActivePackId(pack.id);
                        setTimeout(() => {
                          const el = document.getElementById("detalle-coleccion-tematica");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 100);
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group ${
                        isSelected
                          ? "bg-slate-850/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20 scale-[1.02]"
                          : "bg-slate-950/20 border-slate-900 hover:border-slate-800 hover:scale-[1.01]"
                      }`}
                    >
                      {/* Colored gradient accent glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${pack.color} opacity-30 group-hover:opacity-45 transition-opacity pointer-events-none`} />
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div className={`p-2 rounded-xl bg-slate-950/60 ${pack.textColor} border border-slate-800`}>
                          {pack.icon === "ZapOff" && <ZapOff className="w-4 h-4" />}
                          {pack.icon === "Moon" && <Moon className="w-4 h-4" />}
                          {pack.icon === "Sun" && <Sun className="w-4 h-4" />}
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          7 SESS.
                        </span>
                      </div>

                      <div className="relative z-10 mt-1">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                          {pack.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                          {pack.desc}
                        </p>
                      </div>

                      {/* Active Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Pack Details and Exercises List */}
              {(() => {
                const selectedPack = MEDITATION_PACKS[language].find(p => p.id === activePackId);
                if (!selectedPack) return null;
                return (
                  <div id="detalle-coleccion-tematica" className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 scroll-mt-24">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                      <div>
                        <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
                          {PACK_LABELS[language].activePackTitle}
                        </span>
                        <h4 className={`text-sm font-bold flex items-center gap-2 ${selectedPack.textColor}`}>
                          {selectedPack.icon === "ZapOff" && <ZapOff className="w-3.5 h-3.5" />}
                          {selectedPack.icon === "Moon" && <Moon className="w-3.5 h-3.5" />}
                          {selectedPack.icon === "Sun" && <Sun className="w-3.5 h-3.5" />}
                          {selectedPack.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {selectedPack.desc}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          {PACK_LABELS[language].sessionsCount}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Guided Exercises Grid */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mb-1">
                        {PACK_LABELS[language].startExercise}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedPack.exercises.map((exercise, index) => {
                          const isCurrentPlaying = activeVoiceMed === exercise.id && voicePlaying;
                          const isCurrentSelected = activeVoiceMed === exercise.id;
                          return (
                            <button
                              key={exercise.id}
                              onClick={() => {
                                if (isCurrentPlaying) {
                                  stopVoiceMeditation();
                                } else {
                                  stopVoiceMeditation();
                                  setActiveVoiceMed(exercise.id);
                                  // Give state a small frame to update activeVoiceMed before starting playback
                                  setTimeout(() => {
                                    startVoiceMeditation();
                                  }, 50);
                                }
                              }}
                              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 group relative ${
                                isCurrentSelected
                                  ? "bg-slate-900 border-emerald-500/40 shadow-md shadow-emerald-950/30"
                                  : "bg-slate-950/40 border-slate-900/60 hover:border-slate-850 hover:bg-slate-900/20"
                              }`}
                            >
                              {/* Session Index Circle */}
                              <div className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                                isCurrentSelected
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-slate-950 text-slate-500 border-slate-900"
                              }`}>
                                {index + 1}
                              </div>

                              <div className="flex-1 min-w-0 pr-6">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[11px] font-bold truncate ${isCurrentSelected ? "text-emerald-300" : "text-slate-300 group-hover:text-slate-200"}`}>
                                    {exercise.name}
                                  </span>
                                  <span className="text-[8px] font-mono text-slate-500 shrink-0">
                                    • {exercise.duration}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                                  {exercise.desc}
                                </p>
                              </div>

                              {/* Dynamic Action/Status Button on right */}
                              <div className="absolute right-3 top-3.5">
                                {isCurrentPlaying ? (
                                  <div className="flex gap-0.5 items-end justify-center h-3 w-4">
                                    <div className="bg-emerald-400 w-0.5 h-3 animate-pulse rounded-full" />
                                    <div className="bg-emerald-400 w-0.5 h-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
                                    <div className="bg-emerald-400 w-0.5 h-2.5 animate-pulse rounded-full [animation-delay:300ms]" />
                                  </div>
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Local subtitle captions panel if the selected active voice meditation belongs to this pack */}
                    {voicePlaying && activeSentenceIndex >= 0 && selectedPack.exercises.some(ex => ex.id === activeVoiceMed) && (
                      <div className="mt-2 p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-500/10 flex flex-col items-center text-center">
                        <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          {PACK_LABELS[language].nowPlaying}
                        </span>
                        <span className="text-[10px] text-emerald-300 font-semibold mb-1">
                          {selectedPack.exercises.find(ex => ex.id === activeVoiceMed)?.name}
                        </span>
                        <p className="text-xs italic text-slate-100 font-medium leading-relaxed font-serif max-w-lg mt-1 animate-pulse">
                          "{getActiveVoiceScriptSentences()[activeSentenceIndex]}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 📚 Blog & Articles Section */}
            <div id="blog-inicio" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 scroll-mt-24 mt-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" /> {dict.libTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {dict.libDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {MINDFULNESS_ARTICLES_LOCALIZED[language].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleExpandArticle(item.title)}
                    className="bg-slate-900/40 border border-slate-900/60 rounded-3xl p-5 hover:bg-slate-900/60 hover:border-emerald-500/20 transition-all cursor-pointer flex flex-col gap-4 group animate-fade-in"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-900 flex items-center justify-center text-2xl group-hover:scale-105 transition-all select-none">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">MINDFULNESS</h4>
                      <h3 className="text-sm font-bold text-slate-200 mt-1.5 leading-snug group-hover:text-slate-100 transition-all">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-2 font-medium line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 group-hover:underline mt-2">{dict.libReadMore}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* ✍️ Guestbook (Libro de Visitas) Section */}
            <div id="libro-visitas" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 scroll-mt-24 mt-4 transition-all duration-300">
              <div 
                onClick={() => setIsGuestbookExpanded(!isGuestbookExpanded)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/10 p-2 -m-2 rounded-2xl transition-all"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Feather className="w-5 h-5 text-amber-400" />
                    {language === "en" ? "Zen Guestbook" : language === "pt" ? "Livro de Visitas Zen" : "Libro de Visitas Zen"}
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full ml-1 animate-pulse hover:animate-none select-none">
                      {isGuestbookExpanded 
                        ? (language === "en" ? "Click to collapse 🔼" : language === "pt" ? "Clique para recolher 🔼" : "Clic para contraer 🔼")
                        : (language === "en" ? "Click to expand 🔽" : language === "pt" ? "Clique para expandir 🔽" : "Clic para desplegar 🔽")}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === "en" 
                      ? "Share your peace, messages, and experiences with other souls." 
                      : language === "pt"
                      ? "Compartilhe sua paz, mensagens e experiências com outras almas."
                      : "Comparte tu paz, mensajes y experiencias con otras almas."}
                  </p>
                </div>
                
                {/* Admin configuration button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFormspreeConfig(!showFormspreeConfig);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 transition-all font-semibold flex items-center gap-1.5 self-start sm:self-center cursor-pointer active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {language === "en" ? "Settings & AdSense" : language === "pt" ? "Ajustes e Monetização" : "Ajustes y Monetización (AdSense)"}
                </button>
              </div>

              {/* Settings & AdSense Panel */}
              <AnimatePresence>
                {showFormspreeConfig && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-950/70 border border-slate-900 rounded-2xl p-5 flex flex-col gap-5 shadow-2xl"
                  >
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5" />
                      {language === "en" ? "Owner Settings & Monetization" : language === "pt" ? "Configurações e Monetização" : "Configuraciones del Creador y Monetización"}
                    </h4>

                    {/* Section 1: Google AdSense */}
                    <div className="border-t border-slate-900 pt-4 flex flex-col gap-3">
                      <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-sm">🪙</span> Google AdSense (Auto Ads)
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {language === "en"
                          ? "Monetize this site with ads automatically! Paste your AdSense Publisher ID (ID de editor) below. Google 'Auto Ads' will automatically choose the best places to display ads on the pages without any coding needed."
                          : language === "pt"
                          ? "Monetize este site com anúncios automaticamente! Cole o seu ID de Editor do AdSense abaixo. O Google 'Auto Ads' escolherá automaticamente os melhores locais para exibir anúncios nas páginas sem precisar programar."
                          : "¡Monetiza tu sitio web con publicidad de forma automática! Pega tu ID de Editor (Publisher ID) de AdSense abajo. El sistema de 'Anuncios Automáticos' (Auto Ads) de Google analizará el sitio y colocará los anuncios en los mejores lugares sin que tengas que programar nada."}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <input
                          type="text"
                          value={adsensePublisherId}
                          onChange={(e) => setAdsensePublisherId(e.target.value)}
                          placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                          className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 flex-1 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowFormspreeConfig(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                        >
                          {language === "en" ? "Save ID" : "Guardar ID"}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500 flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60 leading-relaxed mt-1">
                        <span className="font-bold text-slate-400 flex items-center gap-1">
                          📋 {language === "en" ? "How to find it:" : language === "pt" ? "Como encontrar:" : "Cómo encontrarlo:"}
                        </span>
                        <p>
                          {language === "en"
                            ? "1. Log in to your Google AdSense account."
                            : language === "pt"
                            ? "1. Faça login na sua conta do Google AdSense."
                            : "1. Inicia sesión en tu cuenta de Google AdSense."}
                        </p>
                        <p>
                          {language === "en"
                            ? "2. Go to 'Account' > 'Settings' > 'Account information'."
                            : language === "pt"
                            ? "2. Vá para 'Conta' > 'Configurações' > 'Informações da conta'."
                            : "2. Ve a 'Cuenta' > 'Configuración' > 'Información de la cuenta'."}
                        </p>
                        <p>
                          {language === "en"
                            ? "3. Copy the 'Publisher ID' (starts with 'ca-pub-') and paste it here."
                            : language === "pt"
                            ? "3. Copie o 'ID de editor' (começa com 'ca-pub-') e cole-o aqui."
                            : "3. Copia el 'ID de editor' (empieza con 'ca-pub-') y pégalo aquí."}
                        </p>
                        {adsensePublisherId && (
                          <p className="text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                            <span>✅</span> {language === "en" ? "AdSense Script is dynamically active!" : language === "pt" ? "Script do AdSense ativado dinamicamente!" : "¡El script de AdSense se ha activado dinámicamente!"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Section 2: Formspree (Guestbook) */}
                    <div className="border-t border-slate-900 pt-4 flex flex-col gap-3">
                      <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-sm">📧</span> Formspree (Notificaciones del Libro de Visitas)
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {language === "en"
                          ? "To receive guestbook messages directly in your email inbox, create a free form at Formspree.io, and enter your Form ID below:"
                          : language === "pt"
                          ? "Para receber mensagens do livro de visitas diretamente em seu e-mail, crie um formulário gratuito no Formspree.io e digite o ID do formulário abaixo:"
                          : "Para recibir los mensajes del libro de visitas directamente en tu correo electrónico, crea un formulario gratis en Formspree.io e ingresa el ID de tu formulario a continuación:"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <input
                          type="text"
                          value={guestbookFormspreeId}
                          onChange={(e) => setGuestbookFormspreeId(e.target.value)}
                          placeholder="Ej: xldebdzk"
                          className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 flex-1 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowFormspreeConfig(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                        >
                          {language === "en" ? "Save ID" : "Guardar ID"}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>💡</span>
                        <span>
                          {language === "en"
                            ? "Current endpoint: https://formspree.io/f/" + guestbookFormspreeId
                            : "Enlace de envío actual: https://formspree.io/f/" + guestbookFormspreeId}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Guestbook Form & Comments Collapsible Block */}
              <AnimatePresence initial={false}>
                {isGuestbookExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col gap-6"
                  >
                    {/* Guestbook Form */}
                    <form onSubmit={handleGuestbookSubmit} className="bg-slate-950/20 border border-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>✍️</span>
                        {language === "en" ? "Leave a Message" : language === "pt" ? "Deixe uma Mensagem" : "Dejar un Mensaje"}
                      </h4>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wide">
                          {language === "en" ? "Name" : language === "pt" ? "Nome" : "Nombre"} <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={guestbookName}
                          onChange={(e) => setGuestbookName(e.target.value)}
                          placeholder={language === "en" ? "Your name..." : language === "pt" ? "Seu nome..." : "Tu nombre..."}
                          className="bg-slate-900/60 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wide">
                          {language === "en" ? "Your Message" : language === "pt" ? "Sua Mensagem" : "Tu Mensaje"} <span className="text-amber-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={guestbookMessage}
                          onChange={(e) => setGuestbookMessage(e.target.value)}
                          placeholder={language === "en" ? "Write your message or comment here..." : language === "pt" ? "Escreva sua mensagem ou comentário aqui..." : "Escribe tu mensaje o comentario aquí..."}
                          className="bg-slate-900/60 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                        />
                      </div>

                      {/* Submit button and notification success banner */}
                      <div className="flex flex-col gap-3">
                        <button
                          type="submit"
                          disabled={isSubmittingGuestbook}
                          className="w-full sm:w-auto self-end bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/40 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-t border-emerald-300/35 animate-pulse hover:animate-none"
                        >
                          {isSubmittingGuestbook ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              {language === "en" ? "Sending to the universe..." : language === "pt" ? "Enviando ao universo..." : "Enviando al universo..."}
                            </>
                          ) : (
                            <>
                              <span>🕊️</span>
                              {language === "en" ? "Leave Comment" : language === "pt" ? "Deixar Comentário" : "Dejar Comentario"}
                            </>
                          )}
                        </button>

                        {guestbookSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-pulse"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              {language === "en"
                                ? "Message sent successfully to the universe and template creator! Thank you."
                                : language === "pt"
                                ? "Mensagem enviada com sucesso para o universo e criador do site! Obrigado."
                                : "¡Mensaje enviado con éxito al universo y al creador del sitio! Gracias por tu mensaje."}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="grid grid-cols-1 gap-3.5 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                        {guestbookMessages.map((msg: any) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-950/35 border border-slate-900/60 p-4 rounded-2xl flex gap-3.5 relative overflow-hidden group hover:border-slate-800/80 transition-all duration-300"
                          >
                            {/* Avatar / Icon */}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${msg.color || 'from-emerald-500 to-teal-600'} flex items-center justify-center text-lg shadow-inner select-none shrink-0`}>
                              {msg.avatar || "🧘"}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif text-sm font-bold text-slate-200">{msg.name}</span>
                                  <span className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                                    📍 {msg.city}
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-600 font-mono">
                                  {new Date(msg.date).toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <p className="text-xs sm:text-[13px] text-slate-300 font-medium leading-relaxed font-serif break-words">
                                "{msg.message}"
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* TAB 2: TAROT DE MARSELLA */}
        {activeTab === "tarot" && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            {tarotAnimateState === "idle" ? (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-100 text-gradient-gold">
                    🃏 Tarot
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Escribe tu duda u objetivo y selecciona tu spread de cartas para que el tarot revele sus arquetipos sagrados.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider">TU PREGUNTA AL TAROT (OPCIONAL):</label>
                    <input
                      type="text"
                      value={tarotQuestion}
                      onChange={(e) => setTarotQuestion(e.target.value)}
                      placeholder="Ej. ¿Qué debo saber sobre mi situación laboral?"
                      className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider">TIPO DE TIRADA / SPREAD:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "1-card", label: "🃏 1 Carta", desc: "Consejo rápido" },
                        { id: "3-card", label: "📖 3 Cartas", desc: "Pasado, Pres, Fut" },
                        { id: "5-card", label: "🌟 Cruz Espiritual", desc: "Guía completa" }
                      ].map((spread) => (
                        <button
                          key={spread.id}
                          onClick={() => setTarotSpread(spread.id)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col gap-0.5 ${
                            tarotSpread === spread.id ? "bg-slate-850/80 border-slate-600 text-amber-400" : "bg-slate-900/10 border-slate-900/60 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>{spread.label}</span>
                          <span className="text-[9px] font-semibold text-slate-500">{spread.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={runTarotReading}
                    disabled={loadingTarot}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-amber-950/20 flex items-center justify-center gap-2"
                  >
                    <span>Revelar Arcanos</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-inner">
                {/* Ambient gold glow */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none" />
                
                <div className="text-center z-10 flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase block mb-1">
                    {tarotAnimateState === "shuffling" && "🔮 BARAJANDO EL DECK SAGRADO"}
                    {tarotAnimateState === "dealing" && "🃏 DISTRIBUYENDO LOS ARCANOS"}
                    {tarotAnimateState === "revealing" && "✨ REVELANDO LOS ARQUETIPOS"}
                    {tarotAnimateState === "done" && "📖 LECTURA COMPLETADA"}
                  </span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {tarotAnimateState === "shuffling" && "Sintonizando la energía cósmica y ordenando los misterios..."}
                    {tarotAnimateState === "dealing" && "Disponiendo las cartas en tu plano espiritual..."}
                    {tarotAnimateState === "revealing" && "Abriendo portales espirituales para interpretar los arcanos..."}
                    {tarotAnimateState === "done" && "Tu lectura de tarot terapéutico está revelada abajo."}
                  </p>
                </div>

                {/* Shuffling animation */}
                {tarotAnimateState === "shuffling" && (
                  <div className="relative w-20 h-32 mx-auto my-6 flex items-center justify-center">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-16 h-28 rounded-xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-indigo-950 p-1 flex flex-col items-center justify-center shadow-2xl [backface-visibility:hidden]"
                        style={{ zIndex: 10 - i }}
                        animate={{
                          x: [0, (i - 2) * 16, 0],
                          y: [0, (i % 2 === 0 ? 8 : -8), 0],
                          rotate: [i * 2, -i * 4, i * 2],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="w-full h-full rounded-lg border border-amber-500/10 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.15),transparent)] flex items-center justify-center">
                          <span className="text-xs font-serif text-amber-500/40">✨</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Slots and dealt cards visual board */}
                {(tarotAnimateState === "dealing" || tarotAnimateState === "revealing" || tarotAnimateState === "done") && (
                  <div className="z-10 mt-4 overflow-x-auto pb-2 scrollbar-none">
                    {tarotSpread === "5-card" ? (
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-sm mx-auto items-center justify-center p-2 relative h-80 min-w-[280px]">
                        {/* 5-card cross placements */}
                        <div className="col-start-2 row-start-1 flex justify-center">
                          {renderVisualCard(0, "Superior")}
                        </div>
                        <div className="col-start-1 row-start-2 flex justify-center">
                          {renderVisualCard(1, "Pasado")}
                        </div>
                        <div className="col-start-2 row-start-2 flex justify-center">
                          {renderVisualCard(2, "Presente")}
                        </div>
                        <div className="col-start-3 row-start-2 flex justify-center">
                          {renderVisualCard(3, "Futuro")}
                        </div>
                        <div className="col-start-2 row-start-3 flex justify-center">
                          {renderVisualCard(4, "Base")}
                        </div>
                      </div>
                    ) : tarotSpread === "3-card" ? (
                      <div className="flex justify-center gap-3 sm:gap-6 max-w-md mx-auto py-4 min-w-[280px]">
                        {renderVisualCard(0, "Pasado")}
                        {renderVisualCard(1, "Presente")}
                        {renderVisualCard(2, "Futuro")}
                      </div>
                    ) : (
                      <div className="flex justify-center py-4 min-w-[280px]">
                        {renderVisualCard(0, "Consejo")}
                      </div>
                    )}
                  </div>
                )}

                {tarotAnimateState === "done" && (
                  <button
                    onClick={resetTarot}
                    className="w-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 font-bold text-[11px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Realizar Otra Tirada</span>
                  </button>
                )}
              </div>
            )}

            {/* Reading Results */}
            {tarotReading && (
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      {language === "en" ? "READING REPORT" : language === "pt" ? "RELATÓRIO DA LEITURA" : "INFORME DE LA LECTURA"}
                    </span>
                    <h2 className="font-serif text-lg font-bold text-slate-100 mt-1">
                      {language === "en" ? "Therapeutic Tarot Reading" : language === "pt" ? "Leitura de Tarot Terapêutico" : "Lectura de Tarot Terapéutico"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <VoicePlayerButton 
                      text={(() => {
                        let txt = tarotReading.summary + ". ";
                        if (tarotReading.interpretations) {
                          tarotReading.interpretations.forEach((item: any) => {
                            txt += `${item.cardName}: ${item.meaning || ""}. ${item.advice || ""}. `;
                          });
                        }
                        if (tarotReading.advice) {
                          txt += tarotReading.advice;
                        }
                        return txt;
                      })()}
                      language={language}
                      readingSpeechPlaying={readingSpeechPlaying}
                      readingSpeechText={readingSpeechText}
                      speakReadingResult={speakReadingResult}
                      stopReadingResultSpeech={stopReadingResultSpeech}
                    />
                    <button
                      onClick={() => exportReadingAsImage("tarot", tarotQuestion, tarotReading, language)}
                      className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
                    >
                      <Image className="w-4 h-4" />
                      <span>
                        {language === "en" ? "Export as Image" : language === "pt" ? "Exportar como Imagem" : "Exportar como Imagen"}
                      </span>
                    </button>
                    <button
                      onClick={() => exportReadingAsPdf("tarot", language === "en" ? "Therapeutic Tarot" : language === "pt" ? "Tarot Terapêutico" : language === "de" ? "Therapeutisches Tarot" : "Tarot Terapéutico", tarotQuestion, tarotReading, language)}
                      className="px-4 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {language === "en" ? "Export as PDF" : language === "pt" ? "Exportar como PDF" : language === "de" ? "Als PDF exportieren" : "Exportar como PDF"}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {tarotReading.summary}
                </p>

                {/* Cards Drawn list with descriptions */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-slate-400 tracking-wider">ARCANOS REVELADOS</h4>
                  <div className="flex flex-col gap-3">
                    {tarotReading.interpretations?.map((item: any, i: number) => {
                      const rawCard = tarotReading.drawnCards?.[i];
                      return (
                        <div key={i} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row gap-4 items-start">
                          <div className="flex flex-col items-center gap-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-900 min-w-28 text-center">
                            <span className="text-xl">🃏</span>
                            <span className="text-xs font-bold text-amber-200">{item.cardName}</span>
                            <span className="text-[9px] font-semibold text-slate-500">
                              {rawCard?.isReversed ? "Invertida 🔄" : "Al Derecho"}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{item.positionName}</span>
                            <p className="text-xs text-slate-300 leading-relaxed mt-1">
                              {item.meaning}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Integrated Advice */}
                <div className="p-5 bg-gradient-to-br from-amber-950/15 to-slate-950/50 border border-amber-500/20 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-amber-400 tracking-wider">EL CONSEJO DE HOY</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {tarotReading.advice}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RUNAS NÓRDICAS */}
        {activeTab === "runas" && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            {runesAnimateState === "idle" ? (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-100 text-gradient-purple">
                    ᚱ Sabiduría de Runas Nórdicas
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Formula una pregunta u obstáculo para que el viejo Futhark de Odín te revele sus símbolos sagrados.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider">
                      {language === "en" ? "YOUR INQUIRY TO THE RUNES (OPTIONAL):" : language === "pt" ? "SUA DÚVIDA ÀS RUNAS (OPCIONAL):" : "TU DUDA A LAS RUNAS (OPCIONAL):"}
                    </label>
                    <input
                      type="text"
                      value={runesQuestion}
                      onChange={(e) => setRunesQuestion(e.target.value)}
                      placeholder="Ej. ¿Cómo puedo destrabar mis miedos de hoy?"
                      className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider">TIPO DE CONSULTA:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "1-rune", label: "ᛉ 1 Runa", desc: "Veredicto rápido" },
                        { id: "3-runes", label: "ᚱ 3 Runas", desc: "Origen, Desafío, Destino" }
                      ].map((spread) => (
                        <button
                          key={spread.id}
                          onClick={() => setRunesSpread(spread.id)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col gap-0.5 ${
                            runesSpread === spread.id ? "bg-slate-850/80 border-slate-600 text-purple-400" : "bg-slate-900/10 border-slate-900/60 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>{spread.label}</span>
                          <span className="text-[9px] font-semibold text-slate-500">{spread.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={runRunesReading}
                    disabled={loadingRunes}
                    className="w-full bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Lanzar Runas</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-inner">
                {/* Ambient purple/indigo glow */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_70%)] pointer-events-none" />

                <div className="text-center z-10 flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase block mb-1">
                    {runesAnimateState === "shuffling" && "ᚱ AGITANDO EL SACO DE RUNAS"}
                    {runesAnimateState === "dealing" && "ᛉ EXTREYENDO LOS SÍMBOLOS"}
                    {runesAnimateState === "revealing" && "✨ REVELANDO LAS RUNAS"}
                    {runesAnimateState === "done" && "CONSULTA COMPLETADA"}
                  </span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {runesAnimateState === "shuffling" && "Mezclando los símbolos tallados en piedra de Yggdrasil..."}
                    {runesAnimateState === "dealing" && "Lanzando los runas sagradas sobre la mesa de terciopelo..."}
                    {runesAnimateState === "revealing" && "Despertando la magia nórdica tallada en cada símbolo..."}
                    {runesAnimateState === "done" && "La sabiduría de las runas ha sido revelada abajo."}
                  </p>
                </div>

                {/* Shuffling animation with the vibrating bag and orbiting rune stones */}
                {runesAnimateState === "shuffling" && (
                  <div className="relative w-40 h-40 mx-auto my-4 flex flex-col items-center justify-center">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-b from-amber-950 to-amber-900 rounded-b-full rounded-t-[40%] border-2 border-amber-800/60 shadow-xl flex items-center justify-center relative overflow-visible"
                      animate={{
                        rotate: [0, -5, 5, -5, 5, 0],
                        y: [0, -3, 0, -3, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="absolute top-3 w-24 h-1.5 bg-amber-950 rounded border-b border-amber-800/40 shadow" />
                      <span className="text-2xl font-bold text-slate-100 select-none">ᚱ</span>
                    </motion.div>

                    {/* Orbiting runes */}
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-7 h-7 rounded-full bg-purple-950/90 border border-purple-500/30 flex items-center justify-center text-[10px] font-mono font-extrabold text-purple-300 shadow shadow-purple-950/60"
                        style={{ zIndex: 50 }}
                        animate={{
                          x: [Math.sin(i * 1.5) * 45, Math.sin(i * 1.5) * 25, Math.sin(i * 1.5) * 45],
                          y: [Math.cos(i * 1.5) * 45, -Math.cos(i * 1.5) * 35, Math.cos(i * 1.5) * 45],
                          scale: [0.8, 1, 0.8],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "linear"
                        }}
                      >
                        {["ᚠ", "ᚢ", "ᚦ", "ᚨ"][i]}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Runes slots visual board */}
                {(runesAnimateState === "dealing" || runesAnimateState === "revealing" || runesAnimateState === "done") && (
                  <div className="z-10 mt-4 overflow-x-auto pb-2 scrollbar-none">
                    {runesSpread === "3-runes" ? (
                      <div className="flex justify-center gap-3 sm:gap-6 max-w-md mx-auto py-4 min-w-[280px]">
                        {renderVisualStone(0, "Origen")}
                        {renderVisualStone(1, "Desafío")}
                        {renderVisualStone(2, "Destino")}
                      </div>
                    ) : (
                      <div className="flex justify-center py-4 min-w-[280px]">
                        {renderVisualStone(0, "Veredicto")}
                      </div>
                    )}
                  </div>
                )}

                {runesAnimateState === "done" && (
                  <button
                    onClick={resetRunes}
                    className="w-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 font-bold text-[11px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Realizar Otra Consulta</span>
                  </button>
                )}
              </div>
            )}

            {/* Runes Reading Results */}
            {runesReading && (
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">MENSAJE DEL FUTHARK</span>
                    <h2 className="font-serif text-lg font-bold text-slate-100 mt-1">
                      {language === "en" ? "Ancestral Runes Reading" : language === "pt" ? "Leitura de Runas Ancestrais" : "Lectura de Runas Ancestrales"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <VoicePlayerButton 
                      text={(() => {
                        let txt = runesReading.summary + ". ";
                        if (runesReading.interpretations) {
                          runesReading.interpretations.forEach((item: any) => {
                            txt += `${item.runeName}: ${item.meaning || ""}. ${item.advice || ""}. `;
                          });
                        }
                        if (runesReading.advice) {
                          txt += runesReading.advice;
                        }
                        return txt;
                      })()}
                      language={language}
                      readingSpeechPlaying={readingSpeechPlaying}
                      readingSpeechText={readingSpeechText}
                      speakReadingResult={speakReadingResult}
                      stopReadingResultSpeech={stopReadingResultSpeech}
                    />
                    <button
                      onClick={() => exportReadingAsImage("runas", runesQuestion, runesReading, language)}
                      className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
                    >
                      <Image className="w-4 h-4" />
                      <span>
                        {language === "en" ? "Export as Image" : language === "pt" ? "Exportar como Imagem" : "Exportar como Imagen"}
                      </span>
                    </button>
                    <button
                      onClick={() => exportReadingAsPdf("runas", language === "en" ? "Ancestral Runas" : language === "pt" ? "Runas Ancestrais" : language === "de" ? "Ahnenschrift-Runen" : "Runas Ancestrales", runesQuestion, runesReading, language)}
                      className="px-4 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {language === "en" ? "Export as PDF" : language === "pt" ? "Exportar como PDF" : language === "de" ? "Als PDF exportieren" : "Exportar como PDF"}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {runesReading.summary}
                </p>

                {/* Runes details */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-slate-400 tracking-wider">SÍMBOLOS REVELADOS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {runesReading.interpretations?.map((item: any, i: number) => {
                      const rawRune = runesReading.drawn?.[i];
                      return (
                        <div key={i} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-xl font-bold text-purple-300 shrink-0 shadow-inner">
                            {item.symbol}
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">{item.position}</span>
                            <h4 className="text-xs font-bold text-slate-200 mt-0.5">{item.runeName} {rawRune?.isReversed && "🔄"}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {item.meaning}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Runes advice */}
                <div className="p-5 bg-gradient-to-br from-purple-950/15 to-slate-950/50 border border-purple-500/20 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-purple-400 tracking-wider">CONSEJO DE SABIDURÍA NÓRDICA</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {runesReading.advice}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ÁRBOL DE LA VIDA (CÁBALA) & LUNA */}
        {activeTab === "cabal" && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
            
            {/* Real Lunar Phase Card */}
            {lunaPhase && (
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-950/60 border border-slate-900 flex items-center justify-center text-5xl shadow-inner select-none animate-pulse shrink-0">
                  {lunaPhase.icon}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">FASE LUNAR REAL DE HOY</span>
                  <h3 className="font-serif text-xl font-bold text-slate-100 mt-1">
                    {lunaPhase.phaseName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Día del ciclo: {lunaPhase.cycleDay}</p>
                  
                  {lunaReading && (
                    <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-slate-900/30">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Alineación Cósmica</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <VoicePlayerButton 
                            text={`${lunaPhase.phaseName}. ${lunaReading.alignmentExplanation}`}
                            language={language}
                            readingSpeechPlaying={readingSpeechPlaying}
                            readingSpeechText={readingSpeechText}
                            speakReadingResult={speakReadingResult}
                            stopReadingResultSpeech={stopReadingResultSpeech}
                          />
                          <button
                            onClick={() => exportReadingAsPdf("luna", language === "en" ? "Lunar Influence Alignment" : language === "pt" ? "Influência Lunar" : "Alineación Lunar Real", `${language === "en" ? "Moon phase" : language === "pt" ? "Fase da lua" : "Fase lunar"}: ${lunaPhase.phaseName}`, lunaReading, language)}
                            className="px-3 py-1 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 flex items-center gap-1.5 select-none cursor-pointer hover:scale-[1.02]"
                          >
                            <Download className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>
                              {language === "en" ? "Export PDF" : language === "pt" ? "Exportar PDF" : language === "de" ? "PDF Exportieren" : "Exportar PDF"}
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        {lunaReading.alignmentExplanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tree of Life Input Panel */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-slate-800 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.08)] bg-slate-950">
                  <img
                    src={kabbalahTreeOfLifeImg}
                    alt="Árbol de la Vida - Cábala"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-serif font-bold text-slate-100 text-gradient-gold">
                    ✡️ El Árbol de la Vida
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Introduce tu nacimiento y área de interés para calcular tu Sefirah regente activa de este ciclo en las diez esferas espirituales de la Cábala.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider">FECHA DE NACIMIENTO:</label>
                  <input
                    type="date"
                    value={treeBirth}
                    onChange={(e) => setTreeBirth(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider">ÁREA DE ENFOQUE ESPIRITUAL:</label>
                  <select
                    value={treeArea}
                    onChange={(e) => setTreeArea(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
                  >
                    <option value="Desarrollo Espiritual">Desarrollo Espiritual</option>
                    <option value="Relaciones & Amor">Relaciones & Amor</option>
                    <option value="Abundancia & Carrera">Abundancia & Carrera</option>
                    <option value="Equilibrio Emocional">Equilibrio Emocional</option>
                    <option value="Salud & Bienestar">Salud & Bienestar</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runTreeOfLife}
                disabled={loadingTree || !treeBirth}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 text-slate-100 font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loadingTree ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin"></div>
                    <span>Alineando con las Diez Sefirot...</span>
                  </>
                ) : (
                  <span>Revelar Alineación Cabalística</span>
                )}
              </button>
            </div>

            <KabbalahGuide language={language} />

            <TreeOfLifeVisualizer treeReading={treeReading} language={language} />

            {/* Tree Reading results */}
            {treeReading && (
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-900/50">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">MAPA DE ALINEACIÓN CABALÍSTICA</span>
                    <h2 className="font-serif text-lg font-bold text-slate-100 mt-1">
                      El Árbol de la Vida
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <VoicePlayerButton 
                      text={(() => {
                        let txt = `${treeReading.activeSefirah?.name || ""}. ${treeReading.activeSefirah?.archetype || ""}. ${treeReading.activeSefirah?.value || ""}. ${treeReading.alignmentExplanation || ""}. `;
                        if (treeReading.sefirotMap) {
                          treeReading.sefirotMap.forEach((item: any) => {
                            txt += `${item.sefirah}: Fortaleza: ${item.strength || ""}. Desafío: ${item.shadow || ""}. `;
                          });
                        }
                        if (treeReading.kabbalisticMeditation) {
                          txt += `Meditación de hoy: ${treeReading.kabbalisticMeditation.title || ""}. Práctica: ${treeReading.kabbalisticMeditation.practice || ""}. `;
                        }
                        if (treeReading.blessing) {
                          txt += treeReading.blessing;
                        }
                        return txt;
                      })()}
                      language={language}
                      readingSpeechPlaying={readingSpeechPlaying}
                      readingSpeechText={readingSpeechText}
                      speakReadingResult={speakReadingResult}
                      stopReadingResultSpeech={stopReadingResultSpeech}
                    />
                    <button
                      onClick={() => exportReadingAsPdf("arbol", language === "en" ? "Tree of Life Alignment" : language === "pt" ? "Alinhamento da Árvore da Vida" : "Alineación del Árbol de la Vida", `Nacimiento: ${treeBirth || ""} | Área: ${treeArea || "General"}`, treeReading, language)}
                      className="px-3.5 py-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[11px] font-bold uppercase transition-all duration-300 flex items-center gap-2 select-none cursor-pointer hover:scale-[1.02]"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {language === "en" ? "Export PDF" : language === "pt" ? "Exportar PDF" : language === "de" ? "PDF Exportieren" : "Exportar PDF"}
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Active Sefirah Box */}
                <div className="p-5 bg-gradient-to-br from-emerald-950/15 to-slate-950/40 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-400 shrink-0">
                    ✡️
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">TU SEFIRAH DE ALINEACIÓN ACTUAL</span>
                    <h3 className="text-base font-serif font-black text-slate-100 mt-0.5">{treeReading.activeSefirah?.name}</h3>
                    <p className="text-[11px] text-slate-400">{treeReading.activeSefirah?.archetype} · {treeReading.activeSefirah?.value}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {treeReading.alignmentExplanation}
                </p>

                {/* Sefirot maps list */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-slate-400 tracking-wider">FUERZAS Y SOMBRAS DE HOY</h4>
                  <div className="flex flex-col gap-3">
                    {treeReading.sefirotMap?.map((item: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-2">
                        <span className="text-xs font-serif font-bold text-emerald-300">{item.sefirah}</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          <strong className="text-emerald-400">Fortaleza:</strong> {item.strength}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          <strong className="text-amber-500/70">Desafío / Sombra:</strong> {item.shadow}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kabbalistic meditation */}
                <div className="p-5 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">VISUALIZACIÓN Y MEDITACIÓN RECOMENDADA</span>
                  <h4 className="text-xs font-bold text-slate-200">{treeReading.kabbalisticMeditation?.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">
                    {treeReading.kabbalisticMeditation?.practice}
                  </p>
                </div>

                {/* Blessing */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">BENDICIÓN CABALÍSTICA</span>
                  <p className="font-serif italic text-xs text-slate-200 mt-1">
                    "{treeReading.blessing}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NUMEROLOGÍA PITAGÓRICA */}
        {activeTab === "numerologia" && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
              {/* Floating Numbers Decoration */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                {[
                  { value: "1", size: "text-4xl", top: "10%", left: "5%", delay: 0, duration: 6, color: "text-amber-400/25" },
                  { value: "7", size: "text-3xl", top: "45%", left: "12%", delay: 1.2, duration: 7, color: "text-emerald-400/25" },
                  { value: "3", size: "text-5xl", top: "15%", right: "8%", delay: 0.4, duration: 6.5, color: "text-purple-400/20" },
                  { value: "4", size: "text-2xl", top: "60%", right: "20%", delay: 1.8, duration: 8, color: "text-rose-400/25" },
                  { value: "11", size: "text-4xl", top: "65%", left: "8%", delay: 0.8, duration: 7.5, color: "text-teal-400/25" },
                  { value: "22", size: "text-5xl", top: "30%", right: "25%", delay: 2.2, duration: 9, color: "text-amber-400/25" },
                  { value: "33", size: "text-4xl", top: "40%", left: "35%", delay: 1.5, duration: 8.5, color: "text-emerald-400/20" },
                  { value: "5", size: "text-2xl", top: "10%", left: "45%", delay: 2.8, duration: 5, color: "text-indigo-400/25" },
                  { value: "8", size: "text-3xl", top: "50%", right: "45%", delay: 0.6, duration: 8, color: "text-cyan-400/25" },
                  { value: "9", size: "text-4xl", top: "75%", right: "12%", delay: 2.0, duration: 7.2, color: "text-rose-400/20" },
                  { value: "2", size: "text-3xl", top: "25%", left: "22%", delay: 0.3, duration: 6.8, color: "text-teal-400/20" },
                  { value: "6", size: "text-2xl", top: "80%", left: "45%", delay: 1.1, duration: 7.8, color: "text-amber-400/20" },
                ].map((num, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: "absolute",
                      top: num.top,
                      left: num.left,
                      right: num.right,
                    }}
                    className={`${num.size} ${num.color} font-mono font-bold`}
                    animate={{
                      y: [0, -32, 0],
                      x: [0, 12, -12, 0],
                      rotate: [0, 15, -15, 0],
                      opacity: [0.2, 0.65, 0.2],
                    }}
                    transition={{
                      duration: num.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: num.delay,
                    }}
                  >
                    {num.value}
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-serif font-bold text-slate-100 text-gradient-gold flex items-center gap-2 flex-wrap select-none">
                  <span>🔢 Análisis Numerológico</span>
                  <span className="flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-black select-none tracking-widest">
                    [<MovingDigit /><MovingDigit /><MovingDigit /><MovingDigit />]
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Introduce tu nombre de nacimiento y tu fecha para analizar las vibraciones pitagóricas de tu alma y destino.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider">TU NOMBRE COMPLETO:</label>
                  <input
                    type="text"
                    value={numName}
                    onChange={(e) => setNumName(e.target.value)}
                    placeholder="Ej. María de los Ángeles González"
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider">FECHA DE NACIMIENTO:</label>
                  <input
                    type="date"
                    value={numBirth}
                    onChange={(e) => setNumBirth(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <button
                onClick={runNumerology}
                disabled={loadingNum || !numName || !numBirth}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 text-slate-100 font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loadingNum ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculando Planos Vibracionales...</span>
                  </>
                ) : (
                  <span>Revelar Numerología Pitagórica</span>
                )}
              </button>
            </div>

            {/* Numerology Reading Results */}
            {numerologyReading && (
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">MAPA DE VIBRACIÓN PITAGÓRICA</span>
                    <h2 className="font-serif text-lg font-bold text-slate-100 mt-1">
                      Análisis de Vibración Pitagórica
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <VoicePlayerButton 
                      text={(() => {
                        let txt = `${numerologyReading.introduction || ""}. `;
                        if (numerologyReading.scores) {
                          txt += `Camino de vida: ${numerologyReading.scores.lifePath || ""}. `;
                          txt += `Expresión de alma: ${numerologyReading.scores.soulExpression || ""}. `;
                          txt += `Deseo del corazón: ${numerologyReading.scores.heartDesire || ""}. `;
                          txt += `Destino pitagórico: ${numerologyReading.scores.destinyNumber || ""}. `;
                        }
                        if (numerologyReading.cosmicAdvice) {
                          txt += numerologyReading.cosmicAdvice;
                        }
                        return txt;
                      })()}
                      language={language}
                      readingSpeechPlaying={readingSpeechPlaying}
                      readingSpeechText={readingSpeechText}
                      speakReadingResult={speakReadingResult}
                      stopReadingResultSpeech={stopReadingResultSpeech}
                    />
                    <button
                      onClick={() => exportReadingAsPdf("numerologia", language === "en" ? "Pythagorean Numerology" : language === "pt" ? "Numerologia Pitagórica" : "Numerología Pitagórica", `Nombre: ${numName || ""} | Nacimiento: ${numBirth || ""}`, numerologyReading, language)}
                      className="px-3.5 py-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[11px] font-bold uppercase transition-all duration-300 flex items-center gap-2 select-none cursor-pointer hover:scale-[1.02]"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {language === "en" ? "Export PDF" : language === "pt" ? "Exportar PDF" : language === "de" ? "PDF Exportieren" : "Exportar PDF"}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {numerologyReading.introduction}
                </p>

                {/* Score details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Score 1: Life Path */}
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">CAMINO DE VIDA</span>
                      <span className="text-2xl font-serif font-black text-emerald-300">{numerologyReading.scores?.lifePath}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {numerologyReading.lifePathInterpretation}
                    </p>
                  </div>

                  {/* Score 2: Expression */}
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">EXPRESIÓN / DESTINO</span>
                      <span className="text-2xl font-serif font-black text-emerald-300">{numerologyReading.scores?.expression}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {numerologyReading.expressionInterpretation}
                    </p>
                  </div>

                  {/* Score 3: Soul Urge */}
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">DESEO DEL ALMA</span>
                      <span className="text-2xl font-serif font-black text-emerald-300">{numerologyReading.scores?.soulUrge}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {numerologyReading.soulUrgeInterpretation}
                    </p>
                  </div>

                  {/* Score 4: Personality */}
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider">MÁSCARA PERSONALIDAD</span>
                      <span className="text-2xl font-serif font-black text-emerald-300">{numerologyReading.scores?.personality}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {numerologyReading.personalityInterpretation}
                    </p>
                  </div>
                </div>

                {/* Cosmic advice */}
                <div className="p-5 bg-gradient-to-br from-emerald-950/15 to-slate-950/50 border border-emerald-500/20 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider">CONSEJO DE ALINEACIÓN VIBRACIONAL</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {numerologyReading.cosmicAdvice}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LIBRARY & RECENT ARTICLES */}
        {activeTab === "biblioteca" && !expandedArticle && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" /> {dict.libTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {dict.libDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {MINDFULNESS_ARTICLES_LOCALIZED[language].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleExpandArticle(item.title)}
                  className="bg-slate-900/40 border border-slate-900/60 rounded-3xl p-5 hover:bg-slate-900/60 hover:border-emerald-500/20 transition-all cursor-pointer flex flex-col gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-900 flex items-center justify-center text-2xl group-hover:scale-105 transition-all select-none">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">MINDFULNESS</h4>
                    <h3 className="text-sm font-bold text-slate-200 mt-1.5 leading-snug group-hover:text-slate-100 transition-all">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-2 font-medium">
                      {item.summary}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 group-hover:underline mt-2">{dict.libReadMore}</span>
                </div>
              ))}
            </div>
            {/* Modal placeholder while loading */}
            {loadingArticle && (
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <div className="spin-zen mb-4"></div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: "700" }}>{dict.libDeepKnowledge}</p>
              </div>
            )}
          </div>
        )}

        {/* EXPANDED ARTICLE VIEW */}
        {expandedArticle && (
          <div className="max-w-4xl mx-auto w-full bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
            <button
              onClick={() => setExpandedArticle(null)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold self-start flex items-center gap-1"
            >
              {dict.libBackBtn}
            </button>

            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">BIBLIOTECA INTERACTIVA</span>
              <h1 className="font-serif text-xl font-bold text-gradient-gold mt-1">
                {expandedArticle.title}
              </h1>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic">
              {expandedArticle.intro}
            </p>

            {/* Ambient Nature Sound Controller */}
            <div className="bg-slate-950/60 border border-emerald-500/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl transition-all ${librarySoundActive ? "bg-emerald-500/10 text-emerald-400 animate-pulse" : "bg-slate-900 text-slate-500"}`}>
                  {librarySoundType === "wind" ? (
                    <Wind className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {language === "en" ? "Ambient Nature Sound" : language === "pt" ? "Som Ambiente da Natureza" : "Sonido Ambiental de la Naturaleza"}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {librarySoundActive 
                      ? (language === "en" ? "Playing automatically for deep immersion" : language === "pt" ? "Tocando automaticamente para imersão profunda" : "Sonido activo para máxima inmersión")
                      : (language === "en" ? "Sound is paused" : language === "pt" ? "O som está pausado" : "Sonido pausado")
                    }
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Selector */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => {
                      setLibrarySoundType("wind");
                      setLibrarySoundActive(true);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      librarySoundActive && librarySoundType === "wind"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🍃 {language === "en" ? "Wind" : language === "pt" ? "Vento" : "Viento Suave"}
                  </button>
                  <button
                    onClick={() => {
                      setLibrarySoundType("crickets");
                      setLibrarySoundActive(true);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      librarySoundActive && librarySoundType === "crickets"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🦗 {language === "en" ? "Crickets" : language === "pt" ? "Grilos" : "Grillos de Noche"}
                  </button>
                </div>

                {/* Volume and Toggle */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      {Math.round(librarySoundVolume * 100)}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={librarySoundVolume}
                      onChange={(e) => setLibrarySoundVolume(parseFloat(e.target.value))}
                      className="w-16 accent-emerald-500 h-1 rounded-lg bg-slate-800 appearance-none cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setLibrarySoundActive(!librarySoundActive)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      librarySoundActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400"
                    }`}
                    title={librarySoundActive ? "Pausar Sonido" : "Activar Sonido"}
                  >
                    {librarySoundActive ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {expandedArticle.sections?.map((sec: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold text-emerald-300 font-serif">{sec.heading}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Daily Practice & Quote */}
            <div className="p-5 bg-gradient-to-br from-emerald-950/15 to-slate-950/40 border border-emerald-500/20 rounded-2xl flex flex-col gap-3">
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">PRÁCTICA RECOMENDADA DE 1 MINUTO</span>
              <p className="text-xs text-white leading-relaxed font-semibold">{expandedArticle.practice}</p>
            </div>

            <div className="text-center text-xs text-slate-500 italic font-semibold">
              "{expandedArticle.quote}"
            </div>
          </div>
        )}

        {/* TAB: ASTROLOGY (DAILY TRANSITS & ZODIAC PROFILE) */}
        {activeTab === "astrology" && (
          <AstrologyTab language={language} />
        )}

        {/* TAB: TELEMETRY & METRICS DASHBOARD */}
        {activeTab === "metrics" && (
          <MetricsTab language={language} />
        )}

        {/* TAB 7: ORACLE OF THE ANGELS OF LIGHT & INTEGRATED PROGRESS/STATS */}
        {activeTab === "angels" && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
            {/* Title Block */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white mt-2">
                {language === "en" ? "Oracle of the Angels of Light" : language === "pt" ? "Oráculo dos Anjos de Luz" : "Oráculo de los Ángeles de Luz"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                {language === "en"
                  ? "Formulate an intention or query, draw a celestial card, and let the loving wisdom of the Archangels guide your path."
                  : language === "pt"
                  ? "Formule uma intenção ou pergunta, tire uma carta celestial e deixe a sabedoria amorosa dos Arcanjos guiar seu caminho."
                  : "Formula una intención o pregunta de tu corazón, extrae una carta celestial y permite que la sabiduría amorosa de los Arcánteles sintonice tu camino."}
              </p>
            </div>

            {/* Main Interactive Card Drawing Panel */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 items-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {angelsAnimateState === "idle" && (
                <div className="w-full max-w-md flex flex-col gap-5 items-center">
                  <div className="w-full flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center sm:text-left">
                      {language === "en" ? "YOUR SPIRITUAL INTENTION OR QUESTION:" : language === "pt" ? "SUA INTENÇÃO OU PERGUNTA ESPIRITUAL:" : "TU INTENCIÓN O PREGUNTA ESPIRITUAL:"}
                    </label>
                    <input
                      type="text"
                      value={angelsQuestion}
                      onChange={(e) => setAngelsQuestion(e.target.value)}
                      placeholder={
                        language === "en"
                          ? "What do my angels want me to know today?..."
                          : language === "pt"
                          ? "O que meus anjos querem que eu saiba hoje?..."
                          : "¿Qué necesitan mis ángeles que comprenda hoy?..."
                      }
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium text-center"
                    />
                  </div>

                  {/* Draw button */}
                  <button
                    onClick={fetchAngelsReading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-serif text-xs font-bold uppercase tracking-widest rounded-2xl border border-blue-400/30 shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] active:scale-95 transition-all cursor-pointer"
                  >
                    {language === "en" ? "Draw Angel Card" : language === "pt" ? "Retirar Carta do Anjo" : "Extraer Carta Celestial"}
                  </button>
                </div>
              )}

              {angelsAnimateState === "shuffling" && (
                <div className="flex flex-col items-center justify-center gap-6 py-10">
                  <div className="relative w-28 h-40 flex items-center justify-center">
                    <motion.div
                      animate={{
                        x: [-10, 10, -10],
                        rotate: [-5, 5, -5],
                      }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute w-24 h-36 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-500/30 rounded-2xl shadow-xl flex items-center justify-center"
                    >
                      <Feather className="w-8 h-8 text-blue-400 opacity-60" />
                    </motion.div>
                    <motion.div
                      animate={{
                        x: [10, -10, 10],
                        rotate: [5, -5, 5],
                      }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute w-24 h-36 bg-gradient-to-br from-indigo-950 to-blue-900 border border-indigo-500/30 rounded-2xl shadow-xl flex items-center justify-center -rotate-6 translate-x-2"
                    >
                      <Sparkles className="w-8 h-8 text-indigo-400 opacity-60" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-serif font-bold text-blue-300 animate-pulse">
                      {language === "en" ? "Sensing your energetic frequency..." : language === "pt" ? "Sintonizando sua frequência energética..." : "Sintonizando tu frecuencia energética..."}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">
                      {language === "en" ? "Consulting the angels of light" : language === "pt" ? "Consultando os anjos de luz" : "Invocando a los mensajeros celestiales"}
                    </p>
                  </div>
                </div>
              )}

              {angelsAnimateState === "revealing" && (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin"></div>
                  <p className="text-xs text-slate-400 font-mono">
                    {language === "en" ? "Channeling celestial guidance..." : language === "pt" ? "Canalizando orientação celestial..." : "Canalizando consejo divino..."}
                  </p>
                </div>
              )}

              {angelsAnimateState === "done" && angelsReading && (
                <div className="w-full flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                  
                  {/* Glowing Oracle Card */}
                  <div className="shrink-0 relative group">
                    <div 
                      className="relative w-64 h-96 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-2xl transition-all duration-700"
                      style={{
                        background: "linear-gradient(135deg, #090d16 0%, #111a2e 100%)",
                        border: "2px solid rgba(59, 130, 246, 0.4)",
                        boxShadow: "0 0 35px rgba(59, 130, 246, 0.25)"
                      }}
                    >
                      <div className="absolute inset-0 bg-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      {/* Card Header/Virtue */}
                      <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10">
                        {angelsReading.crystal}
                      </span>

                      {/* Card Graphic */}
                      <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center my-4 animate-pulse">
                        <Feather className="w-10 h-10 text-blue-300" />
                      </div>

                      {/* Card Name */}
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-serif font-black text-white tracking-wide">
                          {angelsReading.angelName}
                        </h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          {angelsReading.angelTitle}
                        </p>
                      </div>

                      {/* Card Footer Decoration */}
                      <div className="w-full flex justify-center items-center gap-2 mt-4">
                        <div className="h-px bg-blue-500/20 flex-1"></div>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <div className="h-px bg-blue-500/20 flex-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Channeled Message Details */}
                  <div className="flex-1 w-full flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                          {language === "en" ? "CHANNELED ANGELIC MESSAGE" : language === "pt" ? "MENSAGEM CANALIZADA" : "MENSAJE CELESTIAL CANALIZADO"}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-100 mt-1">
                          {angelsReading.angelTitle}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                        <VoicePlayerButton 
                          text={(() => {
                            let txt = `${angelsReading.angelName || ""}, ${angelsReading.angelTitle || ""}. `;
                            if (angelsReading.crystal) {
                              txt += `${language === "en" ? "Connection Crystal" : language === "pt" ? "Cristal de conexão" : "Cristal de conexión"}: ${angelsReading.crystal}. `;
                            }
                            txt += `${angelsReading.coreMessage || ""}. `;
                            if (angelsReading.affirmation) {
                              txt += `${language === "en" ? "Daily light affirmation" : language === "pt" ? "Afirmação diária de luz" : "Afirmación diaria de luz"}: ${angelsReading.affirmation}. `;
                            }
                            return txt;
                          })()}
                          language={language}
                          readingSpeechPlaying={readingSpeechPlaying}
                          readingSpeechText={readingSpeechText}
                          speakReadingResult={speakReadingResult}
                          stopReadingResultSpeech={stopReadingResultSpeech}
                        />
                        <button
                          onClick={() => exportReadingAsPdf("angeles", language === "en" ? "Channeled Angelic Guidance" : language === "pt" ? "Orientação Angélica" : "Mensaje de los Ángeles", language === "en" ? "Sensing Energetic Frequency" : language === "pt" ? "Sintonização de Frequência" : "Sintonización de Frecuencia Energética", angelsReading, language)}
                          className="px-3.5 py-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[11px] font-bold uppercase transition-all duration-300 flex items-center gap-2 select-none cursor-pointer hover:scale-[1.02]"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {language === "en" ? "Export PDF" : language === "pt" ? "Exportar PDF" : language === "de" ? "PDF Exportieren" : "Exportar PDF"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 font-semibold bg-slate-950/30 p-5 rounded-2xl border border-slate-900">
                      {angelsReading.coreMessage.split("\n").map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {/* Affirmation Box */}
                    <div className="p-4 bg-gradient-to-r from-blue-950/30 to-indigo-950/20 border border-blue-500/25 rounded-2xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          {language === "en" ? "DAILY LIGHT AFFIRMATION" : language === "pt" ? "AFIRMAÇÃO DIÁRIA DE LUZ" : "AFIRMACIÓN DIÁRIA DE LUZ"}
                        </h4>
                        <p className="text-xs text-white font-semibold mt-1 italic">
                          "{angelsReading.affirmation}"
                        </p>
                      </div>
                    </div>

                    {/* Practical Connection Action */}
                    <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-2xl flex items-start gap-3">
                      <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {language === "en" ? "CONNECTION EXERCISE" : language === "pt" ? "EXERCÍCIO DE CONEXÃO" : "EJERCICIO DE CONEXIÓN"}
                        </h4>
                        <p className="text-xs text-slate-300 font-semibold mt-1 leading-relaxed">
                          {angelsReading.practicalAction}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-2 flex justify-center sm:justify-start">
                      <button
                        onClick={() => {
                          setAngelsAnimateState("idle");
                          setAngelsReading(null);
                        }}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        {language === "en" ? "Receive another message" : language === "pt" ? "Receber outro conselho" : "Recibir otra guía"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PROGRESS, STATISTICS, AND RECORDINGS HISTORY */}
            <div className="border-t border-slate-900/60 pt-8 flex flex-col gap-8">
              
              {/* Configuration / Mood notifications toggle card */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-emerald-400" /> Configuración de Conciencia
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Establece un intervalo de atención plena para recordarte hacer pausas sagradas.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Recordatorios de Atención Plena</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {language === "en" ? "Periodic mindfulness messages" : language === "pt" ? "Mensagens periódicas de atenção plena" : "Mensajes de atención plena periódicos"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={reminderInterval}
                      onChange={(e) => setReminderInterval(parseInt(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value={1}>Cada 1 hora</option>
                      <option value={4}>Cada 4 horas</option>
                      <option value={8}>Cada 8 horas</option>
                    </select>

                    <button
                      onClick={() => {
                        setRemindersEnabled(!remindersEnabled);
                        if (!remindersEnabled) triggerCustomNotification("¡Recordatorios Zen activados! Nos mantendremos conectados.");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        remindersEnabled ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {remindersEnabled ? "Habilitados" : "Deshabilitados"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-3xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">RACHA DIARIA</span>
                  <div className="text-3xl font-serif font-black text-amber-400 mt-1">{streak}</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Días seguidos</span>
                </div>

                <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-3xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">RESPIRACIÓN</span>
                  <div className="text-3xl font-serif font-black text-emerald-400 mt-1">🧘 {minutesMeditated}M</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Minutos totales</span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-4 bg-slate-900/40 border border-slate-900 rounded-3xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">TAREAS DIARIAS</span>
                  <div className="text-3xl font-serif font-black text-indigo-400 mt-1">
                    ✅ {Object.values(completedActions).filter(Boolean).length}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Acciones completadas</span>
                </div>
              </div>

              {/* Readings History Logs */}
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" /> Diario de Lecturas & Consultas
                </h3>
                <p className="text-xs text-slate-400">
                  Lista histórica de tus lecturas de Tarot, Runas, Ángeles y Numerología para recordar tus consejos espirituales del pasado.
                </p>

                <div className="flex flex-col gap-3">
                  {readingsHistory.length === 0 ? (
                    <div className="p-6 bg-slate-900/10 border border-slate-900/60 rounded-3xl text-center text-xs text-slate-500 font-semibold italic">
                      {language === "en" ? "You haven't saved any readings yet. Perform a query to begin!" : language === "pt" ? "Você ainda não salvou nenhuma consulta. Faça uma consulta para começar!" : "Aún no has guardado ninguna lectura. ¡Realiza una consulta para comenzar!"}
                    </div>
                  ) : (
                    readingsHistory.map((record) => (
                      <div key={record.id} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-emerald-400 uppercase tracking-widest">{record.type}</span>
                          <span className="text-slate-500">{record.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200">Pregunta: "{record.query}"</h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {record.summary}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer / Copyright credits */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-6 text-center text-[11px] text-slate-500 font-medium flex flex-col items-center justify-center gap-2">
        <p className="tracking-wide">© 2026 Momentos Zen · Tu Refugio Espiritual</p>
        <p className="text-slate-600 mt-1">Conectando la sabiduría ancestral y la inteligencia artificial para guiar tu paz interior.</p>
        
        {/* Cafecito / Gratitude Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-3 bg-slate-900/40 px-6 py-4 rounded-3xl border border-amber-500/20 hover:border-amber-500/40 max-w-md sm:max-w-xl md:max-w-2xl shadow-xl transition-all duration-300">
          <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100 bg-clip-text text-transparent text-sm sm:text-base md:text-lg font-extrabold leading-relaxed animate-pulse drop-shadow-[0_1px_8px_rgba(245,158,11,0.45)] tracking-wide text-center sm:text-left">
            {language === "en"
              ? "If you enjoyed this moment of relaxation 🤭"
              : language === "pt"
              ? "Se você gostou deste momento de relaxamento 🤭"
              : "Si disfrutaste de este momento de relax 🤭"}
          </span>
          <div className="relative shrink-0 mt-2 sm:mt-0" ref={coffeeRef}>
            <button
              onClick={() => setShowCoffeeOptions(!showCoffeeOptions)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-emerald-400 hover:text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-500/70 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 select-none cursor-pointer"
              title={language === "en" ? "Buy me a coffee 🤭" : language === "pt" ? "Me pagar um cafezinho 🤭" : "Invítame un cafecito 🤭"}
            >
              <span className="flex items-center gap-1.5">
                <Coffee className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <span>{language === "en" ? "Buy me a coffee 🤭" : language === "pt" ? "Me pagar um cafezinho 🤭" : "Invítame un cafecito 🤭"}</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-300 ${showCoffeeOptions ? 'rotate-180' : ''}`} />
            </button>

            <div
              className={`absolute bottom-full right-1/2 translate-x-1/2 sm:right-0 sm:translate-x-0 mb-3 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl z-50 min-w-[210px] border-amber-500/30 transition-all duration-300 origin-bottom ${
                showCoffeeOptions
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <div className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-wider border-b border-slate-900 pb-2 mb-1">
                {language === "en" ? "Support the project" : language === "pt" ? "Apoiar o projeto" : "Apoyar al proyecto"}
              </div>
              
              {/* Mercado Pago */}
              <a
                href="https://mpago.la/1LHyBwV"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCoffeeOptions(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/40 rounded-xl transition-all duration-300 cursor-pointer select-none"
                title={language === "en" ? "Mercado Pago (Argentina)" : "Mercado Pago (Argentina)"}
              >
                <span className="text-sm">🇦🇷</span>
                <span>Mercado Pago</span>
              </a>

              {/* PayPal */}
              <a
                href="https://paypal.me/margsaft?locale.x=es_XC&country.x=AR"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCoffeeOptions(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-sky-300 hover:text-white hover:bg-sky-500/10 border border-sky-500/10 hover:border-sky-500/40 rounded-xl transition-all duration-300 cursor-pointer select-none"
                title={language === "en" ? "PayPal (International)" : "PayPal (Internacional)"}
              >
                <span className="text-sm">🌎</span>
                <span>PayPal</span>
              </a>
            </div>
          </div>
        </div>

        {/* Visitors badge twinkling below */}
        <div className="flex items-center gap-2.5 justify-center mt-2 flex-wrap">
          <button
            onClick={handleVisitsClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[10px] transition-all cursor-pointer select-none active:scale-95 shadow-md shadow-black/40"
            title={language === "en" ? "Click to reset or return to Home" : "Clic para reiniciar o volver al Inicio"}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            </span>
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <span>{language === "en" ? "Visitors:" : "Visitantes:"}</span>
              <span className="font-mono text-amber-400 font-bold animate-twinkle">
                {visitorCount.toLocaleString()}
              </span>
            </span>
          </button>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-[10px] transition-all select-none shadow-md shadow-black/40"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <span>{language === "en" ? "Online Visitors:" : language === "pt" ? "Visitantes online:" : "Visitantes en línea:"}</span>
              <span className="font-mono text-emerald-400 font-bold animate-pulse">
                {onlineCount.toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </footer>

      {/* RESET & NAVIGATION DIALOG */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-sm w-full bg-slate-900 border border-slate-850 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl z-10"
            >
              <div className="text-center">
                <span className="text-2xl block mb-2 select-none">🔮</span>
                <h3 className="font-serif text-lg font-bold text-slate-100 text-gradient-gold">
                  {language === "en" ? "Spiritual Alignment" : "Alineación Espiritual"}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {language === "en" 
                    ? "Would you like to return to the Home page or completely restart your spiritual session?" 
                    : "¿Deseas volver a la página de Inicio o reiniciar tu sesión espiritual por completo?"}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <button
                  onClick={handleReturnHome}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  🏠 {language === "en" ? "Return to Home" : "Volver al Inicio"}
                </button>

                <button
                  onClick={handleFullReset}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  🔄 {language === "en" ? "Restart Entire Site" : "Reiniciar Sitio Completo"}
                </button>

                <button
                  onClick={() => setShowResetModal(false)}
                  className="w-full bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-slate-400 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center"
                >
                  {language === "en" ? "Cancel" : "Cancelar"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
