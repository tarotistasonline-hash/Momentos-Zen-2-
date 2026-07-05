import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, ChevronUp, Clock, Brain, Activity, Sparkles } from "lucide-react";

interface BoxBreathingGuideProps {
  language: string;
}

export function BoxBreathingGuide({ language }: BoxBreathingGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Content based on language
  const content: Record<string, {
    title: string;
    subtitle: string;
    intro: string;
    whatIsTitle: string;
    whatIsDesc: string;
    phasesTitle: string;
    phases: { name: string; duration: string; desc: string; icon: string }[];
    benefitsTitle: string;
    benefits: { title: string; desc: string; icon: React.ReactNode }[];
    howToTitle: string;
    howToDesc: string;
  }> = {
    es: {
      title: "📖 Guía de Respiración Cuadrada (Pranayama)",
      subtitle: "¿Qué es y cómo te ayuda?",
      intro: "La respiración cuadrada (Sama Vritti) es una poderosa técnica milenaria para regular el sistema nervioso de inmediato.",
      whatIsTitle: "¿Por qué se llama 'Cuadrada'?",
      whatIsDesc: "Se llama así porque consta de 4 fases de igual duración (4 segundos cada una), formando un ciclo perfecto y equilibrado como un cuadrado. Es la técnica oficial que utilizan los deportistas de alto rendimiento, meditadores zen y hasta los Navy SEALs para calmar el estrés en segundos.",
      phasesTitle: "Las 4 Fases del Ciclo",
      phases: [
        { name: "1. Inhalación", duration: "4 Segundos", desc: "Toma aire lentamente por la nariz llenando el abdomen.", icon: "🌬️" },
        { name: "2. Retención en Lleno", duration: "4 Segundos", desc: "Mantén el aire suavemente en tus pulmones sin tensar el cuello.", icon: "🎈" },
        { name: "3. Exhalación", duration: "4 Segundos", desc: "Suelta todo el aire por la boca de manera constante y suave.", icon: "💨" },
        { name: "4. Retención en Vacío", duration: "4 Segundos", desc: "Quédate sin aire antes de la siguiente inhalación. Aquí se resetea la mente.", icon: "🍃" }
      ],
      benefitsTitle: "Beneficios Científicos",
      benefits: [
        { title: "Reduce la Ansiedad", desc: "Estimula el nervio vago bajando el ritmo cardíaco y los niveles de cortisol.", icon: <Brain className="w-4 h-4 text-emerald-400" /> },
        { title: "Enfoque Mental", desc: "Oxigena la corteza prefrontal del cerebro, mejorando la toma de decisiones.", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
        { title: "Equilibrio Emocional", desc: "Corta el ciclo de 'lucha o huida' del cuerpo, trayéndote al presente.", icon: <Activity className="w-4 h-4 text-emerald-400" /> }
      ],
      howToTitle: "Cómo empezar tu práctica:",
      howToDesc: "Simplemente pulsa 'Comenzar' arriba. El círculo central te guiará visualmente expandiéndose y contrayéndose. Sigue las instrucciones escritas o activa el 'Guía de Voz' para meditar con los ojos cerrados."
    },
    en: {
      title: "📖 Box Breathing Guide (Pranayama)",
      subtitle: "What is it and how does it help?",
      intro: "Box breathing (Sama Vritti) is a powerful, time-tested technique to regulate the nervous system instantly.",
      whatIsTitle: "Why is it called 'Box' Breathing?",
      whatIsDesc: "It's called 'box' or 'square' breathing because it has 4 phases of equal duration (4 seconds each), forming a perfectly balanced loop like a square. It is the official technique used by elite athletes, Zen meditators, and Navy SEALs to clear stress in seconds.",
      phasesTitle: "The 4 Phases of the Loop",
      phases: [
        { name: "1. Inhale", duration: "4 Seconds", desc: "Slowly breathe in through your nose, expanding your abdomen.", icon: "🌬️" },
        { name: "2. Hold Full", duration: "4 Seconds", desc: "Hold your breath gently in your lungs without tensing your neck.", icon: "🎈" },
        { name: "3. Exhale", duration: "4 Seconds", desc: "Smoothly and slowly release all the air through your mouth.", icon: "💨" },
        { name: "4. Hold Empty", duration: "4 Seconds", desc: "Remain empty of air before the next inhale. This is where the mind resets.", icon: "🍃" }
      ],
      benefitsTitle: "Scientific Benefits",
      benefits: [
        { title: "Reduces Anxiety", desc: "Stimulates the vagus nerve, lowering heart rate and cortisol levels.", icon: <Brain className="w-4 h-4 text-emerald-400" /> },
        { title: "Sharpens Focus", desc: "Oxygenates the prefrontal cortex, enhancing clarity and decisions.", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
        { title: "Emotional Balance", desc: "Stops the fight-or-flight stress response, anchoring you to the present.", icon: <Activity className="w-4 h-4 text-emerald-400" /> }
      ],
      howToTitle: "How to practice:",
      howToDesc: "Just press 'Start Breathing' above. The central circle will guide you by expanding and contracting. Follow the text instructions or toggle 'Voice Guide' to meditate with your eyes closed."
    },
    pt: {
      title: "📖 Guia de Respiração Quadrada (Pranayama)",
      subtitle: "O que é e como ajuda você?",
      intro: "A respiração quadrada (Sama Vritti) é uma técnica milenar poderosa para regular o sistema nervoso imediatamente.",
      whatIsTitle: "Por que se chama 'Quadrada'?",
      whatIsDesc: "É chamada assim porque consiste em 4 fases de igual duração (4 segundos cada), formando um ciclo perfeitamente equilibrado como um quadrado. É a técnica oficial utilizada por atletas de elite, meditadores zen e até Navy SEALs para acalmar o estresse.",
      phasesTitle: "As 4 Fases do Ciclo",
      phases: [
        { name: "1. Inalação", duration: "4 Segundos", desc: "Puxe o ar lentamente pelo nariz, preenchendo o abdômen.", icon: "🌬️" },
        { name: "2. Retenção Cheia", duration: "4 Segundos", desc: "Segure o ar suavemente nos pulmões sem tensionar o pescoço.", icon: "🎈" },
        { name: "3. Exalação", duration: "4 Segundos", desc: "Solte todo o ar pela boca de forma constante e suave.", icon: "💨" },
        { name: "4. Retenção Vazia", duration: "4 Segundos", desc: "Fique sem ar antes da próxima inalação. É onde a mente se reinicia.", icon: "🍃" }
      ],
      benefitsTitle: "Benefícios Científicos",
      benefits: [
        { title: "Reduz a Ansiedade", desc: "Estimula o nervo vago, reduzindo os batimentos cardíacos e o cortisol.", icon: <Brain className="w-4 h-4 text-emerald-400" /> },
        { title: "Foco e Clareza", desc: "Oxigena o córtex pré-frontal, melhorando a tomada de decisões.", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
        { title: "Equilíbrio Emocional", desc: "Interrompe a resposta de luta ou fuga, trazendo você ao presente.", icon: <Activity className="w-4 h-4 text-emerald-400" /> }
      ],
      howToTitle: "Como começar:",
      howToDesc: "Basta clicar em 'Começar' acima. O círculo central guiará você expandindo e contraindo. Siga as instruções escritas ou ative o 'Guia de Voz' para meditar de olhos fechados."
    },
    de: {
      title: "📖 Box-Breathing-Anleitung (Pranayama)",
      subtitle: "Was ist das und wie hilft es Ihnen?",
      intro: "Die Box-Atmung (Sama Vritti) ist eine bewährte, kraftvolle Methode, um das Nervensystem sofort zu regulieren.",
      whatIsTitle: "Warum heißt es 'quadratische' Atmung?",
      whatIsDesc: "Sie wird so genannt, weil sie aus 4 gleich langen Phasen besteht (jeweils 4 Sekunden), die einen perfekten Kreislauf bilden. Es ist die offizielle Technik, die von Hochleistungssportlern, Zen-Meditierenden und Navy SEALs angewendet wird, um Stress in Sekunden abzubauen.",
      phasesTitle: "Die 4 Phasen des Kreislaufs",
      phases: [
        { name: "1. Einatmen", duration: "4 Sekunden", desc: "Atme langsam durch die Nase ein und fülle deinen Bauch.", icon: "🌬️" },
        { name: "2. Atem anhalten (voll)", duration: "4 Sekunden", desc: "Halte den Atem sanft in deiner Lunge, ohne den Nacken anzuspannen.", icon: "🎈" },
        { name: "3. Ausatmen", duration: "4 Sekunden", desc: "Atme langsam und gleichmäßig durch den Mund aus.", icon: "💨" },
        { name: "4. Atem anhalten (leer)", duration: "4 Sekunden", desc: "Bleibe ohne Luft vor dem nächsten Einatmen. Hier kommt der Geist zur Ruhe.", icon: "🍃" }
      ],
      benefitsTitle: "Wissenschaftliche Vorteile",
      benefits: [
        { title: "Reduziert Angst", desc: "Stimuliert den Vagusnerv, senkt die Herzfrequenz und den Cortisolspiegel.", icon: <Brain className="w-4 h-4 text-emerald-400" /> },
        { title: "Geistige Klarheit", desc: "Versorgt den präfrontalen Kortex mit Sauerstoff, verbessert Entscheidungen.", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
        { title: "Emotionales Gleichgewicht", desc: "Stoppt den Stresskreislauf des Körpers und bringt Sie ins Hier und Jetzt.", icon: <Activity className="w-4 h-4 text-emerald-400" /> }
      ],
      howToTitle: "Wie man beginnt:",
      howToDesc: "Drücken Sie einfach oben auf 'Atmen beginnen'. Der mittlere Kreis führt Sie visuell durch das Ausdehnen und Zusammenziehen. Folgen Sie den Anweisungen oder aktivieren Sie die 'Sprachführung'."
    }
  };

  const t = content[language] || content["es"];

  return (
    <div className="w-full bg-slate-900/30 border border-slate-900/60 rounded-2xl overflow-hidden mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-900/50 transition-all text-left"
        id="btn-guia-respiracion"
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-xs font-bold text-slate-200 block">{t.title}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{t.subtitle}</span>
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
            <div className="p-4 flex flex-col gap-5 text-xs text-slate-300 leading-relaxed bg-slate-950/20">
              <p className="italic text-slate-300 border-l-2 border-emerald-500/40 pl-3">
                "{t.intro}"
              </p>

              {/* What is it section */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs mb-1 flex items-center gap-1.5">
                  🔳 {t.whatIsTitle}
                </h4>
                <p className="text-slate-400 text-[11px] leading-normal">{t.whatIsDesc}</p>
              </div>

              {/* The 4 phases */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> {t.phasesTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.phases.map((phase, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex items-start gap-2.5 hover:border-emerald-500/20 transition-all">
                      <span className="text-xl select-none shrink-0 mt-0.5">{phase.icon}</span>
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-bold text-slate-200 text-[11px]">{phase.name}</span>
                          <span className="text-[9px] text-emerald-400 font-mono tracking-wider">{phase.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific benefits */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> {t.benefitsTitle}
                </h4>
                <div className="flex flex-col gap-2">
                  {t.benefits.map((benefit, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0 mt-0.5">
                        {benefit.icon}
                      </div>
                      <div>
                        <span className="font-bold text-slate-300 text-[11px] block">{benefit.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{benefit.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to practice */}
              <div className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {t.howToTitle}
                </span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  {t.howToDesc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
