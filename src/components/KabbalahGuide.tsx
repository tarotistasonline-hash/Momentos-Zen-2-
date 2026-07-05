import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Layers, Sparkles, Compass } from "lucide-react";

interface KabbalahGuideProps {
  language: string;
}

export function KabbalahGuide({ language }: KabbalahGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSefirah, setSelectedSefirah] = useState<number | null>(null);

  // Content based on language
  const content: Record<string, {
    title: string;
    subtitle: string;
    intro: string;
    whatIsTitle: string;
    whatIsDesc: string;
    threePillarsTitle: string;
    threePillarsDesc: string;
    sefirotTitle: string;
    sefirotSubtitle: string;
    sefirotList: {
      name: string;
      hebrew: string;
      translation: string;
      meaning: string;
      emotionalForce: string;
      virtue: string;
      shadow: string;
    }[];
    clickToReveal: string;
    closeDetails: string;
  }> = {
    es: {
      title: "📖 Guía de Sabiduría Cabalística y las 10 Sefirot",
      subtitle: "Aprende el significado del Árbol de la Vida",
      intro: "La Cábala (Qabbalah) es una sabiduría mística ancestral que describe cómo la energía divina infinita (Ein Sof) desciende al mundo físico a través de 10 esferas llamadas Sefirot.",
      whatIsTitle: "¿Qué es el Árbol de la Vida?",
      whatIsDesc: "El Árbol de la Vida es el mapa cósmico de la Cábala. Representa tanto la estructura de la creación del universo como la psicología de nuestra propia alma. Cada una de las 10 Sefirot es un canal energético y un estado de conciencia que poseemos dentro. Aprender a equilibrarlos nos permite vivir con mayor propósito, paz y abundancia.",
      threePillarsTitle: "Los Tres Pilares de la Conciencia",
      threePillarsDesc: "El árbol se divide en tres columnas verticales: El Pilar de la Misericordia (derecho, fuerza activa/expansión), el Pilar de la Severidad (izquierdo, disciplina/límites), y el Pilar del Equilibrio (central, armonía y autoconsciencia pura).",
      sefirotTitle: "Las 10 Sefirot de tu Alma",
      sefirotSubtitle: "Haz clic en cualquier Sefirah para revelar sus secretos, virtudes y sombras:",
      clickToReveal: "Haz clic para explorar",
      closeDetails: "Ocultar detalles",
      sefirotList: [
        {
          name: "1. Kéter",
          hebrew: "כתר",
          translation: "La Corona",
          meaning: "La primera emanación. Representa la Voluntad Divina original, la chispa primordial de la existencia y el origen de toda idea. Es la fuente de la luz cósmica, el espacio de conexión con lo Infinito antes de tomar forma.",
          emotionalForce: "Fe ciega, supraconsciencia y deseo de existir.",
          virtue: "Humildad absoluta, rendición al flujo universal.",
          shadow: "Ego inflado, creerse el origen de la luz, o desconexión total del plano material."
        },
        {
          name: "2. Chokhmah",
          hebrew: "חכמה",
          translation: "La Sabiduría",
          meaning: "El destello de la genialidad, la intuición pura que llega de repente sin esfuerzo mental. Representa el principio masculino activo (energía seminal espiritual) que empuja a crear e iniciar.",
          emotionalForce: "Inspiración espontánea, asombro místico.",
          virtue: "Generosidad en compartir ideas creativas sin ego.",
          shadow: "Dispersión, genialidad destructiva, o ideas brillantes que nunca llegan a concretarse."
        },
        {
          name: "3. Binah",
          hebrew: "בינה",
          translation: "El Entendimiento",
          meaning: "El vientre espiritual o la gran madre cósmica. Toma el destello intuitivo de Chokhmah y lo estructura, le da forma, límites y lógica. Representa el entendimiento analítico y la gestación.",
          emotionalForce: "Alegría del entendimiento profundo, discernimiento.",
          virtue: "Silencio interior, meditación reflexiva y paciencia.",
          shadow: "Melancolía, rigidez mental excesiva, o culpa limitante."
        },
        {
          name: "4. Jésed",
          hebrew: "חסד",
          translation: "La Misericordia / Amor",
          meaning: "El amor incondicional, la compasión infinita y el deseo indomable de dar a los demás sin pedir nada a cambio. Es la fuerza expansiva del universo.",
          emotionalForce: "Amor puro, benevolencia, entusiasmo.",
          virtue: "Generosidad sin límites, empatía total.",
          shadow: "Dar en exceso dañando tu propia integridad, incapacidad de decir que no (sobre-tolerancia)."
        },
        {
          name: "5. Guevurah",
          hebrew: "גבורה",
          translation: "La Severidad / Disciplina",
          meaning: "La fuerza de los límites, la justicia rigurosa, la disciplina y la contracción. Es necesaria para canalizar el amor infinito de Jésed, dándole un cauce sano.",
          emotionalForce: "Temor reverencial al universo, asertividad.",
          virtue: "Valentía ante el miedo, discernimiento justo, rigor.",
          shadow: "Ira destructiva, perfeccionismo paralizante, crueldad o hipercrítica."
        },
        {
          name: "6. Tiféret",
          hebrew: "תפארת",
          translation: "La Belleza / Corazón",
          meaning: "El centro del Árbol de la Vida. Integra a Jésed (Amor) y Guevurah (Límites) en perfecta belleza, compasión equilibrada e identidad real. Es el centro del corazón (la conciencia del Yo Superior).",
          emotionalForce: "Compasión real (Tiferet), belleza del ser interior.",
          virtue: "Armonía, paz en el centro del pecho, autoconocimiento.",
          shadow: "Orgullo espiritual, egocentrismo, narcisismo."
        },
        {
          name: "7. Nétsaj",
          hebrew: "נצח",
          translation: "La Victoria / Eternidad",
          meaning: "La persistencia, el mundo de los sentimientos libres, el arte, la pasión y el impulso de ganar batallas a largo plazo. Es la fuerza emocional impulsora.",
          emotionalForce: "Pasión de vivir, persistencia emocional.",
          virtue: "Resistencia, constancia, pasión creativa y optimismo.",
          shadow: "Lujuria desmedida, obsesiones, o impulsividad ciega."
        },
        {
          name: "8. Hod",
          hebrew: "הוד",
          translation: "El Esplendor / Intelecto",
          meaning: "El intelecto analítico, la comunicación honesta, los rituales, la humildad y la verdad objetiva. Equilibra las emociones artísticas y salvajes de Nétsaj.",
          emotionalForce: "Sinceridad intelectual, reverencia estética.",
          virtue: "Humildad, veracidad, comunicación clara y lógica refinada.",
          shadow: "Falsedad, cinismo, manipulación mental, o sobreanálisis destructivo (parálisis por análisis)."
        },
        {
          name: "9. Yesod",
          hebrew: "יסוד",
          translation: "El Fundamento",
          meaning: "El gran canalizador y espejo psíquico. Conecta todas las fuerzas superiores de las Sefirot anteriores y las proyecta hacia el mundo material. Representa el inconsciente, los sueños y la sexualidad.",
          emotionalForce: "Paz mental profunda, vitalidad psíquica.",
          virtue: "Integridad, pureza de intención, autocontrol.",
          shadow: "Fantasías evasivas, adicciones, mentiras o dependencia emocional severa."
        },
        {
          name: "10. Maljut",
          hebrew: "מלכות",
          translation: "El Reino / Mundo Físico",
          meaning: "La manifestación real en la Tierra. Todo lo que pensamos y deseamos arriba se materializa y se convierte en realidad física aquí. Representa nuestro cuerpo físico, la conexión con la naturaleza y la acción real.",
          emotionalForce: "Estabilidad, realismo, conexión con la Madre Tierra.",
          virtue: "Capacidad de concretar proyectos (manifestación física).",
          shadow: "Materialismo ciego, pereza existencial, o desconexión de lo espiritual."
        }
      ]
    },
    en: {
      title: "📖 Kabbalistic Wisdom & The 10 Sefirot Guide",
      subtitle: "Learn the deep meaning behind the Tree of Life",
      intro: "Kabbalah (Qabbalah) is an ancient mystical wisdom describing how infinite divine energy (Ein Sof) flows down to manifest in the physical world through 10 spheres called Sefirot.",
      whatIsTitle: "What is the Tree of Life?",
      whatIsDesc: "The Tree of Life is the cosmic map of Kabbalah. It represents both the divine architecture of the universe and the inner psychology of our soul. Each of the 10 Sefirot is an energetic channel and state of consciousness within us. Learning to balance them brings profound purpose, peace, and abundance.",
      threePillarsTitle: "The Three Pillars of Consciousness",
      threePillarsDesc: "The Tree of Life is divided into three vertical columns: The Pillar of Mercy (Right, active energy and expansion), the Pillar of Severity (Left, discipline and healthy limits), and the Pillar of Balance (Center, harmony and pure self-awareness).",
      sefirotTitle: "The 10 Sefirot of your Soul",
      sefirotSubtitle: "Click on any Sefirah below to reveal its secrets, virtues, and spiritual challenges:",
      clickToReveal: "Click to explore",
      closeDetails: "Hide details",
      sefirotList: [
        {
          name: "1. Keter",
          hebrew: "כתר",
          translation: "The Crown",
          meaning: "The first emanation. Represents the ultimate Divine Will, the primary spark of existence and the origin of all ideas. It connects us directly to the infinite source of light.",
          emotionalForce: "Absolute faith, superconsciousness, the pure will to exist.",
          virtue: "Profound humility, letting go to the divine flow.",
          shadow: "Spiritual ego, delusions of grandeur, or total disconnection from earthly life."
        },
        {
          name: "2. Chokhmah",
          hebrew: "חכמה",
          translation: "Wisdom",
          meaning: "The flash of genius, pure intuition that lands instantly before the mind analyzes it. It represents the active masculine principle (spiritual seed) driving creation.",
          emotionalForce: "Spontaneous inspiration, mystical awe.",
          virtue: "Selfless sharing of ideas without seeking credit.",
          shadow: "Lack of focus, mental dispersion, brilliant ideas that never get executed."
        },
        {
          name: "3. Binah",
          hebrew: "בינה",
          translation: "Understanding",
          meaning: "The cosmic motherly womb. Takes the intuitive spark from Chokhmah and gives it structure, limitations, and logical shape. It represents analytical reasoning.",
          emotionalForce: "Joy of deep understanding, holy discernment.",
          virtue: "Inner silence, patience, reflective meditation.",
          shadow: "Melancholy, rigid thinking, limiting guilt."
        },
        {
          name: "4. Chesed",
          hebrew: "חסד",
          translation: "Mercy / Lovingkindness",
          meaning: "Unconditional love, boundless compassion, and the wild desire to give and expand. It is the raw force of cosmic expansion.",
          emotionalForce: "Pure love, kindness, benevolent enthusiasm.",
          virtue: "Boundless generosity, absolute empathy.",
          shadow: "Giving to others at the expense of your own boundaries, over-tolerance."
        },
        {
          name: "5. Gevurah",
          hebrew: "גבורה",
          translation: "Severity / Strength",
          meaning: "The force of boundaries, strict justice, self-discipline, and contraction. Necessary to channel the boundless waters of Chesed into a healthy river.",
          emotionalForce: "Awe of the cosmos, assertiveness, boundaries.",
          virtue: "Courage in the face of fear, righteous discernment, clean rigor.",
          shadow: "Destructive anger, paralyzing perfectionism, harshness."
        },
        {
          name: "6. Tiferet",
          hebrew: "תפארת",
          translation: "Beauty / Heart",
          meaning: "The radiant center of the Tree. Integrates Chesed (Love) and Gevurah (Boundaries) into perfect beauty, compassion, and true identity. It's the Higher Self.",
          emotionalForce: "True empathy, inner balance and peace.",
          virtue: "Harmony, spiritual alignment, deep self-knowledge.",
          shadow: "Spiritual vanity, egocentrism, narcissism."
        },
        {
          name: "7. Netzach",
          hebrew: "נצח",
          translation: "Victory / Endurance",
          meaning: "Persistence, free emotions, artistic passions, and the long-term drive to overcome obstacles. The engine of emotional desire.",
          emotionalForce: "Passion for life, emotional endurance.",
          virtue: "Consistency, creative drive, healthy optimism.",
          shadow: "Lust, obsession, blind emotional impulses."
        },
        {
          name: "8. Hod",
          hebrew: "הוד",
          translation: "Splendor / Intellect",
          meaning: "The logical intellect, truthful communication, ritual, and sincerity. It balances the wild emotional fires of Netzach with quiet truth.",
          emotionalForce: "Intellectual honesty, aesthetic appreciation.",
          virtue: "Humility, truthfulness, clear and logical communication.",
          shadow: "Deceit, cynicism, manipulative intelligence, paralysis by analysis."
        },
        {
          name: "9. Yesod",
          hebrew: "יסוד",
          translation: "The Foundation",
          meaning: "The master projector and psychic mirror. It gathers the energies of all upper Sefirot and channels them down to manifest. Represents the subconscious and dreams.",
          emotionalForce: "Deep mental peace, psychic vitality.",
          virtue: "Integrity, pure intentions, emotional self-mastery.",
          shadow: "Escapism, addictive behavior, deceit, heavy codependency."
        },
        {
          name: "10. Malkuth",
          hebrew: "מלכות",
          translation: "The Kingdom / Physical World",
          meaning: "The ultimate physical manifestation. The material world where our thoughts and spiritual works solidify into reality. Represents the physical body and grounding.",
          emotionalForce: "Stability, pragmatism, connection to Mother Earth.",
          virtue: "The ability to manifest goals in the real physical plane.",
          shadow: "Blind materialism, spiritual laziness, or floating without earthly anchors."
        }
      ]
    },
    pt: {
      title: "📖 Guia de Sabedoria Cabalística e as 10 Sefirot",
      subtitle: "Aprenda o significado da Árvore da Vida",
      intro: "A Cabala (Qabbalah) é uma sabedoria mística ancestral que descreve como a energia divina infinita (Ein Sof) desce ao mundo físico através de 10 esferas chamadas Sefirot.",
      whatIsTitle: "O que é a Árvore da Vida?",
      whatIsDesc: "A Árvore da Vida é o mapa cósmico da Cabala. Representa tanto a estrutura do universo quanto a psicologia de nossa alma. Cada uma das 10 Sefirot é um canal energético e um estado de consciência. Equilibrá-los nos permite viver com maior propósito, paz e prosperidade.",
      threePillarsTitle: "Os Três Pilares da Consciência",
      threePillarsDesc: "A Árvore é dividida em três colunas verticais: O Pilar da Misericórdia (Direito, força de expansão), o Pilar da Severidade (Esquerdo, limites e disciplina), e o Pilar do Equilíbrio (Central, harmonia e autoconsciência pura).",
      sefirotTitle: "As 10 Sefirot da sua Alma",
      sefirotSubtitle: "Clique em qualquer Sefirah para revelar seus segredos, virtudes e desafios espirituais:",
      clickToReveal: "Clique para explorar",
      closeDetails: "Ocultar detalhes",
      sefirotList: [
        {
          name: "1. Keter",
          hebrew: "כתר",
          translation: "A Coroa",
          meaning: "A primeira emanação. Representa a Vontade Divina pura, a centelha original de existência e a fonte de toda a luz divina.",
          emotionalForce: "Fé cega, desejo supremo de existir.",
          virtue: "Humildade absoluta, entrega ao fluxo universal.",
          shadow: "Ego inflado, desconexão total do plano terrestre."
        },
        {
          name: "2. Chokhmah",
          hebrew: "חכמה",
          translation: "A Sabedoria",
          meaning: "O lampejo intuitivo espontâneo que surge antes da análise intelectual. Princípio masculino ativo de pura inspiração.",
          emotionalForce: "Inspiração espontânea, assombro místico.",
          virtue: "Generosidade em compartilhar sabedoria sem buscar crédito.",
          shadow: "Dispersão, genialidade destrutiva, ideias que nunca se realizam."
        },
        {
          name: "3. Binah",
          hebrew: "בינה",
          translation: "O Entendimento",
          meaning: "O útero cósmico que dá forma e estrutura ao lampejo criativo de Chokhmah. Representa a inteligência analítica.",
          emotionalForce: "Alegria do entendimento profundo.",
          virtue: "Silêncio interior, paciência, meditação reflexiva.",
          shadow: "Melancolia, rigidez mental ou culpa limitadora."
        },
        {
          name: "4. Chesed",
          hebrew: "חסד",
          translation: "A Misericórdia",
          meaning: "Amor incondicional, compaixão sem limites e desejo imparável de dar sem cobrar nada em troca. Força de expansão cósmica.",
          emotionalForce: "Amor generoso, compaixão ardente.",
          virtue: "Generosidade divina, empatia completa.",
          shadow: "Doação excessiva que desgasta o próprio ser, incapacidade de impor limites."
        },
        {
          name: "5. Gevurah",
          hebrew: "גבורה",
          translation: "A Severidade",
          meaning: "O rigor, os limites necessários, a autodisciplina e a justiça. Ajuda a canalizar o amor sem limites de Chesed de forma construtiva.",
          emotionalForce: "Respeito reverencial pelas leis da vida.",
          virtue: "Valentia real, limites claros e justos, autodisciplina.",
          shadow: "Ira destrutiva, perfeccionismo que paralisa, crueldade."
        },
        {
          name: "6. Tiferet",
          hebrew: "תפארת",
          translation: "A Beleza",
          meaning: "O coração da Árvore. Integra amor (Chesed) e disciplina (Gevurah) em harmonia perfeita e compaixão real. Representa o Eu Superior.",
          emotionalForce: "Compaixão pura e beleza do caráter.",
          virtue: "Equilíbrio, paz no peito e autoconhecimento.",
          shadow: "Orgulho espiritual, egocentrismo excessivo."
        },
        {
          name: "7. Netzach",
          hebrew: "נצח",
          translation: "A Vitória",
          meaning: "O mundo das emoções artísticas, sentimentos profundos e paixão de vencer batalhas a longo prazo. O motor do desejo.",
          emotionalForce: "Paixão de viver, persistência indomável.",
          virtue: "Constância, determinação amorosa, otimismo ativo.",
          shadow: "Obsessões emocionais, luxúria ou impulsividade desmedida."
        },
        {
          name: "8. Hod",
          hebrew: "הוד",
          translation: "O Esplendor",
          meaning: "O intelecto lógico, a verdade sincera, rituais sagrados e integridade. Traz pés no chão e sinceridade de comunicação.",
          emotionalForce: "Sinceridade de mente, reverência espiritual.",
          virtue: "Humildade intelectual, clareza verbal, veracidade.",
          shadow: "Manipulação intelectual, cinismo, parálise por análise excessiva."
        },
        {
          name: "9. Yesod",
          hebrew: "יסוד",
          translation: "O Fundamento",
          meaning: "O espelho do subconsciente e sonhos. Reúne e canaliza todas as energias das esferas superiores para projetá-las na matéria.",
          emotionalForce: "Vitalidade psíquica, tranquilidade mental.",
          virtue: "Integridade de intenção, pureza espiritual, autodomínio.",
          shadow: "Fuga da realidade através de fantasias ou vícios, codependência."
        },
        {
          name: "10. Malkuth",
          hebrew: "מלכות",
          translation: "O Reino",
          meaning: "A manifestação tangível na Terra. Onde as ideias e o trabalho espiritual se tornam objetos e ações reais. Conexão física.",
          emotionalForce: "Estabilidade, pragmatismo, conexão física profunda.",
          virtue: "Capacidade de concretizar planos e sonhos no plano material.",
          shadow: "Materialismo cego, preguiça ou desconexão do reino espiritual."
        }
      ]
    }
  };

  const t = content[language] || content["es"];

  return (
    <div className="w-full bg-slate-900/30 border border-slate-900/60 rounded-3xl overflow-hidden mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-900/50 transition-all text-left"
        id="btn-guia-kabbalah"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-serif font-bold text-slate-100 block">{t.title}</span>
            <span className="text-xs text-slate-400 block mt-0.5">{t.subtitle}</span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-slate-900/60"
          >
            <div className="p-5 flex flex-col gap-6 text-xs text-slate-300 leading-relaxed bg-slate-950/20">
              <p className="italic text-slate-300 border-l-2 border-amber-500/40 pl-3.5">
                "{t.intro}"
              </p>

              {/* What is it */}
              <div className="flex flex-col gap-2">
                <h4 className="font-serif font-bold text-slate-100 text-sm flex items-center gap-1.5 text-amber-400">
                  ✡️ {t.whatIsTitle}
                </h4>
                <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">{t.whatIsDesc}</p>
              </div>

              {/* Three Pillars */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex flex-col gap-2">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> {t.threePillarsTitle}
                </h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">{t.threePillarsDesc}</p>
              </div>

              {/* Interactive Sefirot Explorer */}
              <div className="flex flex-col gap-3">
                <h4 className="font-serif font-bold text-slate-100 text-sm flex items-center gap-1.5 text-amber-400">
                  <Compass className="w-4 h-4" /> {t.sefirotTitle}
                </h4>
                <p className="text-slate-400 text-[11px] -mt-1">{t.sefirotSubtitle}</p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  {t.sefirotList.map((sef, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSefirah(selectedSefirah === idx ? null : idx)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all duration-300 ${
                        selectedSefirah === idx
                          ? "bg-amber-500/10 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                          : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                      }`}
                      id={`btn-sefirah-${idx}`}
                    >
                      <span className="text-[9px] font-mono tracking-widest text-amber-500/60 uppercase">{sef.hebrew}</span>
                      <span className="font-bold text-[11px] leading-tight block">{sef.name}</span>
                      <span className="text-[9px] text-slate-400 leading-none">{sef.translation}</span>
                    </button>
                  ))}
                </div>

                {/* Sefirah Details Card */}
                <AnimatePresence mode="wait">
                  {selectedSefirah !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-slate-950/80 border border-amber-500/25 rounded-2xl flex flex-col gap-3 mt-2 shadow-2xl relative overflow-hidden"
                    >
                      {/* Decorative Hebrew background */}
                      <div className="absolute right-4 bottom-1 text-8xl font-serif text-amber-500/5 select-none pointer-events-none">
                        {t.sefirotList[selectedSefirah].hebrew}
                      </div>

                      <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                        <div>
                          <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase font-mono">SEFIRAH {selectedSefirah + 1}</span>
                          <h3 className="text-sm font-serif font-black text-slate-100 flex items-center gap-1.5 mt-0.5">
                            {t.sefirotList[selectedSefirah].name} ({t.sefirotList[selectedSefirah].hebrew})
                          </h3>
                        </div>
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-serif italic">
                          {t.sefirotList[selectedSefirah].translation}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 text-[11px] sm:text-xs">
                        <p className="text-slate-300 leading-relaxed font-medium">
                          {t.sefirotList[selectedSefirah].meaning}
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                          <strong className="text-amber-400 font-medium">Fuerza Psíquica:</strong> {t.sefirotList[selectedSefirah].emotionalForce}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 pt-2 border-t border-slate-900/40">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 tracking-wider block">💎 VIRTUD INTEGRADA</span>
                            <span className="text-[10px] text-slate-300 block mt-0.5">{t.sefirotList[selectedSefirah].virtue}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-red-400 tracking-wider block">⚠️ DISTORSIÓN / SOMBRA</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{t.sefirotList[selectedSefirah].shadow}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedSefirah(null)}
                        className="text-[10px] text-amber-500 hover:text-amber-400 font-bold mt-1 text-right w-full"
                      >
                        {t.closeDetails}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sparkles footer decoration */}
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-amber-500/50 pt-2 border-t border-slate-900/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>La Cábala busca traer el cielo a la tierra (Hacer que Kéter se manifieste en Maljut)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
