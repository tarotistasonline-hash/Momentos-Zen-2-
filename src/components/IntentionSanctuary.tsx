import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Sparkles, MapPin, Share2, Heart, Plus, Check } from "lucide-react";
import { safeLocalStorage } from "../utils/safeStorage";

interface Intention {
  id: string;
  name: string;
  location: string;
  category: "peace" | "healing" | "love" | "abundance" | "protection";
  text: string;
  color: string;
  date: string;
  isUserCreated?: boolean;
}

interface IntentionSanctuaryProps {
  language: "es" | "en" | "pt" | "de";
}

const LOCALIZED_DICT = {
  es: {
    title: "🕊️ Santuario de Velas e Intenciones Colectivas",
    subtitle: "Enciende una vela virtual en nuestro templo zen y une tu intención con almas de todo el mundo. Tu energía crea resonancia.",
    formName: "Nombre o Iniciales:",
    formLocation: "Ciudad / País:",
    formCategory: "Propósito de la Vela:",
    formIntention: "Tu Intención o Plegaria Silenciosa:",
    formPlaceholder: "Escribe aquí lo que deseas manifestar o sanar en tu vida...",
    btnLight: "Encender Vela Sagrada",
    btnLitSuccess: "¡Vela Encendida en el Altar!",
    recentTitle: "Velas Encendidas Recientemente en el Templo",
    shareMessage: "He encendido una vela de {category} en el Santuario de Momentos Zen para guiar mi paz interior. Enciende la tuya aquí: {url}",
    shareTitle: "Compartir Luz",
    cats: {
      peace: "Paz y Claridad",
      healing: "Salud y Sanación",
      love: "Amor y Armonía",
      abundance: "Abundancia y Sabiduría",
      protection: "Protección y Transmutación",
    },
    toastShared: "¡Enlace de luz copiado para compartir!"
  },
  en: {
    title: "🕊️ Sanctuary of Candles & Collective Intentions",
    subtitle: "Light a virtual candle in our Zen temple and join your intention with souls around the globe. Your energy creates resonance.",
    formName: "Name or Initials:",
    formLocation: "City / Country:",
    formCategory: "Purpose of the Candle:",
    formIntention: "Your Intention or Silent Prayer:",
    formPlaceholder: "Write here what you wish to manifest or heal in your life...",
    btnLight: "Light Sacred Candle",
    btnLitSuccess: "Candle Lit on the Altar!",
    recentTitle: "Recently Lit Candles in the Temple",
    shareMessage: "I have lit a {category} candle in the Momentos Zen Sanctuary to guide my inner peace. Light yours here: {url}",
    shareTitle: "Share Light",
    cats: {
      peace: "Peace & Clarity",
      healing: "Health & Healing",
      love: "Love & Harmony",
      abundance: "Abundance & Wisdom",
      protection: "Protection & Transmutation",
    },
    toastShared: "Light link copied to share!"
  },
  pt: {
    title: "🕊️ Santuário de Velas e Intenções Coletivas",
    subtitle: "Acenda uma vela virtual em nosso templo zen e una sua intenção com almas de todo o mundo. Sua energia cria ressonância.",
    formName: "Nome ou Iniciais:",
    formLocation: "Cidade / País:",
    formCategory: "Propósito da Vela:",
    formIntention: "Sua Intenção ou Oração Silenciosa:",
    formPlaceholder: "Escreva aqui o que você deseja manifestar ou curar em sua vida...",
    btnLight: "Acender Vela Sagrada",
    btnLitSuccess: "Vela Acesas no Altar!",
    recentTitle: "Velas Acesas Recentemente no Templo",
    shareMessage: "Eu acendi uma vela de {category} no Santuário de Momentos Zen para guiar minha paz interior. Acenda a sua aqui: {url}",
    shareTitle: "Compartilhar Luz",
    cats: {
      peace: "Paz e Clareza",
      healing: "Saúde e Cura",
      love: "Amor e Harmonia",
      abundance: "Abundância e Sabedoria",
      protection: "Proteção e Transmutação",
    },
    toastShared: "Link de luz copiado para compartilhar!"
  },
  de: {
    title: "🕊️ Heiligtum der Kerzen & Kollektiven Intentionen",
    subtitle: "Zünden Sie eine virtuelle Kerze in unserem Zen-Tempel an und verbinden Sie Ihre Absicht mit Seelen auf der ganzen Welt.",
    formName: "Name oder Initialen:",
    formLocation: "Stadt / Land:",
    formCategory: "Zweck der Kerze:",
    formIntention: "Ihre Absicht oder Ihr stilles Gebet:",
    formPlaceholder: "Schreiben Sie hier, was Sie in Ihrem Leben manifestieren oder heilen möchten...",
    btnLight: "Heilige Kerze anzünden",
    btnLitSuccess: "Kerze auf dem Altar angezündet!",
    recentTitle: "Kürzlich angezündete Kerzen im Tempel",
    shareMessage: "Ich habe eine Kerze für {category} im Momentos Zen Heiligtum angezündet. Zünden Sie Ihre hier an: {url}",
    shareTitle: "Licht teilen",
    cats: {
      peace: "Friede & Klarheit",
      healing: "Gesundheit & Heilung",
      love: "Liebe & Harmonie",
      abundance: "Überfluss & Weisheit",
      protection: "Schutz & Transmutation",
    },
    toastShared: "Licht-Link zum Teilen kopiert!"
  }
};

