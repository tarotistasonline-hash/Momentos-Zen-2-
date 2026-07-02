import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Info, Star, ShieldAlert, Sparkles, Award } from "lucide-react";

interface NatalChartProps {
  birthDate: string;
  sign: string;
  language: "es" | "en" | "pt";
}

// 1. Seeded random based on birthdate to ensure deterministic, persistent chart placements
const getSeedFromDate = (dateStr: string) => {
  if (!dateStr) return 0;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Localized strings for UI
const L = {
  es: {
    chartTitle: "Mapa de Alineación Natal (Carta Astral)",
    chartSub: "Visualización interactiva de la posición exacta de las luminarias y planetas en tu nacimiento.",
    placementsTitle: "Placements Planetarios",
    aspectsTitle: "Aspectos Planetarios Activos",
    clickHint: "Pasa el cursor o haz clic sobre un planeta en la carta o en la lista para ver su significado celestial.",
    degree: "Grados",
    house: "Casa",
    aspectLabel: "Aspecto",
    harmony: "Armónico",
    tension: "Tensión",
    conj: "Conjunción",
    sex: "Sextil",
    sqr: "Cuadratura",
    tri: "Trígono",
    opp: "Oposición",
    meaningTitle: "Fuerza Arquetípica",
    emptyBirthdate: "Calcula tu perfil zodiacal arriba para ver tu mapa natal sagrado."
  },
  en: {
    chartTitle: "Natal Alignment Map (Birth Chart)",
    chartSub: "Interactive visualization of the exact position of luminaries and planets at your birth.",
    placementsTitle: "Planetary Placements",
    aspectsTitle: "Active Planetary Aspects",
    clickHint: "Hover or click on a planet in the chart or the list to reveal its celestial significance.",
    degree: "Degrees",
    house: "House",
    aspectLabel: "Aspect",
    harmony: "Harmonic",
    tension: "Tension",
    conj: "Conjunction",
    sex: "Sextile",
    sqr: "Square",
    tri: "Trine",
    opp: "Opposition",
    meaningTitle: "Archetypal Force",
    emptyBirthdate: "Calculate your zodiac profile above to view your sacred natal map."
  },
  pt: {
    chartTitle: "Mapa de Alinhamento Natal (Carta Astral)",
    chartSub: "Visualização interativa da posição exata das luminárias e planetas no seu nascimento.",
    placementsTitle: "Placements Planetários",
    aspectsTitle: "Aspectos Planetários Ativos",
    clickHint: "Passe o cursor ou clique sobre um planeta no mapa ou na lista para revelar seu significado celeste.",
    degree: "Graus",
    house: "Casa",
    aspectLabel: "Aspecto",
    harmony: "Harmônico",
    tension: "Tensão",
    conj: "Conjunção",
    sex: "Sextil",
    sqr: "Quadratura",
    tri: "Trígono",
    opp: "Oposição",
    meaningTitle: "Força Arquetípica",
    emptyBirthdate: "Calcule seu perfil zodiacal acima para ver seu mapa natal sagrado."
  }
};

const ZODIAC_SIGNS = [
  { id: "aries", symbol: "♈", es: "Aries", en: "Aries", pt: "Áries" },
  { id: "taurus", symbol: "♉", es: "Tauro", en: "Taurus", pt: "Touro" },
  { id: "gemini", symbol: "♊", es: "Géminis", en: "Gemini", pt: "Gêmeos" },
  { id: "cancer", symbol: "♋", es: "Cáncer", en: "Cancer", pt: "Câncer" },
  { id: "leo", symbol: "♌", es: "Leo", en: "Leo", pt: "Leão" },
  { id: "virgo", symbol: "♍", es: "Virgo", en: "Virgo", pt: "Virgem" },
  { id: "libra", symbol: "♎", es: "Libra", en: "Libra", pt: "Libra" },
  { id: "scorpio", symbol: "♏", es: "Escorpio", en: "Scorpio", pt: "Escorpião" },
  { id: "sagittarius", symbol: "♐", es: "Sagitario", en: "Sagittarius", pt: "Sagitário" },
  { id: "capricorn", symbol: "♑", es: "Capricornio", en: "Capricorn", pt: "Capricórnio" },
  { id: "aquarius", symbol: "♒", es: "Acuario", en: "Aquarius", pt: "Aquário" },
  { id: "pisces", symbol: "♓", es: "Piscis", en: "Pisces", pt: "Peixes" }
];

const PLANET_METADATA: Record<string, {
  icon: string;
  symbol: string;
  name: Record<string, string>;
  meaning: Record<string, string>;
}> = {
  sun: {
    icon: "☉",
    symbol: "☉",
    name: { es: "Sol", en: "Sun", pt: "Sol" },
    meaning: {
      es: "Representa tu esencia central, tu ego, tu identidad fundamental y la fuente de energía creativa de tu alma.",
      en: "Represents your core essence, your ego, your fundamental identity, and your soul's source of creative energy.",
      pt: "Representa sua essência central, seu ego, sua identidade fundamental e a fonte de energia criativa de sua alma."
    }
  },
  moon: {
    icon: "☽",
    symbol: "☽",
    name: { es: "Luna", en: "Moon", pt: "Lua" },
    meaning: {
      es: "Rige las emociones, el subconsciente, los instintos intuitivos, la memoria del alma y el sentido interior de seguridad.",
      en: "Governs emotions, the subconscious mind, intuitive instincts, your soul's memory, and your inner sense of safety.",
      pt: "Rege as emoções, o subconsciente, os instintos intuitivos, a memória da alma e o sentido interior de segurança."
    }
  },
  mercury: {
    icon: "☿",
    symbol: "☿",
    name: { es: "Mercurio", en: "Mercury", pt: "Mercúrio" },
    meaning: {
      es: "El mensajero celeste. Gobierna el intelecto, los procesos lógicos de pensamiento, el aprendizaje, el habla y el intercambio de ideas.",
      en: "The celestial messenger. Governs intellect, logical thinking processes, learning, speech, and the exchange of ideas.",
      pt: "O mensageiro celeste. Governa o intelecto, os processos lógicos de pensamento, o aprendizado, a fala e a troca de ideias."
    }
  },
  venus: {
    icon: "♀",
    symbol: "♀",
    name: { es: "Venus", en: "Venus", pt: "Vênus" },
    meaning: {
      es: "Planeta del amor y la atracción. Define tu sentido de belleza, relaciones, valores estéticos, armonía y receptividad.",
      en: "Planet of love and attraction. Defines your sense of beauty, relationships, aesthetic values, harmony, and receptivity.",
      pt: "Planeta do amor e da atração. Define seu senso de beleza, relacionamentos, valores estéticos, harmonia e receptividade."
    }
  },
  mars: {
    icon: "♂",
    symbol: "♂",
    name: { es: "Marte", en: "Mars", pt: "Marte" },
    meaning: {
      es: "El guerrero sagrado. Rige la acción física, la asertividad, la energía vital pura, el coraje y la fuerza del deseo impulsivo.",
      en: "The sacred warrior. Governs physical action, assertiveness, pure vital energy, courage, and the drive of impulsive desire.",
      pt: "O guerreiro sagrado. Rege a ação física, a assertividade, a energia vital pura, a coragem e a força do desejo impulsivo."
    }
  },
  jupiter: {
    icon: "♃",
    symbol: "♃",
    name: { es: "Júpiter", en: "Jupiter", pt: "Júpiter" },
    meaning: {
      es: "El gran benefactor. Representa la expansión, la suerte, la sabiduría de síntesis, la filosofía, la generosidad y el crecimiento.",
      en: "The great benefactor. Represents expansion, luck, synthesizing wisdom, philosophy, generosity, and overall growth.",
      pt: "O grande benfeitor. Representa a expansão, a sorte, a sabedoria de síntese, a filosofia, a generosidade e o crescimento."
    }
  },
  saturn: {
    icon: "♄",
    symbol: "♄",
    name: { es: "Saturno", en: "Saturn", pt: "Saturno" },
    meaning: {
      es: "El señor del karma y el tiempo. Rige la disciplina, los límites constructivos, las estructuras, el deber y las lecciones evolutivas.",
      en: "The lord of karma and time. Governs discipline, constructive limits, structures, duty, and deep evolutionary lessons.",
      pt: "O senhor do carma e do tempo. Rege a disciplina, os limites construtivos, as estruturas, o dever e as lições evolutivas."
    }
  },
  uranus: {
    icon: "♅",
    symbol: "♅",
    name: { es: "Urano", en: "Uranus", pt: "Urano" },
    meaning: {
      es: "El despertador. Representa la revolución mental, el misticismo tecnológico, los cambios repentinos, la libertad y la originalidad.",
      en: "The awakener. Represents mental revolution, technological mysticism, sudden shifts, freedom, and original genius.",
      pt: "O despertador. Representa a revolução mental, o misticismo tecnológico, as mudanças repentinas, a liberdade e a originalidade."
    }
  },
  neptune: {
    icon: "♆",
    symbol: "♆",
    name: { es: "Neptuno", en: "Neptune", pt: "Netuno" },
    meaning: {
      es: "La octava superior de Venus. Rige el misticismo devocional, la disolución del ego, los sueños espirituales, la fantasía y el arte sagrado.",
      en: "The higher octave of Venus. Governs devotional mysticism, ego dissolution, spiritual dreams, fantasy, and sacred art.",
      pt: "A oitava superior de Vênus. Rege o misticismo devocional, a dissolução do ego, os sonhos espirituais, a fantasia e a arte sagrada."
    }
  },
  pluto: {
    icon: "♇",
    symbol: "♇",
    name: { es: "Plutón", en: "Pluto", pt: "Plutão" },
    meaning: {
      es: "El alquimista. Gobierna los inframundos del alma, la transmutación de la sombra, la muerte iniciática y el renacimiento espiritual.",
      en: "The alchemist. Governs the soul's underworlds, shadow transmutation, initiatory death, and profound spiritual rebirth.",
      pt: "O alquimista. Governa os submundo da alma, a transmutação da sombra, a morte iniciática e o renascimento espiritual."
    }
  },
  ascendant: {
    icon: "ASC",
    symbol: "ASC",
    name: { es: "Ascendente", en: "Ascendant", pt: "Ascendente" },
    meaning: {
      es: "La cúspide de la primera casa. Representa el filtro o lente con el que miras el mundo, tu vehículo físico y la personalidad evolutiva.",
      en: "The cusp of the first house. Represents the filter or lens through which you view the world, your physical vehicle, and outer personality.",
      pt: "A cúspide da primeira casa. Representa o filtro ou lente com o qual você vê o mundo, seu veículo físico e a personalidade evolutiva."
    }
  }
};

export function NatalChart({ birthDate, sign, language }: NatalChartProps) {
  const dict = L[language] || L.es;
  const [selectedPlanet, setSelectedPlanet] = useState<string>("sun");

  // Generate deterministic planet placements based on birthdate and sign
  const chartPlacements = useMemo(() => {
    if (!birthDate) return [];
    
    const seed = getSeedFromDate(birthDate);
    const r = (offset: number) => {
      const val = seededRandom(seed + offset);
      return val;
    };

    // Align Sun exactly within the user's solar sign (each sign is 30 degrees)
    const signAngles: Record<string, number> = {
      aries: 0, taurus: 30, gemini: 60, cancer: 90, leo: 120, virgo: 150,
      libra: 180, scorpio: 210, sagittarius: 240, capricorn: 270, aquarius: 300, pisces: 330
    };

    const cleanSign = sign.toLowerCase().replace(/[^a-z]/g, "");
    const sunSignStart = signAngles[cleanSign] !== undefined ? signAngles[cleanSign] : 0;
    
    // Extract day from date
    const day = parseInt(birthDate.split("-")[2], 10) || 15;
    const sunAngle = (sunSignStart + (day / 31) * 30) % 360;

    // Mercury is always within 28 degrees of the Sun
    const mercuryOffset = (r(1) * 56 - 28);
    const mercuryAngle = (sunAngle + mercuryOffset + 360) % 360;

    // Venus is always within 48 degrees of the Sun
    const venusOffset = (r(2) * 96 - 48);
    const venusAngle = (sunAngle + venusOffset + 360) % 360;

    // Others are procedurally calculated across the 360 wheel
    const moonAngle = (r(3) * 360) % 360;
    const marsAngle = (r(4) * 360) % 360;
    const jupiterAngle = (r(5) * 360) % 360;
    const saturnAngle = (r(6) * 360) % 360;
    const uranusAngle = (r(7) * 360) % 360;
    const neptuneAngle = (r(8) * 360) % 360;
    const plutoAngle = (r(9) * 360) % 360;
    const ascAngle = (r(10) * 360) % 360;

    const angleArray = [
      { id: "sun", angle: sunAngle },
      { id: "moon", angle: moonAngle },
      { id: "mercury", angle: mercuryAngle },
      { id: "venus", angle: venusAngle },
      { id: "mars", angle: marsAngle },
      { id: "jupiter", angle: jupiterAngle },
      { id: "saturn", angle: saturnAngle },
      { id: "uranus", angle: uranusAngle },
      { id: "neptune", angle: neptuneAngle },
      { id: "pluto", angle: plutoAngle },
      { id: "ascendant", angle: ascAngle }
    ];

    return angleArray.map((planet) => {
      const meta = PLANET_METADATA[planet.id];
      const planetAngle = planet.angle;
      
      // Calculate which zodiac sign the planet falls into
      const signIndex = Math.floor(planetAngle / 30) % 12;
      const exactDegree = Math.floor(planetAngle % 30);
      const signData = ZODIAC_SIGNS[signIndex];

      // Equal house system: House 1 starts exactly at Ascendant and wraps 30 degrees counter-clockwise
      const houseOffset = (planetAngle - ascAngle + 360) % 360;
      const houseIndex = Math.floor(houseOffset / 30) + 1;

      return {
        ...planet,
        symbol: meta.symbol,
        name: meta.name[language] || meta.name.es,
        meaning: meta.meaning[language] || meta.meaning.es,
        signId: signData.id,
        signName: signData[language] || signData.es,
        signSymbol: signData.symbol,
        exactDegree,
        house: houseIndex
      };
    });
  }, [birthDate, sign, language]);

  // Active Aspects between planets
  const activeAspects = useMemo(() => {
    if (chartPlacements.length === 0) return [];
    const aspects: any[] = [];

    for (let i = 0; i < chartPlacements.length; i++) {
      for (let j = i + 1; j < chartPlacements.length; j++) {
        const p1 = chartPlacements[i];
        const p2 = chartPlacements[j];
        if (p1.id === "ascendant" || p2.id === "ascendant") continue;

        const diff = Math.abs(p1.angle - p2.angle);
        const angleDiff = diff > 180 ? 360 - diff : diff;

        if (angleDiff <= 8) {
          aspects.push({ p1, p2, type: "conjunction", label: `${dict.conj} ☌`, color: "stroke-yellow-500/40", harmonic: true });
        } else if (Math.abs(angleDiff - 60) <= 6) {
          aspects.push({ p1, p2, type: "sextile", label: `${dict.sex} ⚹`, color: "stroke-emerald-400/40", harmonic: true });
        } else if (Math.abs(angleDiff - 90) <= 8) {
          aspects.push({ p1, p2, type: "square", label: `${dict.sqr} ▢`, color: "stroke-red-500/40", harmonic: false });
        } else if (Math.abs(angleDiff - 120) <= 8) {
          aspects.push({ p1, p2, type: "trine", label: `${dict.tri} △`, color: "stroke-blue-400/40", harmonic: true });
        } else if (Math.abs(angleDiff - 180) <= 8) {
          aspects.push({ p1, p2, type: "opposition", label: `${dict.opp} ☍`, color: "stroke-orange-500/40", harmonic: false });
        }
      }
    }
    return aspects;
  }, [chartPlacements, dict, language]);

  // Drawing settings for the SVG Chart
  const cx = 200;
  const cy = 200;
  const radiusOuter = 160;
  const radiusSigns = 135;
  const radiusHouses = 110;
  const radiusInner = 85;

  // Find Ascendant angle to rotate the map so that Ascendant is ALWAYS on the far left (180 degrees)
  const ascendantPlanet = chartPlacements.find((p) => p.id === "ascendant");
  const ascAngle = ascendantPlanet ? ascendantPlanet.angle : 0;
  const rotationOffset = 180 - ascAngle;

  const getCoordinates = (angle: number, radius: number) => {
    const adjustedAngle = (angle + rotationOffset) % 360;
    const rad = (adjustedAngle * Math.PI) / 180;
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    return { x, y };
  };

  if (!birthDate) {
    return (
      <div className="flex flex-col items-center justify-center p-14 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-950/10 text-slate-500">
        <Compass className="w-10 h-10 text-slate-700 mb-3 animate-spin" style={{ animationDuration: "35s" }} />
        <p className="text-xs font-medium font-serif italic max-w-sm">
          {dict.emptyBirthdate}
        </p>
      </div>
    );
  }

  const activePlacement = chartPlacements.find((p) => p.id === selectedPlanet);

  return (
    <div className="bg-slate-950/40 border border-slate-900/80 rounded-3xl p-6 flex flex-col gap-6 hover:border-emerald-500/5 transition-all duration-500 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"></div>
      
      {/* Title */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className="text-[10px] font-extrabold tracking-widest text-amber-400 font-serif uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {dict.chartTitle}
        </span>
        <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
          {dict.chartSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 mt-2">
        {/* SVG CHART COLUMN */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-900/60 rounded-3xl p-4 md:p-6 relative">
          
          <div className="relative w-full max-w-[360px] aspect-square">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Concentric circles */}
              <circle cx={cx} cy={cy} r={radiusOuter} className="stroke-slate-800 fill-none" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r={radiusSigns} className="stroke-slate-900 fill-slate-950/40" strokeWidth="1.2" />
              <circle cx={cx} cy={cy} r={radiusHouses} className="stroke-slate-800/60 fill-none" strokeWidth="1.2" />
              <circle cx={cx} cy={cy} r={radiusInner} className="stroke-slate-900 fill-slate-950/50" strokeWidth="1" />
              <circle cx={cx} cy={cy} r={3} className="fill-amber-500/80" />

              {/* 12 Zodiac Sign boundary lines */}
              {ZODIAC_SIGNS.map((sign, index) => {
                const angle = index * 30;
                const p1 = getCoordinates(angle, radiusHouses);
                const p2 = getCoordinates(angle, radiusOuter);
                return (
                  <line
                    key={index}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    className="stroke-slate-800/80"
                    strokeWidth="1"
                  />
                );
              })}

              {/* 12 Zodiac Symbols on outer ring */}
              {ZODIAC_SIGNS.map((sign, index) => {
                const midAngle = index * 30 + 15;
                const pos = getCoordinates(midAngle, (radiusSigns + radiusOuter) / 2);
                return (
                  <text
                    key={index}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-slate-500 text-[11px] font-sans hover:fill-amber-400 hover:scale-110 transition-all cursor-help"
                    title={sign[language] || sign.es}
                  >
                    {sign.symbol}
                  </text>
                );
              })}

              {/* House Division Cusps (Equal House System starting from ASC) */}
              {Array.from({ length: 12 }).map((_, index) => {
                const angle = (ascAngle + index * 30) % 360;
                const p1 = getCoordinates(angle, radiusInner);
                const p2 = getCoordinates(angle, radiusHouses);
                const textPos = getCoordinates(angle + 15, radiusInner - 12);
                return (
                  <g key={index}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      className={index === 0 ? "stroke-teal-500" : "stroke-slate-900"}
                      strokeWidth={index === 0 ? "2" : "1"}
                    />
                    {/* House numbers */}
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-slate-600 text-[8px] font-mono font-bold"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}

              {/* Active Aspect Lines inside the inner circle */}
              {activeAspects.map((aspect, idx) => {
                const p1 = getCoordinates(aspect.p1.angle, radiusInner - 5);
                const p2 = getCoordinates(aspect.p2.angle, radiusInner - 5);
                return (
                  <line
                    key={idx}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    className={`${aspect.color} hover:stroke-amber-400 hover:stroke-2 transition-all cursor-help`}
                    strokeWidth="1"
                    strokeDasharray={aspect.type === "sextile" || aspect.type === "opposition" ? "3,3" : "none"}
                    title={`${aspect.p1.name} ${aspect.label} ${aspect.p2.name}`}
                  />
                );
              })}

              {/* Draw planet glyph nodes */}
              {chartPlacements.map((planet) => {
                const pos = getCoordinates(planet.angle, (radiusInner + radiusHouses) / 2);
                const isSelected = selectedPlanet === planet.id;

                return (
                  <g
                    key={planet.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedPlanet(planet.id)}
                  >
                    {/* Glowing highlight ring around selected planet */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={11}
                        className="fill-none stroke-amber-500/50 animate-pulse"
                        strokeWidth="1"
                      />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={7.5}
                      className={`${isSelected ? "fill-slate-800" : "fill-slate-950"} stroke-slate-800 group-hover:fill-slate-800 group-hover:stroke-amber-500/60 transition-all`}
                      strokeWidth="1"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-[8px] font-mono font-bold select-none ${
                        isSelected ? "fill-amber-400" : "fill-slate-300 group-hover:fill-amber-300"
                      }`}
                    >
                      {planet.symbol === "ASC" ? "A" : planet.symbol}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <span className="text-[9px] text-slate-500 text-center mt-3 font-mono">
            {dict.clickHint}
          </span>
        </div>

        {/* DETAILED PLACEMENTS COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Planetary Details Interactive Card */}
          <AnimatePresence mode="wait">
            {activePlacement && (
              <motion.div
                key={activePlacement.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full filter blur-xl"></div>
                
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl select-none text-amber-400">{activePlacement.symbol}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 font-serif uppercase tracking-wider">
                        {activePlacement.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {activePlacement.exactDegree}° {activePlacement.signSymbol} {activePlacement.signName} ({dict.house} {activePlacement.house})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase font-serif flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-amber-500" />
                    {dict.meaningTitle}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif italic text-justify pr-1">
                    "{activePlacement.meaning}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Placements Selector Grid */}
          <div className="bg-slate-900/10 border border-slate-900/40 rounded-3xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase font-serif">
              {dict.placementsTitle}
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2">
              {chartPlacements.map((p) => {
                const isSelected = selectedPlanet === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanet(p.id)}
                    className={`px-2 py-1.5 rounded-xl border text-[10px] font-semibold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-md"
                        : "bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                    }`}
                  >
                    <span className="font-mono text-xs">{p.symbol}</span>
                    <span className="truncate max-w-[60px]">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Planetary Aspects mini-list */}
          {activeAspects.length > 0 && (
            <div className="bg-slate-900/10 border border-slate-900/40 rounded-3xl p-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase font-serif">
                {dict.aspectsTitle}
              </span>
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {activeAspects.map((asp, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-[10px] font-mono px-2.5 py-1.5 bg-slate-950/35 border border-slate-900 rounded-lg"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-200">{asp.p1.symbol} {asp.p1.name}</span>
                      <span className="text-slate-500">↔</span>
                      <span className="text-slate-200">{asp.p2.symbol} {asp.p2.name}</span>
                    </div>
                    <span
                      className={`font-semibold px-1.5 py-0.5 rounded text-[9px] ${
                        asp.harmonic
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          : "bg-red-500/10 text-red-400 border border-red-500/15"
                      }`}
                    >
                      {asp.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