const INITIAL_INTENTIONS: Intention[] = [
  {
    id: "preset-1",
    name: "Aiko K.",
    location: "Tokyo, Japan",
    category: "peace",
    text: "Paz para todos los seres sintientes de la tierra y tranquilidad en los momentos de transición.",
    color: "#38bdf8", // Sapphire Blue
    date: "Hoy"
  },
  {
    id: "preset-2",
    name: "Elena M.",
    location: "Madrid, España",
    category: "healing",
    text: "Sanación profunda para el cuerpo y el espíritu de mi abuela y paz mental en mi hogar.",
    color: "#34d399", // Emerald Green
    date: "Hoy"
  },
  {
    id: "preset-3",
    name: "Sarah & Leo",
    location: "London, UK",
    category: "love",
    text: "Que el amor incondicional sane las distancias y fortalezca la comprensión mutua.",
    color: "#f43f5e", // Ruby Red
    date: "Hoy"
  },
  {
    id: "preset-4",
    name: "Carlos T.",
    location: "Buenos Aires, Argentina",
    category: "abundance",
    text: "Apertura de caminos laborales prósperos y sabiduría para tomar decisiones alineadas.",
    color: "#fbbf24", // Golden Yellow
    date: "Hoy"
  },
  {
    id: "preset-5",
    name: "Amélie D.",
    location: "Paris, France",
    category: "protection",
    text: "Protección espiritual contra las energías discordantes y transmutación del miedo en luz.",
    color: "#c084fc", // Amethyst Purple
    date: "Hoy"
  },
  {
    id: "preset-6",
    name: "Mateo R.",
    location: "Bogotá, Colombia",
    category: "peace",
    text: "Encuentro de mi centro de gravedad y serenidad en medio de los desafíos cotidianos.",
    color: "#38bdf8",
    date: "Hoy"
  }
];

export function IntentionSanctuary({ language }: IntentionSanctuaryProps) {
  const dict = LOCALIZED_DICT[language] || LOCALIZED_DICT.es;

  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<"peace" | "healing" | "love" | "abundance" | "protection">("peace");
  const [text, setText] = useState("");
  const [isLiting, setIsLiting] = useState(false);
  const [litSuccess, setLitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Load existing intentions from localStorage, if any, and combine with presets
    const saved = safeLocalStorage.getItem("zen_lit_candles");
    if (saved) {
      try {
        const userCandles = JSON.parse(saved) as Intention[];
        setIntentions([...userCandles, ...INITIAL_INTENTIONS]);
      } catch (e) {
        setIntentions(INITIAL_INTENTIONS);
      }
    } else {
      setIntentions(INITIAL_INTENTIONS);
    }
  }, []);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "peace": return "#38bdf8"; // Sapphire
      case "healing": return "#34d399"; // Emerald
      case "love": return "#f43f5e"; // Ruby
      case "abundance": return "#fbbf24"; // Golden
      case "protection": return "#c084fc"; // Amethyst
      default: return "#f59e0b";
    }
  };

  const handleLightCandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLiting(true);

    setTimeout(() => {
      const newCandle: Intention = {
        id: "user-" + Date.now(),
        name: name.trim() || (language === "es" ? "Buscador Anónimo" : "Anonymous Seeker"),
        location: location.trim() || (language === "es" ? "Universo" : "The Cosmos"),
        category,
        text: text.trim(),
        color: getCategoryColor(category),
        date: language === "es" ? "Ahora" : "Just now",
        isUserCreated: true
      };

      const saved = safeLocalStorage.getItem("zen_lit_candles");
      let userCandlesList: Intention[] = [];
      if (saved) {
        try {
          userCandlesList = JSON.parse(saved);
        } catch (err) {}
      }
      userCandlesList.unshift(newCandle);
      safeLocalStorage.setItem("zen_lit_candles", JSON.stringify(userCandlesList));

      setIntentions([newCandle, ...intentions]);
      setIsLiting(false);
      setLitSuccess(true);
      setText("");
      setName("");
      setLocation("");

      setTimeout(() => {
        setLitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const handleShare = (candle: Intention) => {
    const appUrl = typeof window !== "undefined" ? window.location.href : "https://momentoszen.online";
    const catName = dict.cats[candle.category];
    const msg = dict.shareMessage
      .replace("{category}", catName)
      .replace("{url}", appUrl);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 scroll-mt-24 w-full shadow-xl relative overflow-hidden">
      {/* Sacred ambient background blur */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.15)] select-none">
          <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-slate-100 flex items-center gap-2">
            {dict.title}
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {dict.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Temple Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Intention Input Form */}
        <form onSubmit={handleLightCandle} className="lg:col-span-5 bg-slate-950/50 border border-slate-900/80 p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
              {language === "es" ? "ENCENDER UNA VELA" : "LIGHT A CANDLE"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{dict.formName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Lucas M."
                maxLength={25}
                disabled={isLiting}
                className="bg-slate-900/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/30 font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{dict.formLocation}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Buenos Aires"
                maxLength={30}
                disabled={isLiting}
                className="bg-slate-900/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/30 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{dict.formCategory}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["peace", "healing", "love", "abundance", "protection"] as const).map((cat) => {
                const color = getCategoryColor(cat);
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-1.5 rounded-lg border text-[9px] font-bold text-center transition-all flex flex-col items-center gap-1 select-none cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-amber-500/50 shadow-md shadow-black/40 scale-[1.03]"
                        : "bg-slate-900/20 border-slate-850 hover:bg-slate-900 hover:border-slate-800"
                    }`}
                    style={{ color: isSelected ? color : "rgba(255,255,255,0.4)" }}
                  >
                    <Flame
                      className="w-3.5 h-3.5 shrink-0"
                      style={{
                        color: color,
                        filter: isSelected ? `drop-shadow(0 0 6px ${color})` : "none"
                      }}
                    />
                    <span className="truncate w-full block text-[8px]">
                      {dict.cats[cat].split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{dict.formIntention}</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={dict.formPlaceholder}
              maxLength={150}
              rows={3}
              disabled={isLiting}
              className="bg-slate-900/60 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/30 leading-relaxed resize-none font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isLiting || !text.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-serif text-xs font-bold uppercase tracking-widest rounded-xl border border-amber-500/20 shadow-lg disabled:opacity-45 transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
          >
            {isLiting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                <span>{language === "es" ? "Consagrando Vela..." : "Consecrating Candle..."}</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                <span>{dict.btnLight}</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {litSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400 font-bold flex items-center gap-2 justify-center"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dict.btnLitSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Collective Temple Wall (Interactive Candle Altar) */}
        <div className="lg:col-span-7 flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              {dict.recentTitle}
            </span>
            <span className="text-[9px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10 select-none">
              {intentions.length} {language === "es" ? "VELAS ACTIVAS" : "ACTIVE CANDLES"}
            </span>
          </div>

          {/* Interactive Altar Rack */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {intentions.map((candle, idx) => {
                return (
                  <motion.div
                    key={candle.id}
                    initial={candle.isUserCreated ? { scale: 0.3, opacity: 0, y: 20 } : { opacity: 1 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col gap-2.5 hover:bg-slate-950/70 hover:border-slate-800/60 transition-all duration-300 relative group min-h-[125px] overflow-hidden shadow-inner"
                  >
                    {/* Tiny visual candle base & glowing flame */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center relative pl-2 select-none h-9 w-9 justify-end">
                        {/* Soft background halo */}
                        <div
                          className="absolute w-8 h-8 rounded-full opacity-20 blur-md animate-pulse pointer-events-none"
                          style={{
                            backgroundColor: candle.color,
                            bottom: "12px",
                            left: "0",
                            animationDuration: "2s"
                          }}
                        />
                        {/* Flickering flame */}
                        <motion.div
                          className="w-2.5 h-4 rounded-full"
                          style={{
                            background: `radial-gradient(ellipse at bottom, #ffffff 10%, ${candle.color} 50%, transparent 100%)`,
                            filter: `drop-shadow(0 0 6px ${candle.color})`,
                            transformOrigin: "bottom center"
                          }}
                          animate={{
                            scaleY: [1, 1.25, 0.95, 1.15, 1],
                            scaleX: [1, 0.85, 1.05, 0.9, 1],
                            rotate: [-2, 3, -1, 4, 0]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.8 + Math.random() * 0.4,
                            ease: "easeInOut"
                          }}
                        />
                        {/* Small candle wax tube */}
                        <div
                          className="w-3.5 h-3.5 rounded-t-sm"
                          style={{
                            background: `linear-gradient(90deg, ${candle.color}88 0%, ${candle.color}dd 50%, ${candle.color}aa 100%)`,
                            border: `0.5px solid ${candle.color}44`
                          }}
                        />
                      </div>

                      {/* Location and share button */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleShare(candle)}
                          className="p-1 rounded-md bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-amber-400 transition-all select-none cursor-pointer"
                          title={dict.shareTitle}
                        >
                          <Share2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1 flex-wrap text-slate-300">
                        <span className="text-[10px] font-bold truncate leading-none">
                          {candle.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[8px] text-slate-500 font-bold mt-0.5 uppercase leading-none">
                        <MapPin className="w-2 h-2 text-slate-600 shrink-0" />
                        <span className="truncate max-w-[85px] block">{candle.location}</span>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none font-medium">
                        "{candle.text}"
                      </p>
                    </div>

                    <div className="text-[8px] font-semibold text-slate-600 self-end mt-1 uppercase">
                      {candle.date}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Copy notification popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 bg-amber-500 border border-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{dict.toastShared}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
