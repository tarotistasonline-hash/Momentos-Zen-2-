import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

dotenv.config();

const __dirname = (() => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return process.cwd();
  }
})();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Variables to manage Gemini API availability state (Circuit Breaker)
let geminiDisabledUntil = 0;
let geminiDisabledReason = "";

// Helper for sending user-friendly errors
const handleGeminiError = (res: any, error: any, message: string) => {
  console.error("Gemini API Error:", error);
  res.status(500).json({
    error: true,
    message: `${message}. Por favor, asegúrate de que tu GEMINI_API_KEY esté correctamente configurada en la sección Secrets.`,
    details: error.message || error,
  });
};

// Helper to call Gemini with retries and model fallback
async function generateContentWithRetry(params: {
  contents: any;
  config?: any;
}) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  if (Date.now() < geminiDisabledUntil) {
    console.warn(`[Gemini API Circuit Breaker] Bypassing Gemini: Service is temporarily suspended due to previous non-transient error: ${geminiDisabledReason}`);
    throw new Error(`Gemini suspended: ${geminiDisabledReason}`);
  }

  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview"
  ];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let delay = 1000;
    let shouldTryNextModel = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`[Gemini API] Attempting generateContent with model: ${modelName}, attempt: ${attempt + 1}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        
        const status = err.status || (err.error && err.error.code);
        const errStr = String(err.message || err || "").toLowerCase();
        
        // Detect non-transient errors (Quota limit 429, Invalid API key 403, etc.)
        const isQuotaExceeded = status === 429 || errStr.includes("quota") || errStr.includes("rate limit") || errStr.includes("exceeded");
        const isAuthError = status === 403 || errStr.includes("api key") || errStr.includes("unauthorized") || errStr.includes("invalid key");
        const isUnavailable = status === 503 || status === 502 || status === 504 || errStr.includes("unavailable") || errStr.includes("high demand") || errStr.includes("overloaded") || errStr.includes("capacity");
        
        if (isQuotaExceeded) {
          console.warn(`[Gemini API] Quota exceeded (429) detected on ${modelName}. Trying next model in list...`);
          shouldTryNextModel = true;
          break; // Stop retrying current model, move to next model
        }

        if (isUnavailable) {
          console.warn(`[Gemini API] Model ${modelName} is unavailable or overloaded (503/504). Instantly trying next model...`);
          shouldTryNextModel = true;
          break; // Stop retrying current model, move to next model immediately
        }
        
        if (isAuthError) {
          geminiDisabledUntil = Date.now() + 300000; // Disable Gemini for 5 minutes
          geminiDisabledReason = "Authentication/API Key Failure";
          console.warn(`[Gemini API] Auth/API Key error detected. Activating Offline Spiritual Mode circuit breaker for 5 minutes.`);
          throw err; // Stop retrying immediately
        }

        console.warn(`[Gemini API] Attempt ${attempt + 1} with model ${modelName} failed:`, err.message || err);
        
        if (status === 400) {
          // If bad request (e.g. invalid config/schema for that model), don't retry, try next model
          shouldTryNextModel = true;
          break;
        }

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        }
      }
    }
    if (!shouldTryNextModel && lastError && lastError.status !== 429) {
      // If we failed with some non-quota, non-bad-request error, let's keep trying other models
    }
  }

  if (lastError) {
    const status = lastError.status || (lastError.error && lastError.error.code);
    const errStr = String(lastError.message || lastError || "").toLowerCase();
    const isQuotaExceeded = status === 429 || errStr.includes("quota") || errStr.includes("rate limit") || errStr.includes("exceeded");
    if (isQuotaExceeded) {
      geminiDisabledUntil = Date.now() + 180000; // Disable Gemini for 3 minutes to stay responsive
      geminiDisabledReason = "Quota Exceeded on all models (429)";
      console.warn(`[Gemini API] Quota exceeded (429) detected across all tried models. Activating Offline Spiritual Mode circuit breaker for 3 minutes.`);
    }
  }

  throw lastError;
}

// 1. Tarot Deck definition & Drawer
const TAROT_DECK = [
  "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador", "El Hierofante", "Los Enamorados", "El Carro",
  "La Fuerza", "El Ermitaño", "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte", "La Templanza",
  "El Diablo", "La Torre", "La Estrella", "La Luna", "El Sol", "El Juicio", "El Mundo",
  "As de Copas", "Dos de Copas", "Tres de Copas", "Cuatro de Copas", "Cinco de Copas", "Seis de Copas", "Siete de Copas", "Ocho de Copas", "Nueve de Copas", "Diez de Copas", "Sota de Copas", "Caballero de Copas", "Reina de Copas", "Rey de Copas",
  "As de Oros", "Dos de Oros", "Tres de Oros", "Cuatro de Oros", "Cinco de Oros", "Seis de Oros", "Siete de Oros", "Ocho de Oros", "Nueve de Oros", "Diez de Oros", "Sota de Oros", "Caballero de Oros", "Reina de Oros", "Rey de Oros",
  "As de Espadas", "Dos de Espadas", "Tres de Espadas", "Cuatro de Espadas", "Cinco de Espadas", "Seis de Espadas", "Siete de Espadas", "Ocho de Espadas", "Nueve de Espadas", "Diez de Espadas", "Sota de Espadas", "Caballero de Espadas", "Reina de Espadas", "Rey de Espadas",
  "As de Bastos", "Dos de Bastos", "Tres de Bastos", "Cuatro de Bastos", "Cinco de Bastos", "Seis de Bastos", "Siete de Bastos", "Ocho de Bastos", "Nueve de Bastos", "Diez de Bastos", "Sota de Bastos", "Caballero de Bastos", "Reina de Bastos", "Rey de Bastos"
];

const drawTarot = (count: number) => {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    name: card,
    isReversed: Math.random() > 0.72 // 28% chance of being reversed
  }));
};

// 2. Norse Runes definition & Drawer
const RUNES_DECK = [
  { name: "Fehu", symbol: "ᚠ", meaning: "Riqueza, Abundancia, Nuevos comienzos" },
  { name: "Uruz", symbol: "ᚢ", meaning: "Fuerza, Vitalidad, Salud, Coraje" },
  { name: "Thurisaz", symbol: "ᚦ", meaning: "Fuerza defensiva, Conflictos, Catalizador" },
  { name: "Ansuz", symbol: "ᚨ", meaning: "Sabiduría, Comunicación, Mensajes divinos" },
  { name: "Raidho", symbol: "ᚱ", meaning: "Viaje, Evolución, Ritmo de vida" },
  { name: "Kenaz", symbol: "ᚲ", meaning: "Fuego, Antorcha, Claridad, Inspiración" },
  { name: "Gebo", symbol: "ᚷ", meaning: "Regalo, Alianzas, Equilibrio, Unión" },
  { name: "Wunjo", symbol: "ᚹ", meaning: "Alegría, Armonía, Gloria, Confort" },
  { name: "Hagalaz", symbol: "ᚺ", meaning: "Granizo, Fuerzas destructivas o de cambio" },
  { name: "Nauthiz", symbol: "ᚾ", meaning: "Necesidad, Resistencia, Paciencia, Superación" },
  { name: "Isa", symbol: "ᛁ", meaning: "Hielo, Pausa, Concentración, Reflexión" },
  { name: "Jera", symbol: "ᛃ", meaning: "Cosecha, Ciclos, Recompensa al esfuerzo" },
  { name: "Eihwaz", symbol: "ᛇ", meaning: "Tejo, Fuerza, Resistencia, Árbol cósmico" },
  { name: "Perthro", symbol: "ᛈ", meaning: "Misterio, Destino, Azar, Revelación" },
  { name: "Algiz", symbol: "ᛉ", meaning: "Protección, Guía espiritual, Alerta" },
  { name: "Sowilo", symbol: "ᛊ", meaning: "Sol, Victoria, Claridad, Éxito rotundo" },
  { name: "Tiwaz", symbol: "ᛏ", meaning: "Victoria, Sacrificio, Justicia, Honor" },
  { name: "Berkano", symbol: "ᛒ", meaning: "Renacimiento, Crecimiento, Maternidad, Fertilidad" },
  { name: "Ehwaz", symbol: "ᛖ", meaning: "Caballo, Progreso, Viajes, Trabajo en equipo" },
  { name: "Mannaz", symbol: "ᛗ", meaning: "Humanidad, Autoconocimiento, Comunidad" },
  { name: "Laguz", symbol: "ᛚ", meaning: "Agua, Intuición, Fluidez, Emociones" },
  { name: "Ingwaz", symbol: "ᛜ", meaning: "Semilla, Energía creadora, Reposo protector" },
  { name: "Dagaz", symbol: "ᛞ", meaning: "Amanecer, Transformación, Despertar de conciencia" },
  { name: "Othala", symbol: "ᛟ", meaning: "Herencia, Patria, Familia, Hogar, Legado" }
];

const drawRunes = (count: number) => {
  const shuffled = [...RUNES_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(rune => ({
    ...rune,
    isReversed: Math.random() > 0.75 // Runes can also be inverted
  }));
};

// 3. Astronomical Moon Phase Calculator
const getMoonPhase = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simple astronomical approximation for moon phase
  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    const adjustedYear = year - 1;
    const adjustedMonth = month + 12;
    // Calculation
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

  const daysSinceNew = jd - 2451543.5; // New moon reference (Jan 6, 2000)
  const newMoons = daysSinceNew / 29.53058867;
  const phaseCycle = (newMoons - Math.floor(newMoons)) * 29.53058867;

  let phaseName = "";
  let icon = "";
  if (phaseCycle < 1.845) {
    phaseName = "Luna Nueva";
    icon = "🌑";
  } else if (phaseCycle < 5.5369) {
    phaseName = "Luna Creciente Cóncava (Waxing Crescent)";
    icon = "🌒";
  } else if (phaseCycle < 9.2288) {
    phaseName = "Cuarto Creciente";
    icon = "🌓";
  } else if (phaseCycle < 12.920) {
    phaseName = "Luna Creciente Giba (Waxing Gibbous)";
    icon = "🌔";
  } else if (phaseCycle < 16.611) {
    phaseName = "Luna Llena";
    icon = "🌕";
  } else if (phaseCycle < 20.30) {
    phaseName = "Luna Menguante Giba (Waning Gibbous)";
    icon = "🌖";
  } else if (phaseCycle < 23.99) {
    phaseName = "Cuarto Menguante";
    icon = "🌗";
  } else if (phaseCycle < 27.68) {
    phaseName = "Luna Menguante Cóncava (Waning Crescent)";
    icon = "🌘";
  } else {
    phaseName = "Luna Nueva";
    icon = "🌑";
  }

  return {
    cycleDay: Number(phaseCycle.toFixed(2)),
    phaseName,
    icon,
  };
};

// Numerology reduction helper
const reduceToSingleDigit = (num: number, master: boolean = true): number => {
  while (num > 9) {
    if (master && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num).split("").reduce((sum: number, char: string) => sum + Number(char), 0);
  }
  return num;
};

// PYTHAGOREAN SYSTEM alphabet values
const N_VALUES: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};

const calculateNumerology = (fullName: string, birthDate: string) => {
  // 1. Life Path Number (Camino de Vida)
  const cleanDate = birthDate.replace(/[^0-9]/g, "");
  const sumDateDigits = cleanDate.split("").reduce((sum: number, c: string) => sum + Number(c), 0);
  const lifePath = reduceToSingleDigit(sumDateDigits, true);

  // 2. Expression/Destiny Number (Expresión / Destino)
  const cleanName = fullName.toLowerCase().replace(/[^a-zñ]/g, "");
  const nameSum = cleanName.split("").reduce((sum: number, char: string) => {
    // Treat ñ as n (5)
    const key = char === "ñ" ? "n" : char;
    return sum + (N_VALUES[key] || 0);
  }, 0);
  const expression = reduceToSingleDigit(nameSum, true);

  // 3. Soul Urge Number / Hearts Desire (Deseo del Alma - Vowels)
  const vowels = (cleanName.match(/[aeiou]/g) || []) as string[];
  const vowelSum = vowels.reduce((sum: number, char: string) => sum + (N_VALUES[char] || 0), 0);
  const soulUrge = reduceToSingleDigit(vowelSum, true);

  // 4. Personality Number (Personalidad - Consonants)
  const consonants = (cleanName.match(/[^aeiou]/g) || []) as string[];
  const consonantSum = consonants.reduce((sum: number, char: string) => {
    const key = char === "ñ" ? "n" : char;
    return sum + (N_VALUES[key] || 0);
  }, 0);
  const personality = reduceToSingleDigit(consonantSum, true);

  return {
    lifePath,
    expression,
    soulUrge,
    personality
  };
};

/* Procedural Fallback Generators when Gemini API Quota is Exceeded or Unavailable */

function getProceduralZenAdvice(mood: string, stressLevel: number, language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";
  const m = (mood || "neutral").toLowerCase();
  
  let title = "";
  let reflection = "";
  let exerciseName = "";
  let exerciseDesc = "";
  let mantra = "";
  let actions: string[] = [];

  if (isEn) {
    if (m === "ansioso" || m === "anxious") {
      title = "Calming the Raging River";
      reflection = "When anxiety arises, it is like a river after a storm. Do not fight the waves; instead, step onto the shore. Your thoughts are not your identity; they are simply clouds passing through an infinite sky. Breathe into the present moment.";
      exerciseName = "The Anchoring Breath (4-4-8)";
      exerciseDesc = "Inhale deeply for 4 seconds, feeling your chest expand. Hold the breath gently for 4 seconds. Exhale slowly for 8 seconds, releasing all tension from your jaw and shoulders. Repeat this cycle 10 times to ground your nervous system.";
      mantra = "I am safe, grounded, and present in this very breath.";
      actions = [
        "Drink a warm cup of herbal tea without looking at any screens.",
        "Take a slow 5-minute walk, focusing entirely on the feeling of your feet touching the earth.",
        "Place one hand on your heart, close your eyes, and feel its steady rhythm."
      ];
    } else if (m === "tired" || m === "cansado") {
      title = "Restoring the Vital Light";
      reflection = "Fatigue is not a failure; it is the body's sacred invitation to return to the source. Allow yourself to release the need to achieve, produce, or solve. True productivity begins with radical rest.";
      exerciseName = "Rejuvenating Body Scan";
      exerciseDesc = "Lie flat or sit comfortably. Bring your awareness to your toes, inviting them to soften. Slowly move this warm, loving attention up through your legs, abdomen, chest, shoulders, and head. Let go of all physical holding.";
      mantra = "My worth is not defined by my doing. I am free to rest.";
      actions = [
        "Lie down in darkness for 10 minutes, letting your thoughts drift without effort.",
        "Wash your face with cool water, breathing in the refreshing sensation.",
        "Step outside and stretch your arms up toward the sky, breathing in fresh energy."
      ];
    } else {
      title = "The Present Moment is the Path";
      reflection = "Every moment is an open door to peace. You do not need to seek enlightenment in a distant temple; it is here, in the gentle rise and fall of your chest. The past is a memory; the future is an imagination. Only this moment is real.";
      exerciseName = "Somatic Center Meditation";
      exerciseDesc = "Sit upright with a straight spine. Close your eyes and focus on the sensation of air entering your nostrils, feeling cooler as you inhale and warmer as you exhale. Observe the silence between breaths.";
      mantra = "Here and now, everything is exactly as it needs to be.";
      actions = [
        "De-clutter three objects from your immediate environment to clear visual noise.",
        "Take three deep breaths before replying to your next message.",
        "Write down three simple things you are grateful for right now."
      ];
    }
  } else if (isPt) {
    if (m === "ansioso" || m === "anxious") {
      title = "Acalmando o Rio em Fúria";
      reflection = "Quando a ansiedade surge, ela é como um rio após uma tempestade. Não lute contra as ondas; em vez disso, dê um passo para a margem. Seus pensamentos não são quem você é; eles são apenas nuvens passando por um céu infinito. Respire no agora.";
      exerciseName = "A Respiração de Ancoragem (4-4-8)";
      exerciseDesc = "Inspire profundamente por 4 segundos, sentindo seu peito se expandir. Segure o ar suavemente por 4 segundos. Expire lentamente por 8 segundos, liberando toda a tensão do maxilar e dos ombros. Repita este ciclo 10 vezes para acalmar o sistema nervoso.";
      mantra = "Estou seguro, ancorado e presente neste exato sopro de vida.";
      actions = [
        "Beba uma xícara de chá morno de ervas sem olhar para nenhuma tela.",
        "Faça uma caminhada lenta de 5 minutos, focando inteiramente na sensação dos seus pés tocando a terra.",
        "Coloque uma mão sobre o coração, feche os olhos e sinta o seu ritmo constante."
      ];
    } else if (m === "tired" || m === "cansado") {
      title = "Restaurando a Luz Vital";
      reflection = "O cansaço não é um fracasso; é o convite sagrado do corpo para retornar à fonte. Permita-se libertar a necessidade de realizar, produzir ou resolver. A verdadeira produtividade começa com o descanso radical.";
      exerciseName = "Escaneamento Corporal Rejuvenescedor";
      exerciseDesc = "Deite-se ou sente-se confortavelmente. Traga a sua atenção para os dedos dos pés, convidando-os a relaxar. Mova lentamente essa atenção calorosa e amorosa pelas pernas, abdômen, peito, ombros e cabeça.";
      mantra = "O meu valor não é definido pelo que faço. Sou livre para descansar.";
      actions = [
        "Deite-se no escuro por 10 minutos, deixando os pensamentos flutuarem sem esforço.",
        "Lave o rosto com água fria, respirando na sensação refrescante.",
        "Vá lá fora e estique os braços em direção ao céu, respirando energia nova."
      ];
    } else {
      title = "O Momento Presente é o Caminho";
      reflection = "Cada momento é uma porta aberta para a paz. Você não precisa buscar a iluminação num templo distante; ela está aqui, no subir e descer suave do seu peito. O pasado é memória; o futuro é imaginação. Apenas o agora é real.";
      exerciseName = "Meditação do Centro Somático";
      exerciseDesc = "Sente-se ereto com a coluna alinhada. Feche os olhos e concentre-se na sensação do ar entrando pelas narinas, sentindo-o mais fresco ao inspirar e mais quente ao expirar. Observe o silêncio entre as respirações.";
      mantra = "Aqui e agora, tudo está exatamente como deve ser.";
      actions = [
        "Organize três objetos do seu ambiente imediato para limpar o ruído visual.",
        "Respire fundo três vezes antes de responder à sua próxima mensagem.",
        "Escreva três coisas simples pelas quais você é grato agora."
      ];
    }
  } else {
    if (m === "ansioso" || m === "anxious") {
      title = "Calmando el Río Revuelto";
      reflection = "Cuando la ansiedad se presenta, es como un río revuelto tras una tormenta. No luches contra las olas; en lugar de eso, da un paso hacia la orilla. Tus pensamientos no te definen, son solo nubes en un cielo infinito. Respira.";
      exerciseName = "Respiración de Anclaje (4-4-8)";
      exerciseDesc = "Inhala profundamente durante 4 segundos, sintiendo el abdomen expandirse. Retén el aire con suavidad durante 4 segundos. Exhala lentamente durante 8 segundos, liberando la tensión de mandíbula y hombros. Repite 10 veces.";
      mantra = "Estoy a salvo, enraizado y presente en esta respiración.";
      actions = [
        "Toma una infusión tibia con calma y sin mirar pantallas.",
        "Camina descalzo sobre el suelo sintiendo conscientemente el contacto físico.",
        "Pon tu mano en el pecho y siente los latidos constantes de tu corazón."
      ];
    } else if (m === "tired" || m === "cansado") {
      title = "Restaurando la Luz Interna";
      reflection = "El cansancio no es un error, es el llamado sagrado del cuerpo para volver a la fuente de energía. Suelta la necesidad de producir o resolver en este instante. El descanso es un acto de amor y respeto propio.";
      exerciseName = "Escaneo Corporal de Descanso";
      exerciseDesc = "Siente el peso de tu cuerpo apoyado en el asiento o cama. Recorre mentalmente desde los pies hasta la cabeza, enviando un mensaje de calma e invitando a cada músculo a relajarse profundamente.";
      mantra = "Mi valor no depende de mi productividad. Me doy permiso de descansar.";
      actions = [
        "Recuéstate 10 minutos con los ojos cerrados, permitiendo que tu mente divague libremente.",
        "Mójate el rostro con agua fresca y respira el aire renovador.",
        "Estira tus brazos hacia el cielo suavemente, liberando la pesadez."
      ];
    } else {
      title = "El Momento Presente es el Sendero";
      reflection = "El único momento real es el ahora. Todo lo demás es memoria o proyección mental. No necesitas viajar a un templo lejano para encontrar paz; está aquí mismo, en cada ciclo de tu respiración.";
      exerciseName = "Meditación del Centro Somático";
      exerciseDesc = "Adopta una postura erguida pero relajada. Concéntrate en el roce del aire al entrar por tu nariz, notando la diferencia de temperatura. Sé testigo del espacio de silencio que precede a cada ciclo.";
      mantra = "Aquí y ahora, todo está en perfecto equilibrio.";
      actions = [
        "Ordena tres cosas de tu mesa de trabajo para despejar tu espacio visual.",
        "Realiza tres respiraciones conscientes y lentas antes de hablar.",
        "Agradece en silencio tres aspectos simples y cotidianos de tu vida."
      ];
    }
  }

  return {
    title,
    reflection,
    mindfulnessExercise: {
      name: exerciseName,
      description: exerciseDesc,
      durationMinutes: 5
    },
    mantra,
    practicalActions: actions,
    isFallback: true
  };
}

function getProceduralTarot(question: string, type: string, drawnCards: any[], language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";

  const interpretations = drawnCards.map((card, idx) => {
    let posName = "";
    if (type === "1-card") {
      posName = isEn ? "Core Guidance" : isPt ? "Orientação Central" : "Guía Central";
    } else if (type === "3-card") {
      const positions = isEn ? ["Past", "Present", "Future"] : isPt ? ["Passado", "Presente", "Futuro"] : ["Pasado", "Presente", "Futuro"];
      posName = positions[idx] || "Aspect";
    } else {
      const positions = isEn 
        ? ["Socio-emotional Context", "Current Challenge", "Subconscious Anchor", "Practical Tool", "Spiritual Outcome"] 
        : isPt 
        ? ["Contexto Sócio-emocional", "Desafio Atual", "Âncora Subconsciente", "Ferramenta Prática", "Resultado Espiritual"] 
        : ["Contexto Socio-emocional", "Desafío Actual", "Anclaje Subconsciente", "Herramienta Práctica", "Resultado Espiritual"];
      posName = positions[idx] || "Aspect";
    }

    let meaning = "";
    if (isEn) {
      meaning = `The card ${card.name} in its ${card.isReversed ? "reversed" : "upright"} position represents a powerful mirror for your query "${question}". It suggests that you need to examine the flow of energy in this area. ${card.isReversed ? "The block here is internal; seek answers within." : "The energies are manifesting externally; move forward with confidence."}`;
    } else if (isPt) {
      meaning = `A carta ${card.name} na sua posição ${card.isReversed ? "invertida" : "direta"} representa um espelho poderoso para a sua pergunta "${question}". Sugere a necessidade de examinar o fluxo de energia nesta área. ${card.isReversed ? "O bloqueio aqui é interno; procure respostas no seu interior." : "As energias estão se manifestando externamente; siga em frente com confiança."}`;
    } else {
      meaning = `La carta ${card.name} en su posición ${card.isReversed ? "invertida" : "derecha"} representa un espejo poderoso para tu consulta "${question}". Sugiere la necesidad de examinar el flujo de energía en este aspecto. ${card.isReversed ? "El bloqueo aquí es de origen interno; busca las respuestas en tu interior." : "Las energías se están manifestando externamente; avanza con plena confianza."}`;
    }

    return {
      cardName: card.name,
      positionName: posName,
      isReversed: card.isReversed,
      meaning
    };
  });

  let summary = "";
  let advice = "";

  if (isEn) {
    summary = `Your tarot draw offers a deeply spiritual perspective on your path. By centering your consciousness on these archetypes, you are invited to view your challenge not as a barrier, but as a catalyst for evolution.`;
    advice = `Align your actions with your inner truth. Trust the timing of your life and do not force external outcomes.`;
  } else if (isPt) {
    summary = `O seu sorteio de tarot oferece uma perspetiva profundamente espiritual sobre o seu caminho. Ao centrar a sua consciência nestes arquétipos, é convidado a ver o seu desafio não como uma barreira, mas como um catalisador para a evolução.`;
    advice = `Alinhe as suas ações com a sua verdade interior. Confie no ritmo da sua vida e evite forçar resultados externos.`;
  } else {
    summary = `Tu tirada de tarot ofrece una perspectiva profundamente espiritual sobre tu camino actual. Al centrar tu conciencia en estos arquetipos, se te invita a contemplar tus desafíos no como barreras, sino como catalizadores sagrados para tu evolución personal.`;
    advice = `Alinea tus acciones con tu verdad más interna. Confía plenamente en el ritmo natural de tu vida y evita forzar resultados externos en este momento.`;
  }

  return {
    summary,
    interpretations,
    advice,
    isFallback: true
  };
}

function getProceduralRunes(question: string, type: string, drawnRunesList: any[], language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";

  const interpretations = drawnRunesList.map((rune, idx) => {
    let pos = "";
    if (type === "1-rune") {
      pos = isEn ? "Active Guidance" : isPt ? "Guia Ativo" : "Guía Activa";
    } else {
      const positions = isEn ? ["Origin / Root", "Current Challenge", "Future Potential"] : isPt ? ["Origem / Raiz", "Desafio Atual", "Potencial Futuro"] : ["Origen / Raíz", "Desafío Actual", "Potencial Futuro"];
      pos = positions[idx] || "Aspect";
    }

    let meaning = "";
    if (isEn) {
      meaning = `The rune ${rune.name} (${rune.symbol}) ${rune.isReversed ? "reversed" : "upright"} speaks of ${rune.meaning.toLowerCase()} in relation to "${question}". It indicates a force of nature operating in your sphere. ${rune.isReversed ? "Observe where you are leaking energy and pull back." : "The winds of change are behind you; plant seeds of action now."}`;
    } else if (isPt) {
      meaning = `A runa ${rune.name} (${rune.symbol}) na posição ${rune.isReversed ? "invertida" : "direta"} fala sobre ${rune.meaning.toLowerCase()} em relação a "${question}". Indica uma força da natureza operando em sua esfera. ${rune.isReversed ? "Observe onde você está perdendo energia e recolha-se." : "Os ventos da mudança estão a seu favor; plante as sementes da ação agora."}`;
    } else {
      meaning = `La runa ${rune.name} (${rune.symbol}) en su posición ${rune.isReversed ? "invertida" : "derecha"} nos habla de ${rune.meaning.toLowerCase()} con respecto a tu consulta "${question}". Esto señala una fuerza cósmica primordial activa en tu vida. ${rune.isReversed ? "Observa dónde estás perdiendo energía vital y opta por replegarte temporalmente." : "Los vientos del destino soplan a tu favor; es momento de sembrar intenciones claras."}`;
    }

    return {
      runeName: rune.name,
      symbol: rune.symbol,
      position: pos,
      isReversed: rune.isReversed,
      meaning
    };
  });

  let summary = "";
  let advice = "";

  if (isEn) {
    summary = `The wisdom of Odin and the ancient Norns reveals a pathway of self-mastery. The runes drawn suggest a cycle of growth that requires patience, respect for natural timing, and inner courage.`;
    advice = `\"Fear not the storm, for the roots of Yggdrasil run deeper than any gale.\" Stand strong and rely on your ancestral strength.`;
  } else if (isPt) {
    summary = `A sabedoria de Odin e das antigas Nornas revela um caminho de autodomínio. As runas sorteadas sugerem um ciclo de crescimento que exige paciência, respeito pelos tempos naturais e coragem interior.`;
    advice = `\"Não temas a tempestade, pois as raízes de Yggdrasil são mais profundas do que qualquer vendaval.\" Mantenha-se firme e confie na sua força ancestral.`;
  } else {
    summary = `La sabiduría rúnica de Odín y las hilanderas del destino (Nornas) revela un camino de templanza y soberanía personal. Las runas extraídas sugieren un ciclo de maduración que requiere paciencia y sincronía con los ritmos naturales.`;
    advice = `\"No temas a la tormenta, pues las raíces de Yggdrasil se hunden con más fuerza que cualquier vendaval.\" Mantente firme en tu centro y confía en tu resiliencia natural.`;
  }

  return {
    summary,
    interpretations,
    advice,
    isFallback: true
  };
}

function getProceduralNumerology(fullName: string, birthDate: string, scores: any, language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";

  let introduction = "";
  let lifePathInterpretation = "";
  let expressionInterpretation = "";
  let soulUrgeInterpretation = "";
  let personalityInterpretation = "";
  let cosmicAdvice = "";

  if (isEn) {
    introduction = `Welcome, ${fullName}. The cosmic sound of your name holds unique frequencies, carrying the vibrations of numbers that align with your birth date: ${birthDate}.`;
    lifePathInterpretation = `Your Life Path Number is ${scores.lifePath}. This is your primary spiritual coordinate, indicating a path of development oriented around authenticity, learning, and self-expression. You are designed to walk a path of mastership and spiritual alignment.`;
    expressionInterpretation = `Your Expression Number ${scores.expression} represents your natural talents and outer legacy. It shows how you organize thoughts, apply skills, and interact with professional environments to bring your dreams to life.`;
    soulUrgeInterpretation = `Your Soul Urge Number ${scores.soulUrge} reveals the silent longing of your inner heart. This frequency guides your most intimate desires, indicating what you truly need to feel spiritually nourished and complete.`;
    personalityInterpretation = `Your Personality Number ${scores.personality} acts as your social filter or outer cloak. It governs how people perceive you during first encounters and helps you navigate relationships while protecting your inner core.`;
    cosmicAdvice = `Focus on aligning your daily habits with your Life Path vibration (${scores.lifePath}). Avoid rushing; trust that you are exactly where your soul needs to be to grow.`;
  } else if (isPt) {
    introduction = `Seja bem-vindo, ${fullName}. O som cósmico do seu nome guarda frequências únicas, carregando as vibrações dos números que se alinham com a sua data de nascimento: ${birthDate}.`;
    lifePathInterpretation = `O seu Número de Caminho de Vida é ${scores.lifePath}. Esta é a sua coordenada espiritual primária, indicando uma trilha de desenvolvimento orientada para a autenticidade, aprendizado e autoexpressão. Você foi desenhado para trilhar uma jornada de alinhamento espiritual.`;
    expressionInterpretation = `O seu Número de Expressão ${scores.expression} representa os seus talentos naturais e legado exterior. Mostra como você organiza ideias, aplica habilidades e interage com ambientes profissionais.`;
    soulUrgeInterpretation = `O seu Número de Desejo da Alma ${scores.soulUrge} revela o anseio silencioso do seu coração. Esta frequência guia as suas aspirações mais íntimas, mostrando o que você realmente necessita para se sentir espiritualmente pleno.`;
    personalityInterpretation = `O seu Número de Personalidade ${scores.personality} funciona como o seu filtro social ou máscara externa. Governa como os outros o percebem e ajuda-o a proteger o seu núcleo íntimo.`;
    cosmicAdvice = `Foque em alinhar os seus hábitos diários com a sua vibração de Caminho de Vida (${scores.lifePath}). Evite pressas; confie que você está exatamente onde a sua alma precisa estar para evoluir.`;
  } else {
    introduction = `Te damos la bienvenida, ${fullName}. La vibración cósmica de tu nombre resuena con un propósito definido, entrelazándose con la fecha sagrada de tu nacimiento: ${birthDate}.`;
    lifePathInterpretation = `Tu Sendero de Vida es el número ${scores.lifePath}. Esta es tu coordenada espiritual más importante, señalando una misión enfocada en el crecimiento, el aprendizaje y la manifestación de tu autenticidad. Tu alma ha elegido este camino para dominar sus aprendizajes.`;
    expressionInterpretation = `Tu Número de Expresión es el ${scores.expression}, el cual representa tus talentos natos y tu legado exterior. Describe tus capacidades para organizar ideas, resolver problemas e interactuar de forma constructiva con el mundo profesional.`;
    soulUrgeInterpretation = `Tu Deseo del Alma es el número ${scores.soulUrge}, revelando el anhelo más íntimo y sagrado de tu corazón. Esta frecuencia rige lo que realmente necesitas experimentar y sentir para experimentar plenitud espiritual.`;
    personalityInterpretation = `Tu Número de Personalidad es el ${scores.personality}, actuando como tu máscara social y filtro protector. Determina la primera impresión que causas en los demás y cómo resguardas tu esencia.`;
    cosmicAdvice = `Sincroniza tus rutinas con la frecuencia de tu Sendero de Vida (${scores.lifePath}). Evita la impaciencia; recuerda que cada paso en tu evolución tiene un tiempo perfecto y divino.`;
  }

  return {
    introduction,
    lifePathInterpretation,
    expressionInterpretation,
    soulUrgeInterpretation,
    personalityInterpretation,
    cosmicAdvice,
    isFallback: true
  };
}

function getProceduralTreeOfLife(birthDate: string, focusArea: string, activeSefirah: any, language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";

  let alignmentExplanation = "";
  let sefirotMap: any[] = [];
  let kabbalisticMeditation = { title: "", practice: "" };
  let blessing = "";

  if (isEn) {
    alignmentExplanation = `Your date of birth aligns beautifully with ${activeSefirah.name} (${activeSefirah.archetype}), representing "${activeSefirah.value}". In your chosen focus area of "${focusArea}", this energy serves as an active portal for expansion and self-mastery.`;
    
    sefirotMap = [
      {
        sefirah: activeSefirah.name,
        strength: `This Sefirah provides you with a strong anchor of inner light, allowing you to face challenges in ${focusArea} with resilience and clarity.`,
        shadow: `Beware of unbalanced expressions—do not allow this energy to manifest as rigidity or excessive control. Seek the middle path.`
      },
      {
        sefirah: "Tiferet",
        strength: "Serves as the balancing center of your heart, harmonizing your thoughts and actions.",
        shadow: "Avoid taking on other people's emotional baggage at the expense of your own peace."
      },
      {
        sefirah: "Yesod",
        strength: "Aligns your subconscious desires and dreams with actual daily intentions.",
        shadow: "Do not get lost in mere daydreams; ground your visualisations into physical acts."
      }
    ];

    kabbalisticMeditation = {
      title: `The Alignment of ${activeSefirah.name}`,
      practice: `1. Sit in absolute silence, visualizing a glowing pillar of light above your crown.\n2. Imagine this light flowing down, illuminating the sphere of ${activeSefirah.name} inside your energetic body.\n3. Breathe deeply, reciting the Hebrew letters of power associated with peace.\n4. Feel the energy of ${focusArea} settling into absolute harmony.`
    };

    blessing = `May the infinite light of the Ein Sof illuminate your path and bring peace to your soul.`;
  } else if (isPt) {
    alignmentExplanation = `A sua data de nascimento alinha-se perfeitamente com ${activeSefirah.name} (${activeSefirah.archetype}), representando "${activeSefirah.value}". Na sua área de foco escolhida de "${focusArea}", esta energia serve como um portal ativo para a expansão e o autodomínio.`;
    
    sefirotMap = [
      {
        sefirah: activeSefirah.name,
        strength: `Esta Sefirah proporciona-lhe uma forte âncora de luz interior, permitindo-lhe enfrentar os desafios em ${focusArea} com resiliência e clareza.`,
        shadow: `Cuidado com expressões desequilibradas—não permita que esta energia se manifeste como rigidez ou controlo excessivo. Procure o caminho do meio.`
      },
      {
        sefirah: "Tiferet",
        strength: "Serve como o centro de equilíbrio do seu coração, harmonizando os seus pensamentos e ações.",
        shadow: "Evite carregar as bagagens emocionais alheias em detrimento da sua própria paz."
      },
      {
        sefirah: "Yesod",
        strength: "Alinha os desejos do seu subconsciente e sonhos com as intenções diárias reais.",
        shadow: "Não se perca em devaneios vazios; aterre as suas visualizações em ações físicas."
      }
    ];

    kabbalisticMeditation = {
      title: `O Alinhamento de ${activeSefirah.name}`,
      practice: `1. Sente-se em silêncio absoluto, visualizando uma coluna de luz brilhante acima da sua cabeça.\n2. Imagine esta luz descendo, iluminando a esfera de ${activeSefirah.name} dentro do seu corpo energético.\n3. Respire profundamente, recitando mentalmente as letras sagradas da paz.\n4. Sinta a energia de ${focusArea} se estabelecendo em perfeita harmonia.`
    };

    blessing = `Que a luz infinita do Ein Sof ilumine o seu caminho e traga paz à sua alma.`;
  } else {
    alignmentExplanation = `Tu fecha de nacimiento se alinea armoniosamente con la Sefirá de ${activeSefirah.name} (${activeSefirah.archetype}), la cual rige: "${activeSefirah.value}". En tu enfoque prioritario de "${focusArea}", esta energía actúa como un portal de conciencia activa para tu evolución.`;
    
    sefirotMap = [
      {
        sefirah: activeSefirah.name,
        strength: `Esta Sefirá te otorga un anclaje de luz interna inquebrantable, permitiéndote resolver tensiones en el área de ${focusArea} con sabiduría y ecuanimidad.`,
        shadow: `Ten precaución con su aspecto de sombra: no permitas que esta energía derive en rigidez mental o deseos excesivos de control.`
      },
      {
        sefirah: "Tiferet",
        strength: "Actúa como el corazón equilibrador de tu árbol personal, armonizando mente y acción.",
        shadow: "Evita mimetizarte con el sufrimiento o tensiones ajenas a expensas de tu propio centro."
      },
      {
        sefirah: "Yesod",
        strength: "Facilita la conexión entre tus anhelos subconscientes y tus capacidades de manifestación física.",
        shadow: "Evita la dispersión en fantasías estériles y comprométete con acciones concretas en el plano físico."
      }
    ];

    kabbalisticMeditation = {
      title: `La Alineación de ${activeSefirah.name}`,
      practice: `1. Adopta una postura cómoda y cierra los ojos, visualizando una columna de luz blanca y pura sobre tu corona.\n2. Visualiza cómo desciende este haz luminoso, encendiendo la esfera de ${activeSefirah.name} en tu centro energético.\n3. Respira de forma acompasada, sosteniendo la vibración de paz en tu plexo solar.\n4. Decreta en silencio la armonización completa del aspecto de "${focusArea}".`
    };

    blessing = `Que la luz infinita del Ein Sof guíe cada uno de tus pasos y colme de paz tu templo interior.`;
  }

  return {
    alignmentExplanation,
    sefirotMap,
    kabbalisticMeditation,
    blessing,
    isFallback: true
  };
}

function getProceduralAffirmations(mood: string, stressLevel: string) {
  const m = (mood || "neutral").toLowerCase();
  
  let theme = "Soltar y Confiar";
  let affirmations = [
    "Respiro hondo y elijo liberar las tensiones acumuladas en mi cuerpo.",
    "Acepto el fluir de la vida y confío en que todo ocurre para mi mayor bien.",
    "Soy el espacio de calma a través del cual pasan las tormentas.",
    "Mi mente se aquieta con cada ciclo de respiración consciente.",
    "Hoy decido caminar con pasos ligeros y el corazón agradecido."
  ];
  let notificationText = "Haz una pausa de 10 segundos. Respira, siente tu cuerpo y sonríe al momento presente. 🌸";

  if (m === "ansioso" || m === "anxious") {
    theme = "Anclaje en el Presente";
    affirmations = [
      "Inhalo paz, exhalo toda preocupación del mañana.",
      "Estoy a salvo aquí y ahora; la tormenta está afuera, no dentro de mí.",
      "Mis pensamientos son nubes libres, yo soy el cielo inmenso y tranquilo.",
      "Paso a paso, respiro a respiración, elijo mi tranquilidad.",
      "Confío en mi capacidad para superar las incertidumbres con elegancia."
    ];
    notificationText = "Respira hondo ahora mismo. Todo está bien en este instante sagrado. Volver a ti es tu hogar. ✨";
  } else if (m === "cansado" || m === "tired") {
    theme = "Descanso y Autocompasión";
    affirmations = [
      "Mi cuerpo es sabio y elijo honrar su llamado al descanso.",
      "Suelto la prisa del mundo y me permito reponer mi energía vital.",
      "La quietud no es tiempo perdido; es la siembra de mi claridad de mañana.",
      "Me trato con suavidad, amor y paciencia en cada paso del camino.",
      "Agradezco a mi ser todo el esfuerzo realizado hoy y le permito descansar."
    ];
    notificationText = "Suaviza tus hombros, relaja tu mandíbula. Date permiso para pausar y descansar un momento. 🌙";
  }

  return {
    theme,
    affirmations,
    notificationText,
    isFallback: true
  };
}

function getProceduralArticleExpansion(title: string, language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";

  let finalTitle = title;
  let intro = "";
  let sections: any[] = [];
  let practice = "";
  let quote = "";

  if (isEn) {
    intro = `Exploring "${title}" invites us to pause the frantic rush of daily life. It is an exploration of the subtle textures of our consciousness, showing us that stillness is not the absence of movement, but the presence of clear awareness.`;
    sections = [
      {
        heading: "The Root of the Practice",
        content: `To understand the essence of this teaching, we must observe how we react to the constant flux of thoughts. True mindfulness is not about emptying the mind; rather, it is about developing an unconditional friendship with whatever arises.`
      },
      {
        heading: "Integrating Stillness Daily",
        content: `The beauty of this approach is its simple applicability. You do not need a quiet mountain cabin to practice; you only need to bring wholehearted attention to your immediate sensory experience—be it the warmth of a cup, or the sound of the wind.`
      }
    ];
    practice = "Take 3 conscious breaths before every transition today (e.g., before standing up, opening a door, or starting a call).";
    quote = '"Quiet the mind and the soul will speak." — Zen Proverb';
  } else if (isPt) {
    intro = `Explorar "${title}" convida-nos a pausar a corrida frenética da vida quotidiana. É uma exploração das texturas subtis da nossa consciência, mostrando-nos que a quietude não é a ausência de movimento, mas a presença de uma atenção clara.`;
    sections = [
      {
        heading: "A Raiz da Prática",
        content: `Para compreender a essência deste ensinamento, devemos observar como reagimos ao fluxo constante de pensamentos. A verdadeira atenção plena não consiste em esvaziar a mente; consiste em desenvolver uma amizade incondicional com tudo o que surge.`
      },
      {
        heading: "Integrando a Quietude no Dia a Dia",
        content: `A beleza desta abordagem é a sua simplicidade prática. Não precisa de uma cabana silenciosa na montanha para praticar; apenas necessita de trazer atenção plena à sua experiência sensorial imediata.`
      }
    ];
    practice = "Faça 3 respirações conscientes antes de cada transição hoje (por exemplo, antes de se levantar, abrir uma porta ou iniciar uma chamada).";
    quote = '"Acalme a mente e a alma falará." — Provérbio Zen';
  } else {
    intro = `La exploración de "${title}" nos invita a detener la inercia del día a día. Se trata de un viaje hacia la observación atenta de nuestra conciencia, recordándonos que la paz interior no depende de la ausencia de ruido externo, sino del cultivo de la presencia pura.`;
    sections = [
      {
        heading: "La Raíz de la Presencia Consciente",
        content: `Para asimilar esta enseñanza con profundidad, es indispensable observar nuestra relación con los pensamientos. Practicar atención plena no implica reprimir o vaciar la mente, sino aprender a observar cada pensamiento como una hoja que flota sobre un arroyo.`
      },
      {
        heading: "Sincronía con lo Cotidiano",
        content: `La verdadera magia de este sendero reside en su aplicación práctica. No requieres retirarte a una montaña aislada; basta con volcar una atención total y amorosa en cada acción ordinaria, como sentir el agua tibia al lavar tus manos.`
      }
    ];
    practice = "Realiza 3 respiraciones pausadas y conscientes en cada transición de tu día (ej. antes de comer, antes de abrir una puerta o al sentarte).";
    quote = '"Cuando calmas las olas de tu mente, el lago de tu alma refleja la verdad eterna." — Proverbio Zen';
  }

  return {
    title: finalTitle,
    intro,
    sections,
    practice,
    quote,
    isFallback: true
  };
}

function getProceduralAstrology(language: string) {
  const isEn = language === "en";
  const isPt = language === "pt";

  // Procedural variation based on day of the month
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const seed = (day * 3 + month * 7) % 4;

  let transitTitle = "";
  let generalClimate = "";
  let transits: any[] = [];
  let advice = "";
  let recommendedPractice = "";

  if (isEn) {
    const options = [
      {
        title: "Moon in Trine with Neptune",
        climate: "Today the celestial skies flow with an exceptionally high vibrational, mystical wave. Neptune softens the sharp edges of Saturn, allowing our intuition to run deep and our spiritual channels to open wide. It is a golden window for active imagination, tarot guidance, and dream analysis.",
        transits: [
          { aspect: "Moon Trine Neptune", influence: "Deepens emotional empathy, vivid dreaming, and our innate psychic sensitivity. A highly magical flow.", score: 5 },
          { aspect: "Sun Sextile Uranus", influence: "Brings subtle sparks of awakening, unexpected spiritual insights, and creative breakthroughs.", score: 4 },
          { aspect: "Mercury Conjunction Venus", influence: "Softens communications. Words flow with compassion and aesthetic grace, ideal for soul connection.", score: 4 }
        ],
        advice: "Avoid force and rigidity today. Let yourself float. The cosmos is telling you that the answers you seek do not lie in logical struggle, but in quiet receptivity.",
        practice: "Light a yellow candle or incense, close your eyes, and meditate on a deep blue ocean representing Neptune. Let any thoughts drift away without engagement."
      },
      {
        title: "Sun Sextile Mars & Jupiter",
        climate: "A solar current of pure vitality and growth dominates the sky. Fire and Air elements are perfectly balanced. This is an auspicious moment to initiate spiritual projects, take actions aligned with your soul path, and declare active intentions.",
        transits: [
          { aspect: "Sun Sextile Mars", influence: "Gives focused courage, active physical vitality, and the drive to overcome stagnations.", score: 5 },
          { aspect: "Moon Sextile Jupiter", influence: "Expands the heart, increases emotional generosity, and opens our perception to abundance.", score: 4 },
          { aspect: "Saturn Retrograde in Pisces", influence: "Forces internal structural auditing. We must build spiritual foundations rather than superficial facades.", score: 3 }
        ],
        advice: "Channel this active fire into conscious devotion. Avoid scattered talk or arguments; the energy is highly creative if concentrated on a single purpose.",
        practice: "Write down 3 active goals on a piece of paper, hold it over a burning flame (safely) or a crystal, and visualize yourself taking bold, centered steps."
      },
      {
        title: "Venus in Square with Pluto",
        climate: "The cosmos is touching deep emotional waters today. Pluto demands absolute honesty and transformation in how we relate to ourselves and others. Do not fear the shadows; they are simply unintegrated parts of your sacred light.",
        transits: [
          { aspect: "Venus Square Pluto", influence: "Intensifies desires, exposes attachment fears, and forces old psychological patterns to rise and be healed.", score: 2 },
          { aspect: "Moon Conjunction Saturn", influence: "Creates a temporary feeling of emotional isolation, urging us to find self-soothing from within.", score: 3 },
          { aspect: "Neptune Sextile Pluto", influence: "A generational aspect that slowly converts collective distress into compassionate action and intuitive rebirth.", score: 5 }
        ],
        advice: "Take deep breaths whenever you feel triggered. Pluto's tension is not a punishment, but a sacred fire designed to burn away what no longer serves your path.",
        practice: "Box breathing for 5 minutes, followed by writing a letter of forgiveness to an old memory, then shredding or safely burning it as a symbol of release."
      },
      {
        title: "Mercury Trine Saturn in Air Signs",
        climate: "A day of profound mental clarity, logic paired with spiritual wisdom, and structured thinking. The air is calm and the minds are sharp. Perfect for study, Kabbalistic contemplation, or organizing your spiritual logs.",
        transits: [
          { aspect: "Mercury Trine Saturn", influence: "Enhances concentration, discipline, and the ability to articulate deep mysteries in simple words.", score: 5 },
          { aspect: "Sun Conjunction Mercury", influence: "Illuminates our intellect. A powerful alignment for writing, speaking truth, and clear decisions.", score: 4 },
          { aspect: "Moon Trine Mars", influence: "Supplies precise emotional drive, enabling us to execute tasks with elegant agility and zero procrastination.", score: 4 }
        ],
        advice: "Dedicate time to deep reading or structured study. The stars favor ancient systems like Kabbalah, Numerology, or geometry today.",
        practice: "Spend 10 minutes in absolute silence. Then, write a structured list of your current mental habits, marking which ones are building a solid foundation."
      }
    ];
    const sel = options[seed];
    transitTitle = sel.title;
    generalClimate = sel.climate;
    transits = sel.transits;
    advice = sel.advice;
    recommendedPractice = sel.practice;
  } else if (isPt) {
    const options = [
      {
        title: "Lua em Trígono com Netuno",
        climate: "Hoje os céus celestes fluem com uma onda mística de versão excepcionalmente elevada. Netuno suaviza as arestas de Saturno, permitindo que nossa intuição se aprofunde e nossos canais espirituais se abram amplamente. É uma janela de ouro para imaginação ativa, orientação de tarô e análise de sonhos.",
        transits: [
          { aspect: "Lua Trígono Netuno", influence: "Aprofunda a empatia emocional, os sonhos vívidos e nossa sensibilidade psíquica inata. Um fluxo altamente mágico.", score: 5 },
          { aspect: "Sol Sextil Urano", influence: "Traz faíscas sutis de despertar, insights espirituais inesperados e avanços criativos.", score: 4 },
          { aspect: "Mercúrio Conjunção Vênus", influence: "Suaviza as comunicações. As palavras fluem com compaixão e graça estética, ideais para a conexão da alma.", score: 4 }
        ],
        advice: "Evite a força e a rigidez hoje. Deixe-se flutuar. O cosmos está lhe dizendo que as respostas que você busca não residem na luta lógica, mas na receptividade silenciosa.",
        practice: "Acenda uma vela amarela ou incenso, feche os olhos e medite em um oceano azul profundo representando Netuno. Deixe que quaisquer pensamentos se afastem sem engajamento."
      },
      {
        title: "Sol Sextil Marte e Júpiter",
        climate: "Uma corrente solar de pura vitalidade e crescimento domina o céu. Os elementos Fogo e Ar estão perfeitamente equilibrados. Este é um momento auspicioso para iniciar projetos espirituais, realizar ações alinhadas com o caminho de sua alma e declarar intenções ativas.",
        transits: [
          { aspect: "Sol Sextil Marte", influence: "Dá coragem concentrada, vitalidade física ativa e impulso para superar estagnações.", score: 5 },
          { aspect: "Lua Sextil Júpiter", influence: "Expande o coração, aumenta a generosidade emocional e abre nossa percepção à abundância.", score: 4 },
          { aspect: "Saturno Retrógrado em Peixes", influence: "Força a auditoria estrutural interna. Devemos construir bases espirituais em vez de fachadas superficiais.", score: 3 }
        ],
        advice: "Canalize este fogo ativo em devoção consciente. Evite conversas dispersas ou discussões; a energia é altamente criativa se concentrada em um único propósito.",
        practice: "Anote 3 objetivos ativos em um pedaço de papel, segure-o sobre uma chama acesa (com segurança) ou um cristal e visualize-se dando passos ousados e centrados."
      },
      {
        title: "Vênus em Quadratura com Plutão",
        climate: "O cosmos está tocando águas emocionais profundas hoje. Plutão exige honestidade absoluta e transformação em como nos relacionamos com nós mesmos e com os outros. Não tema as sombras; elas são simplesmente partes não integradas de sua luz sagrada.",
        transits: [
          { aspect: "Vênus Quadratura Plutão", influence: "Intensifica desejos, expõe medos de apego e força velhos padrões psicológicos a surgir e serem curados.", score: 2 },
          { aspect: "Lua Conjunção Saturno", influence: "Cria um sentimento temporário de isolamento emocional, incitando-nos a encontrar auto-conforto a partir de dentro.", score: 3 },
          { aspect: "Netuno Sextil Plutão", influence: "Um aspecto geracional que converte lentamente a angústia coletiva em ação compassiva e renascimento intuitivo.", score: 5 }
        ],
        advice: "Respire fundo sempre que se sentir afetado. A tensão de Plutão não é um castigo, mas um fogo sagrado projetado para queimar o que já não serve ao seu caminho.",
        practice: "Respiração quadrada por 5 minutos, seguida pela escrita de uma carta de perdão para uma velha memória, e depois rasgá-la ou queimá-la com segurança como um símbolo de libertação."
      },
      {
        title: "Mercúrio Trígono Saturno em Signos de Ar",
        climate: "Um dia de profunda clareza mental, lógica combinada com sabedoria espiritual e pensamento estruturado. O ar está calmo e as mentes afiadas. Perfeito para estudo, contemplação cabalística ou organização de seus registros espirituais.",
        transits: [
          { aspect: "Mercúrio Trígono Saturno", influence: "Melhora a concentração, a disciplina e a capacidade de articular mistérios profundos em palavras simples.", score: 5 },
          { aspect: "Sol Conjunção Mercúrio", influence: "Ilumina nosso intelecto. Um alinhamento poderoso para escrever, falar a verdade e tomar decisões claras.", score: 4 },
          { aspect: "Lua Trígono Marte", influence: "Fornece impulso emocional preciso, permitindo-nos executar tarefas com agilidade elegante e zero procrastinação.", score: 4 }
        ],
        advice: "Dedique tempo à leitura profunda ou ao estudo estruturado. Os astros favorecem sistemas antigos como Cabala, Numerologia ou geometria hoje.",
        practice: "Passe 10 minutos em silêncio absoluto. Depois, escreva uma lista estruturada de seus hábitos mentais atuais, marcando quais estão construindo uma base sólida."
      }
    ];
    const sel = options[seed];
    transitTitle = sel.title;
    generalClimate = sel.climate;
    transits = sel.transits;
    advice = sel.advice;
    recommendedPractice = sel.practice;
  } else {
    const options = [
      {
        title: "Luna en Trígono con Neptuno",
        climate: "Hoy los cielos fluyen con una vibración excepcionalmente elevada y mística. Neptuno suaviza la disciplina de Saturno, permitiendo que nuestra intuición se profundice y que los canales espirituales se abran de par en par. Es un portal de oro para la imaginación activa, lecturas de tarot y análisis de sueños.",
        transits: [
          { aspect: "Luna en Trígono con Neptuno", influence: "Profundiza la empatía emocional, los sueños vívidos y nuestra sensibilidad psíquica innata. Un flujo de alta magia cósmica.", score: 5 },
          { aspect: "Sun Sextil Urano", influence: "Aporta chispas de despertar interior, ideas espirituales inesperadas y avances creativos.", score: 4 },
          { aspect: "Mercurio en Conjunción con Venus", influence: "Suaviza la comunicación cotidiana. Las palabras fluyen con compasión y gracia estética.", score: 4 }
        ],
        advice: "Evita forzar situaciones o caer en rigideces hoy. Déjate flotar con gracia. El cosmos te susurra que las respuestas que buscas no se encuentran en la lucha racional, sino en la receptividad silenciosa.",
        practice: "Enciende una vela de color amarillo, cierra los ojos y medita visualizando un océano azul profundo que representa a Neptuno. Observa tus pensamientos pasar como barcos lejanos."
      },
      {
        title: "Sol en Sextil con Marte y Júpiter",
        climate: "Una corriente solar de pura vitalidad, crecimiento y expansión domina la bóveda celeste. Los elementos de Fuego y Aire están en perfecta sincronía. Es un momento propicio para iniciar proyectos espirituales, actuar conforme al dictado de tu alma y declarar intenciones.",
        transits: [
          { aspect: "Sol Sextil Marte", influence: "Aporta coraje enfocado, vitalidad física robusta y un impulso interno para disolver cualquier estancamiento.", score: 5 },
          { aspect: "Luna Sextil Júpiter", influence: "Expande el centro del corazón, incrementa la generosidad emocional y nos sintoniza con la frecuencia de la abundancia.", score: 4 },
          { aspect: "Saturno Retrógrado en Piscis", influence: "Demanda una revisión estructural de nuestras creencias internas para construir cimientos sólidos.", score: 3 }
        ],
        advice: "Canaliza este fuego activo en devoción consciente. Evita discusiones o dispersión de energía; el flujo cósmico es inmenamente creativo si lo concentras en un solo propósito elevado.",
        practice: "Escribe 3 propósitos activos en un papel, sosténlo cerca de un cuarzo o cristal y visualízate dando pasos firmes y seguros para materializar tus sueños."
      },
      {
        title: "Venus en Cuadratura con Plutón",
        climate: "El cosmos remueve hoy aguas emocionales profundas. Plutón nos exige honestidad radical y transmutación en la forma en que nos valoramos y nos relacionamos con el prójimo. No temas a las sombras que emergen; son solo porciones de tu luz sagrada esperando ser integradas.",
        transits: [
          { aspect: "Venus Cuadratura Plutón", influence: "Intensifica los deseos del alma, expone apegos sutiles y nos invita a sanar viejas dinámicas relacionales.", score: 2 },
          { aspect: "Luna en Conjunción con Saturno", influence: "Genera una sensación pasajera de soledad o melancolía, invitándote a hallar tu propio refugio espiritual.", score: 3 },
          { aspect: "Neptuno Sextil Plutón", influence: "Aspecto generacional que transmuta los dolores colectivos en renacimiento intuitivo y amor universal.", score: 5 }
        ],
        advice: "Respira hondo cada vez que sientas una tensión emocional. La influencia de Plutón no es un castigo, sino un fuego sagrado alquímico diseñado para purificar tu esencia.",
        practice: "Práctica respiración cuadrada durante 5 minutos. Escribe en un papel un viejo dolor emocional que desees soltar y, con cuidado, tritúralo o quémalo como un acto de liberación simbólica."
      },
      {
        title: "Mercurio en Trígono con Saturno en Signos de Aire",
        climate: "Un día de profunda claridad mental, lógica enlazada con sabiduría ancestral y pensamiento estructurado. El viento cósmico se calma y el intelecto se agudiza. Es ideal para el estudio sagrado, la contemplación cabalística o la organización de tu progreso.",
        transits: [
          { aspect: "Mercurio Trígono Saturno", influence: "Potencia la concentración mental, la disciplina del estudio y la habilidad de plasmar misterios complejos en palabras sencillas.", score: 5 },
          { aspect: "Sol Conjunción Mercurio", influence: "Ilumina el intelecto. Una alineación de gran poder para la escritura inspirada, la oratoria y las decisiones lúcidas.", score: 4 },
          { aspect: "Luna Trígono Marte", influence: "Inyecta un impulso resolutivo ideal para ejecutar tareas con agilidad y elegancia, eliminando la pereza.", score: 4 }
        ],
        advice: "Dedica un espacio del día a la lectura consciente. Los astros bendicen hoy la investigación de sistemas antiguos de sabiduría (Cábala, Numerología o geometría sagrada).",
        practice: "Pasa 10 minutos en silencio absoluto contemplando un símbolo sagrado. Luego, escribe una lista de las ideas que consideras bases fundamentales para tu paz."
      }
    ];
    const sel = options[seed];
    transitTitle = sel.title;
    generalClimate = sel.climate;
    transits = sel.transits;
    advice = sel.advice;
    recommendedPractice = sel.practice;
  }

  return {
    date: today.toISOString().split("T")[0],
    transitTitle,
    generalClimate,
    transits,
    advice,
    recommendedPractice,
    isFallback: true
  };
}

/* API ENDPOINTS */

const getLanguageInstruction = (lang?: string) => {
  const l = (lang || "es").toLowerCase();
  if (l === "en") {
    return "All response texts (including titles, descriptions, reflections, names, keys, advices, meanings, quotes, mantras, practicalActions, blessings, sefirot, pathDescription, runes, summary, interpretations, etc.) MUST be written in English. Do NOT use Spanish.";
  }
  if (l === "pt") {
    return "All response texts (including titles, descriptions, reflections, names, keys, advices, meanings, quotes, mantras, practicalActions, blessings, sefirot, pathDescription, runes, summary, interpretations, etc.) MUST be written in Portuguese. Do NOT use Spanish.";
  }
  return "All response texts (including titles, descriptions, reflections, names, keys, advices, meanings, quotes, mantras, practicalActions, blessings, sefirot, pathDescription, runes, summary, interpretations, etc.) MUST be written in Spanish.";
};

// 1. Mood-Based Daily Zen Advice & Breathing Exercise
app.post("/api/zen-advice", async (req, res) => {
  const { mood, stressLevel, language } = req.body;
  const stress = stressLevel || 5;
  const userMood = mood || "neutral";

  try {
    const prompt = `Actúa como un sabio maestro zen, mentor de mindfulness y terapeuta holístico.
A partir de mi estado de ánimo actual: "${userMood}" y mi nivel de estrés: ${stress}/10, genera un reporte inspirador, altamente espiritual y reconfortante.
${getLanguageInstruction(language)}
Debes devolver la respuesta en formato JSON con la siguiente estructura exacta:
{
  "title": "Un título corto y poético para mi meditación u enfoque de hoy",
  "reflection": "Una reflexión profunda, poética y sanadora de 2 o 3 párrafos cortos que hable sobre mi estado de ánimo actual y cómo transformarlo en paz.",
  "mindfulnessExercise": {
    "name": "Nombre de un ejercicio de respiración o mindfulness personalizado",
    "description": "Explicación paso a paso de cómo realizar este ejercicio de respiración consciente, meditación o técnica corporal de 5 minutos, adaptado a mi nivel de estrés.",
    "durationMinutes": 5
  },
  "mantra": "Un mantra poderoso y corto que pueda repetir hoy en momentos de agitación.",
  "practicalActions": [
    "Acción práctica 1 concreta y simple para hoy (ej. tomar un té de hierbas, caminar 5 minutos descalzo, etc.)",
    "Acción práctica 2 concreta y simple para hoy",
    "Acción práctica 3 concreta y simple para hoy"
  ]
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            reflection: { type: Type.STRING },
            mindfulnessExercise: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                durationMinutes: { type: Type.INTEGER }
              },
              required: ["name", "description"]
            },
            mantra: { type: Type.STRING },
            practicalActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "reflection", "mindfulnessExercise", "mantra", "practicalActions"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.warn("Falling back to procedural Zen Advice due to Gemini error:", err.message || err);
    const fallback = getProceduralZenAdvice(userMood, stress, language);
    res.json(fallback);
  }
});

// 2. Tarot Reading
app.post("/api/tarot", async (req, res) => {
  const { question, spreadType, language } = req.body;
  const type = spreadType || "3-card";
  const userQuestion = question || "Guía general para mi momento actual.";

  // Determine card draw count
  const cardCount = type === "1-card" ? 1 : type === "3-card" ? 3 : 5;
  const drawnCards = drawTarot(cardCount);

  try {
    const cardsListStr = drawnCards.map((c, i) => `${i + 1}. ${c.name} (${c.isReversed ? "Invertida" : "Derecha"})`).join(", ");
    const prompt = `Actúa como una tarotista intuitiva, compasiva y profundamente conectada con los arquetipos junguianos y la cábala.
He realizado una lectura de tarot de tipo "${type}" para responder a la siguiente pregunta: "${userQuestion}".
Las cartas que han salido aleatoriamente del mazo son: [${cardsListStr}].

Escribe una lectura de tarot hermosa, mística, terapéutica y motivadora. Evita predicciones fatalistas; enfócate en el autoconocimiento, el libre albedrío y el crecimiento interior.
${getLanguageInstruction(language)}
Devuelve el resultado estructurado en JSON con el siguiente formato exacto:
{
  "summary": "Un resumen místico e inspirador de la lectura completa (1 o 2 párrafos).",
  "interpretations": [
    {
      "cardName": "Nombre de la carta (ej: El Loco)",
      "positionName": "La posición en la tirada (ej: Pasado, Presente, Futuro, o Aspecto Favorable, Obstáculo si es tirada de 1 o 5 cartas)",
      "isReversed": true o false,
      "meaning": "Explicación mística e íntima de cómo esta carta responde a la pregunta en su posición actual."
    }
  ],
  "advice": "El consejo definitivo de las cartas para superar mis tensiones o avanzar con confianza."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            interpretations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cardName: { type: Type.STRING },
                  positionName: { type: Type.STRING },
                  isReversed: { type: Type.BOOLEAN },
                  meaning: { type: Type.STRING }
                },
                required: ["cardName", "positionName", "meaning"]
              }
            },
            advice: { type: Type.STRING }
          },
          required: ["summary", "interpretations", "advice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    // Attach the drawn cards raw details so client can display icons or state
    res.json({
      ...result,
      drawnCards
    });
  } catch (err: any) {
    console.warn("Falling back to procedural Tarot due to Gemini error:", err.message || err);
    const fallback = getProceduralTarot(userQuestion, type, drawnCards, language);
    res.json({
      ...fallback,
      drawnCards
    });
  }
});

// 3. Norse Runes Reading
app.post("/api/runes", async (req, res) => {
  const { question, spreadType, language } = req.body;
  const type = spreadType || "3-runes";
  const userQuestion = question || "Guía rúnica general.";

  const runeCount = type === "1-rune" ? 1 : 3;
  const drawn = drawRunes(runeCount);

  try {
    const runesListStr = drawn.map((r, i) => `${i + 1}. ${r.name} - Símbolo: ${r.symbol} (${r.isReversed ? "Invertida" : "Derecha"})`).join(", ");
    const prompt = `Actúa como un Völva (sabio o vidente de las runas nórdicas) y erudito del misticismo de Odín.
He realizado una lectura rúnica de tipo "${type}" para la pregunta: "${userQuestion}".
Las runas extraídas del saquito de madera son: [${runesListStr}].

Escribe una interpretación rúnica rústica, profunda, conectada con las fuerzas de la naturaleza (viento, hielo, fuego, tierra) y el Yggdrasil. No utilices predicciones fatalistas, sino consejos de sabiduría vikinga (Hávamál) y auto-superación.
${getLanguageInstruction(language)}
Devuelve el resultado en JSON con el formato:
{
  "summary": "Un resumen épico, sabio y natural de la lectura completa (1 o 2 párrafos).",
  "interpretations": [
    {
      "runeName": "Nombre de la runa (ej: Fehu)",
      "symbol": "Símbolo de la runa (ej: ᚠ)",
      "position": "Rol en la tirada (ej: Origen, Desafío, Guía)",
      "isReversed": true o false,
      "meaning": "Explicación sobre el mensaje ancestral de esta runa en relación con la pregunta."
    }
  ],
  "advice": "El consejo rúnico final (un proverbio de sabiduría vikinga adaptado al presente del consultante)."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            interpretations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  runeName: { type: Type.STRING },
                  symbol: { type: Type.STRING },
                  position: { type: Type.STRING },
                  isReversed: { type: Type.BOOLEAN },
                  meaning: { type: Type.STRING }
                },
                required: ["runeName", "symbol", "position", "meaning"]
              }
            },
            advice: { type: Type.STRING }
          },
          required: ["summary", "interpretations", "advice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({
      ...result,
      drawn
    });
  } catch (err: any) {
    console.warn("Falling back to procedural Runes due to Gemini error:", err.message || err);
    const fallback = getProceduralRunes(userQuestion, type, drawn, language);
    res.json({
      ...fallback,
      drawn
    });
  }
});

// 4. Numerology Report
app.post("/api/numerology", async (req, res) => {
  const { fullName, birthDate, language } = req.body;
  if (!fullName || !birthDate) {
    return res.status(400).json({ error: true, message: "Nombre y fecha son requeridos." });
  }

  const scores = calculateNumerology(fullName, birthDate);

  try {
    const prompt = `Actúa como un numerólogo pitagórico y cabalista experto.
El consultante es "${fullName}", nacido el "${birthDate}".
Hemos calculado matemáticamente los siguientes números vibracionales clave para esta persona:
- Número de Sendero de Vida (Life Path Number): ${scores.lifePath} (representa la misión y el camino de vida).
- Número de Expresión (Expression Number): ${scores.expression} (los talentos y la personalidad exterior).
- Número de Deseo del Alma (Soul Urge / Heart's Desire): ${scores.soulUrge} (las motivaciones íntimas, lo que el alma anhela).
- Número de Personalidad (Personality Number): ${scores.personality} (cómo lo perciben los demás).

Escribe un informe numerológico fascinante, detallado, espiritualmente enriquecedor y redactado con elegancia.
${getLanguageInstruction(language)}
Devuelve el resultado en JSON con el formato:
{
  "introduction": "Un saludo personalizado analizando la sonoridad y energía cósmica del nombre y su vibración general.",
  "lifePathInterpretation": "Análisis profundo de la misión de vida asociada al número ${scores.lifePath}. Cuáles son sus mayores fortalezas, su karma latente y sus desafíos.",
  "expressionInterpretation": "Análisis del número de expresión ${scores.expression}, explicando sus habilidades innatas y cómo se proyecta profesional y socialmente.",
  "soulUrgeInterpretation": "La vibración secreta de su alma (${scores.soulUrge}), qué anhelos profundos guían sus decisiones más íntimas y qué necesita para sentirse pleno.",
  "personalityInterpretation": "Análisis de su número de personalidad ${scores.personality}, explaining el filtro o máscara social y cómo interactúa con el mundo exterior.",
  "cosmicAdvice": "Un consejo de alineación cósmica final para que aproveche estas vibraciones a su favor en este año."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING },
            lifePathInterpretation: { type: Type.STRING },
            expressionInterpretation: { type: Type.STRING },
            soulUrgeInterpretation: { type: Type.STRING },
            personalityInterpretation: { type: Type.STRING },
            cosmicAdvice: { type: Type.STRING }
          },
          required: ["introduction", "lifePathInterpretation", "expressionInterpretation", "soulUrgeInterpretation", "personalityInterpretation", "cosmicAdvice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({
      ...result,
      scores
    });
  } catch (err: any) {
    console.warn("Falling back to procedural Numerology due to Gemini error:", err.message || err);
    const fallback = getProceduralNumerology(fullName, birthDate, scores, language);
    res.json({
      ...fallback,
      scores
    });
  }
});

// 5. Tree of Life (Kabbalah Alignment)
app.post("/api/tree-of-life", async (req, res) => {
  const { birthDate, focusArea, language } = req.body;
  const area = focusArea || "Desarrollo Espiritual";

  // Use date numbers to find an aligned "Active Sefirah"
  const cleanDate = (birthDate || "2000-01-01").replace(/[^0-9]/g, "");
  const sumDateDigits = cleanDate.split("").reduce((sum, c) => sum + Number(c), 0);
  // Match index (0 to 9) for 10 Sefirot
  const sefirahIndex = sumDateDigits % 10;

  const sefirotList = [
    { name: "Keter", archetype: "La Corona", value: "Consciencia Suprema, Voluntad divina, el Origen" },
    { name: "Chokhmah", archetype: "La Sabiduría", value: "Inspiración pura, fuerza creativa, intuición" },
    { name: "Binah", archetype: "La Comprensión", value: "Estructura, entendimiento lógico, la gran madre" },
    { name: "Chesed", archetype: "La Misericordia", value: "Amor ilimitado, generosidad, expansión" },
    { name: "Gevurah", archetype: "La Severidad / Fuerza", value: "Disciplina, justicia, límites, rigor" },
    { name: "Tiferet", archetype: "La Belleza", value: "Equilibrio, corazón, armonía, autoconocimiento" },
    { name: "Netzah", archetype: "La Victoria", value: "Emociones, persistencia, pasión, fuerza artística" },
    { name: "Hod", archetype: "El Esplendor", value: "Intelecto, comunicación, verdad, magia práctica" },
    { name: "Yesod", archetype: "El Fundamento", value: "Inconsciente, sueños, energía psíquica, canalización" },
    { name: "Malkuth", archetype: "El Reino", value: "El mundo físico, manifestación real, conexión con la tierra" }
  ];

  const activeSefirah = sefirotList[sefirahIndex];

  try {
    const prompt = `Actúa como un místico cabalista, psicólogo transpersonal y guía espiritual.
El consultante nació el "${birthDate}" y tiene un enfoque prioritario en la siguiente área de vida: "${area}".
A través de la cábala numérica, hemos determinado que su Sefirah predominante o "vibración de alineación" actual es:
"${activeSefirah.name}" (${activeSefirah.archetype}), que rige: "${activeSefirah.value}".

Por favor, genera un mapa de alineación espiritual y meditación cabalística en base al Árbol de la Vida.
${getLanguageInstruction(language)}
Devuelve el resultado en JSON con el formato:
{
  "alignmentExplanation": "Un análisis místico, poético y alentador de cómo se relaciona su fecha de nacimiento y su Sefirah activa '${activeSefirah.name}' con su área de enfoque '${area}'.",
  "sefirotMap": [
    {
      "sefirah": "Nombre de la Sefirah (ej: Tiferet)",
      "strength": "Explicación de cómo esta fuerza se manifiesta en la psicología del consultante para el área de ${area}.",
      "shadow": "El desafío, exceso o sombra de esta Sefirah que debe equilibrar (ej: el exceso de rigor en Gevurah, o la dispersión en Netzah)."
    }
  ],
  "kabbalisticMeditation": {
    "title": "Nombre de una visualización o meditación cabalística sagrada",
    "practice": "Guía detallada paso a paso para meditar en la Sefirah '${activeSefirah.name}', conectando con las energías divinas y destrabando el canal de manifestación."
  },
  "blessing": "Una bendición mística cabalística o frase de poder basada en las letras hebreas o las esferas del Árbol."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            alignmentExplanation: { type: "STRING" },
            sefirotMap: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  sefirah: { type: "STRING" },
                  strength: { type: "STRING" },
                  shadow: { type: "STRING" }
                },
                required: ["sefirah", "strength", "shadow"]
              }
            },
            kabbalisticMeditation: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                practice: { type: "STRING" }
              },
              required: ["title", "practice"]
            },
            blessing: { type: "STRING" }
          },
          required: ["alignmentExplanation", "sefirotMap", "kabbalisticMeditation", "blessing"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({
      ...result,
      activeSefirah
    });
  } catch (err: any) {
    console.warn("Falling back to procedural Tree of Life due to Gemini error:", err.message || err);
    const fallback = getProceduralTreeOfLife(birthDate, area, activeSefirah, language);
    res.json({
      ...fallback,
      activeSefirah
    });
  }
});

// 6. Custom Affirmations based on Mood / Stress
// (Provides direct tailored text, used for personalized notifications & daily affirmations)
app.post("/api/affirmations", async (req, res) => {
  const { mood, stressLevel } = req.body;
  const userMood = mood || "neutral";
  const userStress = stressLevel || "moderado";

  try {
    const prompt = `Actúa como un consejero de mindfulness y bienestar emocional.
El usuario se siente con un ánimo de tipo "${userMood}" y tiene un nivel de estrés o cansancio de tipo "${userStress}".

Genera una lista de 5 afirmaciones poderosas y un recordatorio de notificación de atención plena.
Devuelve el resultado en JSON con el formato:
{
  "theme": "El tema o enfoque energético de hoy (ej: Soltar el Control, Conexión y Paz, Fuerza Interior)",
  "affirmations": [
    "Afirmación 1 de alta frecuencia y escrita en primera persona del presente (ej. 'Respiro hondo y elijo liberar la tensión de mis hombros.')",
    "Afirmación 2",
    "Afirmación 3",
    "Afirmación 4",
    "Afirmación 5"
  ],
  "notificationText": "Un mensaje de notificación de mindfulness hermoso y corto (menos de 100 caracteres) para enviarle al usuario durante el día como pausa de conciencia."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING },
            affirmations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            notificationText: { type: Type.STRING }
          },
          required: ["theme", "affirmations", "notificationText"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.warn("Falling back to procedural Affirmations due to Gemini error:", err.message || err);
    const fallback = getProceduralAffirmations(userMood, userStress);
    res.json(fallback);
  }
});

// 7. Interactive Mindfulness Articles Expansion
app.post("/api/articles/expand", async (req, res) => {
  const { title, language } = req.body;
  if (!title) {
    return res.status(400).json({ error: true, message: "Título del artículo es requerido." });
  }

  try {
    const prompt = `Actúa como un escritor experto en budismo, zen, bienestar mental y técnicas de reducción de estrés.
Escribe un artículo de blog extenso y bellamente estructurado (alrededor de 300-400 palabras) sobre el siguiente tema de mindfulness: "${title}".
El tono debe ser minimalista, elegante, acogedor y profundamente educativo.
${getLanguageInstruction(language)}

Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "title": "El título final estilizado del artículo",
  "intro": "Párrafo introductorio poético que ancla al lector en la importancia de este tema.",
  "sections": [
    {
      "heading": "Subtítulo de la Sección 1 (ej: El Arte de la Respiración Consciente)",
      "content": "Contenido detallado y reflexivo para esta sección (1 o 2 párrafos completos)."
    },
    {
      "heading": "Subtítulo de la Sección 2",
      "content": "Contenido detallado y reflexivo para esta sección (1 o 2 párrafos completos)."
    }
  ],
  "practice": "Una práctica diaria de 1 minuto para poner en marcha hoy mismo relacionada con este tema.",
  "quote": "Una cita budista o zen de inspiración (real o inspirada en la tradición)."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["heading", "content"]
              }
            },
            practice: { type: Type.STRING },
            quote: { type: Type.STRING }
          },
          required: ["title", "intro", "sections", "practice", "quote"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.warn("Falling back to procedural Article Expansion due to Gemini error:", err.message || err);
    const fallback = getProceduralArticleExpansion(title, language);
    res.json(fallback);
  }
});

// 8. Daily Astrological Transits
app.post("/api/astrology", async (req, res) => {
  const { language } = req.body;
  const lang = language || "es";

  try {
    const prompt = `Actúa como un astrólogo profesional místico, erudito de la astrología humanista y psicológica.
Genera los tránsitos astrológicos y el clima cósmico actual del día.
El tono debe ser poético, místico, sabio y alentador.
${getLanguageInstruction(lang)}

Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "transitTitle": "Un título corto y místico para la configuración celeste de hoy (ej: Luna en Trígono con Neptuno)",
  "generalClimate": "Un párrafo descriptivo y poético sobre la vibración general de hoy y el estado de la bóveda celeste (alrededor de 60-80 palabras).",
  "transits": [
    {
      "aspect": "Nombre del aspecto planetario (ej: Sol en Sextil con Marte)",
      "influence": "Descripción mística e influencia en nuestra vida interior (1 o 2 frases).",
      "score": 4
    }
  ],
  "advice": "Un consejo astrológico profundo y práctico para guiar nuestra conciencia en el día de hoy.",
  "recommendedPractice": "Una pequeña práctica de mindfulness o ritual zen para realizar hoy sintonizado con esta energía."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transitTitle: { type: Type.STRING },
            generalClimate: { type: Type.STRING },
            transits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  aspect: { type: Type.STRING },
                  influence: { type: Type.STRING },
                  score: { type: Type.INTEGER }
                },
                required: ["aspect", "influence", "score"]
              }
            },
            advice: { type: Type.STRING },
            recommendedPractice: { type: Type.STRING }
          },
          required: ["transitTitle", "generalClimate", "transits", "advice", "recommendedPractice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({
      ...result,
      date: new Date().toISOString().split("T")[0]
    });
  } catch (err: any) {
    console.warn("Falling back to procedural Astrology due to Gemini error:", err.message || err);
    const fallback = getProceduralAstrology(lang);
    res.json(fallback);
  }
});

// Zodiac Sign calculation and procedural generator helper functions
function getZodiacSign(dateStr: string): string {
  if (!dateStr) return "aries";
  const parts = dateStr.split("-");
  if (parts.length < 3) return "aries";
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day)) return "aries";

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  return "pisces";
}

function getProceduralZodiac(birthDate: string, language: string) {
  const sign = getZodiacSign(birthDate);
  const isEn = language === "en";
  const isPt = language === "pt";

  const signNames: any = {
    aries: { es: "Aries ♈", en: "Aries ♈", pt: "Áries ♈" },
    taurus: { es: "Tauro ♉", en: "Taurus ♉", pt: "Touro ♉" },
    gemini: { es: "Géminis ♊", en: "Gemini ♊", pt: "Gêmeos ♊" },
    cancer: { es: "Cáncer ♋", en: "Cancer ♋", pt: "Câncer ♋" },
    leo: { es: "Leo ♌", en: "Leo ♌", pt: "Leão ♌" },
    virgo: { es: "Virgo ♍", en: "Virgo ♍", pt: "Virgem ♍" },
    libra: { es: "Libra ♎", en: "Libra ♎", pt: "Libra ♎" },
    scorpio: { es: "Escorpio ♏", en: "Scorpio ♏", pt: "Escorpião ♏" },
    sagittarius: { es: "Sagitario ♐", en: "Sagittarius ♐", pt: "Sagitário ♐" },
    capricorn: { es: "Capricornio ♑", en: "Capricorn ♑", pt: "Capricórnio ♑" },
    aquarius: { es: "Acuario ♒", en: "Aquarius ♒", pt: "Aquário ♒" },
    pisces: { es: "Piscis ♓", en: "Pisces ♓", pt: "Peixes ♓" },
  };

  const elements: any = {
    aries: { es: "Fuego (Iniciación y Coraje)", en: "Fire (Initiation & Courage)", pt: "Fogo (Iniciação e Coragem)" },
    taurus: { es: "Tierra (Estabilidad y Sensualidad)", en: "Earth (Stability & Sensuality)", pt: "Terra (Estabilidade e Sensualidade)" },
    gemini: { es: "Aire (Intelecto y Versatilidad)", en: "Air (Intellect & Versatility)", pt: "Ar (Intelecto e Versatilidade)" },
    cancer: { es: "Agua (Emoción y Nutrición)", en: "Water (Emotion & Nurture)", pt: "Água (Emoção e Nutrição)" },
    leo: { es: "Fuego (Brillo y Expresión)", en: "Fire (Radiance & Expression)", pt: "Fogo (Brilho e Expressão)" },
    virgo: { es: "Tierra (Análisis y Purificación)", en: "Earth (Analysis & Purification)", pt: "Terra (Análise e Purificação)" },
    libra: { es: "Aire (Armonía y Relación)", en: "Air (Harmony & Relationship)", pt: "Ar (Harmonia e Relação)" },
    scorpio: { es: "Agua (Transmutación y Misterio)", en: "Water (Transmutation & Mystery)", pt: "Água (Transmutação e Mistério)" },
    sagittarius: { es: "Fuego (Búsqueda y Filosofía)", en: "Fire (Search & Philosophy)", pt: "Fogo (Busca e Filosofia)" },
    capricorn: { es: "Tierra (Estructura y Maestría)", en: "Earth (Structure & Mastery)", pt: "Terra (Estrutura e Maestria)" },
    aquarius: { es: "Aire (Visión y Revolución)", en: "Air (Vision & Revolution)", pt: "Ar (Visão e Revolução)" },
    pisces: { es: "Agua (Trascendencia y Disolución)", en: "Water (Transcendence & Dissolution)", pt: "Água (Trascendência e Dissolução)" },
  };

  const rulingPlanets: any = {
    aries: { es: "Marte, el impulso de vida", en: "Mars, the life impulse", pt: "Marte, o impulso da vida" },
    taurus: { es: "Venus, la belleza de la forma", en: "Venus, the beauty of form", pt: "Vênus, a beleza da forma" },
    gemini: { es: "Mercurio, el puente mental", en: "Mercury, the mental bridge", pt: "Mercúrio, a ponte mental" },
    cancer: { es: "La Luna, el útero de la memoria", en: "The Moon, the womb of memory", pt: "A Lua, o útero da memória" },
    leo: { es: "El Sol, la chispa de la conciencia", en: "The Sun, the spark of consciousness", pt: "O Sol, a centelha da consciência" },
    virgo: { es: "Mercurio, la alquimia del detalle", en: "Mercury, the alchemy of detail", pt: "Mercúrio, la alquimia del detalle" },
    libra: { es: "Venus, el espejo del alma", en: "Venus, the mirror of the soul", pt: "Vênus, o espelho da alma" },
    scorpio: { es: "Plutón, el guardián del inframundo", en: "Pluto, the guardian of the underworld", pt: "Plutão, o guardião do submundo" },
    sagittarius: { es: "Júpiter, la flecha de la fe", en: "Jupiter, the arrow of faith", pt: "Júpiter, a flecha da fé" },
    capricorn: { es: "Saturno, el señor del tiempo", en: "Saturn, the lord of time", pt: "Saturno, o senhor do tempo" },
    aquarius: { es: "Urano, el rayo de la liberación", en: "Uranus, the lightning of liberation", pt: "Urano, o raio da libertação" },
    pisces: { es: "Neptuno, el océano cósmico", en: "Neptune, the cosmic ocean", pt: "Netuno, o oceano cósmico" },
  };

  const personalities: any = {
    aries: {
      es: "Posees un espíritu pionero ardiente, empujado por la fuerza vital que rompe la inercia del invierno espiritual. Eres la primera chispa, el guerrero que busca definir su identidad mediante la acción pura.",
      en: "You possess a burning pioneering spirit, driven by the vital force that breaks the inertia of the spiritual winter. You are the first spark, the warrior seeking to define their identity through pure action.",
      pt: "Você possui um espírito pioneiro ardente, impulsionado pela força vital que quebra a inércia do inverno espiritual. Você é a primeira centelha, o guerreiro que busca definir sua identidade através da ação pura."
    },
    taurus: {
      es: "Tu alma se sintoniza con el ritmo lento de la tierra primaveral, materializando las ideas en formas bellas, estables y duraderas. Encuentras la divinidad en la naturaleza, el silencio contemplativo y los goces de la existencia terrenal.",
      en: "Your soul tunes to the slow rhythm of the spring earth, materializing ideas into beautiful, stable, and lasting forms. You find divinity in nature, contemplative silence, and the joys of earthly existence.",
      pt: "Sua alma sintoniza com o ritmo lento da terra primaveral, materializando ideias em formas belas, estáveis e duradouras. Você encontra a divindade na natureza, no silêncio contemplativo e nos prazeres da existência terrena."
    },
    gemini: {
      es: "Eres un tejedor de vientos, el mensajero alado que conecta mundos mediante la palabra y la curiosidad infinita. Tu mente es un caleidoscopio sagrado sediento de capturar el reflejo de la verdad en todas sus infinitas facetas.",
      en: "You are a weaver of winds, the winged messenger connecting worlds through the word and infinite curiosity. Your mind is a sacred kaleidoscope thirsty to capture the reflection of truth in all its infinite facets.",
      pt: "Você é um tecedor de ventos, o mensageiro alado que conecta mundos através da palavra e da curiosidade infinita. Sua mente é um caleidoscópio sagrado sedento por capturar o reflexo da verdade em todas as suas infinitas facetas."
    },
    cancer: {
      es: "Tu refugio es el océano del sentimiento profundo, el protector de la memoria del alma y el nido sagrado donde se nutre la vida. Posees una intuición psíquica tan profunda como las mareas de la Luna rítmica.",
      en: "Your shelter is the ocean of deep feeling, the protector of the soul's memory and the sacred nest where life is nurtured. You possess a psychic intuition as deep as the tides of the rhythmic Moon.",
      pt: "Seu refúgio é o oceano do sentimento profundo, o protetor da memória da alma e o ninho sagrado onde a vida é nutrida. Você possui uma intuição psíquica tão profunda quanto as marés da Lua rítmica."
    },
    leo: {
      es: "Llevas en el corazón la hoguera de la soberanía interior y la luz creativa. Eres el Sol que busca expresarse sin máscaras, derramando generosidad, nobleza y calor espiritual a todo lo que te rodea.",
      en: "You carry in your heart the bonfire of inner sovereignty and creative light. You are the Sun seeking to express itself without masks, pouring generosity, nobility, and spiritual warmth on all around you.",
      pt: "Você carrega no coração a fogueira da soberania interior e a luz criativa. Você é o Sol que busca se expressar sem máscaras, derramando generosidade, nobreza e calor espiritual a tudo que o cerca."
    },
    virgo: {
      es: "Eres el purificador del templo, el devoto que busca el orden cósmico en los pequeños detalles. Tu mente analítica es un instrumento de sanación y servicio sagrado, capaz de clasificar el caos en patrones armónicos.",
      en: "You are the purifier of the temple, the devotee seeking cosmic order in the small details. Your analytical mind is an instrument of healing and sacred service, capable of sorting chaos into harmonic patterns.",
      pt: "Você é o purificador do templo, o devoto que busca a ordem cósmica nos pequenos detalhes. Sua mente analítica é um instrumento de cura e serviço sagrado, capaz de classificar o caos em padrões harmônicos."
    },
    libra: {
      es: "Tu sendero es la danza sagrada del equilibrio, la búsqueda de la belleza en las relaciones y la geometría oculta de la armonía cósmica. Eres el puente de paz que reconcilia las polaridades opuestas del ser.",
      en: "Your path is the sacred dance of balance, the search for beauty in relationships and the hidden geometry of cosmic harmony. You are the bridge of peace reconciling the opposite polarities of being.",
      pt: "Seu caminho é a dança sagrada do equilíbrio, a busca da beleza nos relacionamentos e a geometria oculta da harmonia cósmica. Você é a ponte de paz que reconcilia as polaridades opostas do ser."
    },
    scorpio: {
      es: "Habitas en los misterios de la transmutación y los abismos curativos. Tu alma no teme a la muerte ni al renacimiento, poseyendo una intensidad magnética capaz de sumergirse en la sombra para rescatar el oro del espíritu.",
      en: "You dwell in the mysteries of transmutation and healing abysses. Your soul fears neither death nor rebirth, possessing a magnetic intensity capable of diving into the shadow to rescue the gold of the spirit.",
      pt: "Você habita nos mistérios da transmutação e nos abismos curativos. Sua alma não teme a morte nem o renascimento, possuindo uma intensidade magnética capaz de mergulhar na sombra para resgatar o ouro do espírito."
    },
    sagittarius: {
      es: "Eres el buscador incansable de la verdad, el centauro cuya flecha apunta a los astros de la fe y el sentido trascendental. Tu espíritu es un viento expansivo que viaja más allá de las fronteras físicas y mentales.",
      en: "You are the tireless seeker of truth, the centaur whose arrow points to the stars of faith and transcendental meaning. Your spirit is an expansive wind traveling beyond physical and mental borders.",
      pt: "Você é o buscador incansável da verdade, o centauro cuja flecha aponta para as estrelas da fé e do sentido transcendental. Seu espírito é um vento expansivo que viaja além das fronteiras físicas e mentais."
    },
    capricorn: {
      es: "Construyes tu fortaleza en la roca firme del tiempo y la disciplina. Tu sendero es el ascenso perseverante de la montaña de la maestría interior, asumiendo la responsabilidad sagrada del orden y la estructura en el plano terrenal.",
      en: "You build your fortress on the solid rock of time and discipline. Your path is the persevering ascent of the mountain of inner mastery, assuming the sacred responsibility for order and structure in the earthly plane.",
      pt: "Você constrói sua fortaleza na rocha firme do tempo e da disciplina. Seu caminho é a subida perseverante da montanha da maestria interior, assumindo a responsabilidade sagrada da ordem e da estrutura no plano terreno."
    },
    aquarius: {
      es: "Eres el aguador cósmico, el visionario que derrama las aguas de la conciencia del futuro sobre la humanidad sedienta. Tu mente rompe dogmas y estructuras obsoletas para dar paso a la fraternidad universal y la revolución espiritual.",
      en: "You are the cosmic water bearer, the visionary pouring the waters of future consciousness upon thirsty humanity. Your mind breaks obsolete dogmas and structures to make way for universal brotherhood and spiritual revolution.",
      pt: "Você é o aguador cósmico, o visionário que derrama as águas da consciência do futuro sobre a humanidade sedenta. Sua mente quebra dogmas e estruturas obsoletas para dar lugar à fraternidade universal e à revolução espiritual."
    },
    pisces: {
      es: "Tu alma es el gran océano místico donde todos los ríos del zodiaco se disuelven y regresan a la unidad divina. Eres la compasión infinita, la sensibilidad psíquica pura que sueña los sueños del Creador y fluye sin barreras.",
      en: "Your soul is the great mystical ocean where all the rivers of the zodiac dissolve and return to divine unity. You are infinite compassion, pure psychic sensitivity dreaming the dreams of the Creator and flowing without barriers.",
      pt: "Sua alma é o grande oceano místico onde todos os rios do zodíaco se dissolvem e retornam à unidade divina. Você é a compaixão infinita, a sensibilidade psíquica pura que sonha os sonhos do Criador e flui sem barreiras."
    }
  };

  const strengths: any = {
    aries: {
      es: ["Iniciativa imparable", "Coraje audaz", "Pasión contagiosa", "Liderazgo natural"],
      en: ["Unstoppable initiative", "Bold courage", "Contagious passion", "Natural leadership"],
      pt: ["Iniciativa imparável", "Coragem audaz", "Paixão contagiosa", "Liderança natural"]
    },
    taurus: {
      es: ["Paciencia sabia", "Fidelidad inquebrantable", "Sentido estético", "Perseverancia firme"],
      en: ["Wise patience", "Unwavering fidelity", "Aesthetic sense", "Firm perseverance"],
      pt: ["Paciência sábia", "Fidelidade inabalável", "Sentido estético", "Perseverança firme"]
    },
    gemini: {
      es: ["Mente brillante", "Adaptabilidad veloz", "Elocuencia mágica", "Entusiasmo contagioso"],
      en: ["Brilliant mind", "Fast adaptability", "Magical eloquence", "Contagious enthusiasm"],
      pt: ["Mente brilhante", "Adaptabilidade veloz", "Eloquência mágica", "Entusiasmo contagioso"]
    },
    cancer: {
      es: ["Compasión infinita", "Memoria emocional", "Protección maternal", "Intuición mística"],
      en: ["Infinite compassion", "Emotional memory", "Maternal protection", "Mystical intuition"],
      pt: ["Compaixão infinita", "Memória emocional", "Proteção maternal", "Intuição mística"]
    },
    leo: {
      es: ["Magnetismo solar", "Nobleza de espíritu", "Generosidad dorada", "Poder creativo"],
      en: ["Solar magnetism", "Nobility of spirit", "Golden generosity", "Creative power"],
      pt: ["Magnetismo solar", "Nobreza de espírito", "Generosidade dourada", "Poder criativo"]
    },
    virgo: {
      es: ["Atención sagrada", "Discernimiento agudo", "Espíritu de servicio", "Sanación intuitiva"],
      en: ["Sacred attention", "Sharp discernment", "Service spirit", "Intuitive healing"],
      pt: ["Atenção sagrada", "Discernimento agudo", "Espírito de serviço", "Cura intuitiva"]
    },
    libra: {
      es: ["Sentido de justicia", "Diplomacia exquisita", "Gracia artística", "Armonía interior"],
      en: ["Sense of justice", "Exquisite diplomacy", "Artistic grace", "Inner harmony"],
      pt: ["Sentido de justiça", "Diplomacia requintada", "Graça artística", "Harmonia interior"]
    },
    scorpio: {
      es: ["Fuerza transformadora", "Lealtad profunda", "Enfoque implacable", "Alquimia emocional"],
      en: ["Transformative force", "Deep loyalty", "Relentless focus", "Emotional alchemy"],
      pt: ["Força transformadora", "Lealdade profunda", "Foco implacável", "Alquimia emocional"]
    },
    sagittarius: {
      es: ["Optimismo sagrado", "Sabiduría filosófica", "Generosidad vital", "Espíritu libre"],
      en: ["Sacred optimism", "Philosophical wisdom", "Vital generosity", "Free spirit"],
      pt: ["Otimismo sagrado", "Sabedoria filosófica", "Generosidade vital", "Espírito livre"]
    },
    capricorn: {
      es: ["Disciplina regia", "Responsabilidad sabia", "Perseverancia de montaña", "Integridad noble"],
      en: ["Regal discipline", "Wise responsibility", "Mountain perseverance", "Noble integrity"],
      pt: ["Disciplina régia", "Responsabilidade sábia", "Perseverança de montanha", "Integridade nobre"]
    },
    aquarius: {
      es: ["Visión humanitaria", "Originalidad pura", "Independencia mental", "Genio revolucionario"],
      en: ["Humanitarian vision", "Pure originality", "Mental independence", "Revolutionary genius"],
      pt: ["Visão humanitária", "Originalidade pura", "Independência mental", "Gênio revolucionário"]
    },
    pisces: {
      es: ["Empatía espiritual", "Imaginación mística", "Devoción pura", "Conexión cósmica"],
      en: ["Spiritual empathy", "Mystical imagination", "Pure devotion", "Cosmic connection"],
      pt: ["Empatia espiritual", "Imaginação mística", "Devoção pura", "Conexão cósmica"]
    }
  };

  const challenges: any = {
    aries: {
      es: ["Impaciencia impulsiva", "Tendencia a la irritación", "Dificultad para terminar tareas"],
      en: ["Impulsive impatience", "Tendency to irritation", "Difficulty finishing tasks"],
      pt: ["Impaciência impulsiva", "Tendência à irritação", "Dificuldade para terminar tarefas"]
    },
    taurus: {
      es: ["Apego posesivo", "Resistencia extrema al cambio", "Rigidez de opinión"],
      en: ["Possessive attachment", "Extreme resistance to change", "Rigidity of opinion"],
      pt: ["Apego possessivo", "Resistência extrema à mudança", "Rigidez de opinião"]
    },
    gemini: {
      es: ["Dispersión de energía", "Inconstancia mental", "Falta de profundidad inicial"],
      en: ["Energy dispersion", "Mental inconstancy", "Lack of initial depth"],
      pt: ["Dispersão de energia", "Inconstância mental", "Falta de profundidade inicial"]
    },
    cancer: {
      es: ["Fluctuaciones anímicas", "Hipersensibilidad herida", "Apego al pasado nostálgico"],
      en: ["Mood fluctuations", "Hurt hypersensitivity", "Attachment to nostalgic past"],
      pt: ["Flutuações anímicas", "Hipersensibilidade ferida", "Apego ao passado nostálgico"]
    },
    leo: {
      es: ["Orgullo excesivo", "Necesidad de aprobación constante", "Dificultad para ceder el centro"],
      en: ["Excessive pride", "Need for constant approval", "Difficulty yielding the center"],
      pt: ["Orgulho excessivo", "Necessidade de aprovação constante", "Dificuldade em ceder o centro"]
    },
    virgo: {
      es: ["Crítica perfeccionista", "Ansiedad mental por el control", "Preocupación hipocondríaca"],
      en: ["Perfectionist criticism", "Mental anxiety for control", "Hypochondriac worry"],
      pt: ["Crítica perfeccionista", "Ansiedade mental pelo controle", "Preocupação hipocondríaca"]
    },
    libra: {
      es: ["Indecisión paralizante", "Evitación temerosa del conflicto", "Dependencia de la mirada ajena"],
      en: ["Paralyzing indecision", "Fearful avoidance of conflict", "Dependence on others' gaze"],
      pt: ["Indecisão paralisante", "Evitação temorosa do conflito", "Dependência do olhar alheio"]
    },
    scorpio: {
      es: ["Celos posesivos", "Rencor acumulado difícil de soltar", "Tendencia a los extremos dramáticos"],
      en: ["Possessive jealousy", "Accumulated resentment hard to release", "Tendency to dramatic extremes"],
      pt: ["Ciúmes possessivos", "Rancor acumulado difícil de soltar", "Tendência aos extremos dramáticos"]
    },
    sagittarius: {
      es: ["Exceso de optimismo ciego", "Dogmatismo de opinión", "Evasión de los límites cotidianos"],
      en: ["Blind over-optimism", "Dogmatism of opinion", "Evasion of everyday limits"],
      pt: ["Excesso de otimismo cego", "Dogmatismo de opinião", "Evasão dos limites cotidianos"]
    },
    capricorn: {
      es: ["Rigidez fría", "Pesimismo defensivo", "Excesiva autoexigencia implacable"],
      en: ["Cold rigidity", "Defensive pessimism", "Excessive relentless self-demand"],
      pt: ["Rigidez fria", "Pessimismo defensivo", "Excessiva autoexigência implacável"]
    },
    aquarius: {
      es: ["Distanciamiento emocional frío", "Rebeldía caprichosa", "Dificultad para la intimidad tierna"],
      en: ["Cold emotional detachment", "Capricious rebelliousness", "Difficulty with tender intimacy"],
      pt: ["Distanciamento emocional frio", "Rebeldia caprichosa", "Dificuldade para a intimidade terna"]
    },
    pisces: {
      es: ["Evasión de la realidad cruda", "Sacrificio de mártir", "Dispersión de límites personales"],
      en: ["Escape from harsh reality", "Martyr sacrifice", "Dispersion of personal boundaries"],
      pt: ["Evasão da realidade crua", "Sacrifício de mártir", "Dispersão de limites pessoais"]
    }
  };

  const adviceList: any = {
    aries: {
      es: "Aprende el arte de la espera sagrada. El fuego concentrado calienta y transmuta, mientras que el fuego desbocado solo consume.",
      en: "Learn the art of sacred waiting. Concentrated fire warms and transmutes, while runaway fire only consumes.",
      pt: "Aprenda a arte da espera sagrada. O fogo concentrado aquece e transmuta, enquanto o fogo descontrolado apenas consome."
    },
    taurus: {
      es: "La verdadera estabilidad reside en fluir con el río de la impermanencia. Suelta los lazos invisibles de la posesión.",
      en: "True stability lies in flowing with the river of impermanence. Release the invisible bonds of possession.",
      pt: "A verdadeira estabilidade reside em fluir com o rio da impermanência. Solte os laços invisíveis da posse."
    },
    gemini: {
      es: "Ancla tu vuelo mental en el silencio del centro del pecho. Busca la verdad que no se puede decir con palabras, sino con presencia.",
      en: "Anchor your mental flight in the silence of the center of your chest. Seek the truth that cannot be said with words, but with presence.",
      pt: "Ancore seu voo mental no silêncio do centro do peito. Busque a verdade que não se pode dizer com palavras, mas com presença."
    },
    cancer: {
      es: "Tu hogar más seguro es tu propia presencia consciente. Aprende a maternalizar tus propias sombras sin miedo.",
      en: "Your safest home is your own conscious presence. Learn to mother your own shadows without fear.",
      pt: "Seu lar mais seguro é sua própria presença consciente. Aprenda a maternalizar suas próprias sombras sem medo."
    },
    leo: {
      es: "Tu verdadera realeza no necesita coronas ni aplausos del mundo exterior. Brilla por el puro gozo del servicio y el amor desinteresado.",
      en: "Your true royalty needs no crowns or applause from the outer world. Shine for the pure joy of service and selfless love.",
      pt: "Sua verdadeira realeza não precisa de coroas ou aplausos do mundo exterior. Brilhe pelo puro prazer do serviço e do amor desinteressado."
    },
    virgo: {
      es: "Confía en la sabiduría perfecta del caos natural. No todo necesita ser arreglado; la existencia ya es divinamente perfecta.",
      en: "Trust in the perfect wisdom of natural chaos. Not everything needs to be fixed; existence is already divinely perfect.",
      pt: "Confie na sabedoria perfeita do caos natural. Nem tudo precisa ser consertado; a existência já é divinamente perfeita."
    },
    libra: {
      es: "Decidir es un acto de amor y soberanía interior. No temas perturbar la paz exterior para salvaguardar tu verdad interna.",
      en: "Deciding is an act of love and inner sovereignty. Do not fear disturbing outer peace to safeguard your inner truth.",
      pt: "Decidir é um ato de amor e soberania interior. Não tema perturbar a paz exterior para salvaguardar sua verdade interna."
    },
    scorpio: {
      es: "Abre tus compuertas de agua profunda y permite que el perdón limpie tus canales. Quien perdona recupera el poder de su energía sagrada.",
      en: "Open your deep water floodgates and allow forgiveness to cleanse your channels. He who forgives reclaims the power of their sacred energy.",
      pt: "Abra suas comportas de água profunda e permita que o perdão limpe seus canais. Quem perdoa recupera o poder de sua energia sagrada."
    },
    sagittarius: {
      es: "La mayor aventura mística está aquí y ahora, en la respiración presente. Los límites terrenales son los peldaños de tu templo.",
      en: "The greatest mystical adventure is here and now, in the present breath. Earthly limits are the steps of your temple.",
      pt: "A maior aventura mística está aqui e agora, na respiração presente. Os limites terrenos são os degraus do seu templo."
    },
    capricorn: {
      es: "Suelta la pesada carga de sostener el mundo. Permítete ser vulnerable y humilde; el agua blanda moldea la roca más dura.",
      en: "Release the heavy burden of holding up the world. Allow yourself to be vulnerable and humble; soft water molds the hardest rock.",
      pt: "Solte o pesado fardo de sustentar o mundo. Permita-se ser vulnerável e humilde; a água macia molda a rocha mais dura."
    },
    aquarius: {
      es: "La mayor revolución comienza abriendo tu corazón a la intimidad profunda de un solo ser, en lugar de diluirte en el colectivo impersonal.",
      en: "The greatest revolution begins by opening your heart to the deep intimacy of a single being, rather than diluting yourself in the impersonal collective.",
      pt: "A maior revolução começa abrindo seu coração para a intimidade profunda de um único ser, em vez de diluir-se no coletivo impessoal."
    },
    pisces: {
      es: "Dibuja fronteras de amor para proteger tu sensibilidad sagrada. Eres un canal divino; aprende a vaciar tu copa para no abrumarte.",
      en: "Draw boundaries of love to protect your sacred sensitivity. You are a divine channel; learn to empty your cup to avoid getting overwhelmed.",
      pt: "Desenhe fronteiras de amor para proteger sua sensibilidade sagrada. Você é um canal divino; aprenda a esvaziar sua taça para não se sobrecarregar."
    }
  };

  const l = isEn ? "en" : isPt ? "pt" : "es";

  return {
    sign: sign,
    signName: signNames[sign]?.[l] || signNames[sign]?.es || sign,
    element: elements[sign]?.[l] || elements[sign]?.es || "",
    rulingPlanet: rulingPlanets[sign]?.[l] || rulingPlanets[sign]?.es || "",
    personality: personalities[sign]?.[l] || personalities[sign]?.es || "",
    strengths: strengths[sign]?.[l] || strengths[sign]?.es || [],
    challenges: challenges[sign]?.[l] || challenges[sign]?.es || [],
    advice: adviceList[sign]?.[l] || adviceList[sign]?.es || "",
    isFallback: true
  };
}

// 9. Zodiac Profile Generator API
app.post("/api/zodiac-profile", async (req, res) => {
  const { birthDate, language } = req.body;
  const lang = language || "es";
  const sign = getZodiacSign(birthDate);

  try {
    const prompt = `Actúa como un astrólogo profesional místico, erudito de la astrología humanista y psicológica.
Genera el perfil zodiacal detallado para alguien nacido el ${birthDate}, cuyo signo solar es ${sign}.
El tono debe ser poético, místico, sabio, sumamente alentador y espiritual, evitando clichés y profundizando en el viaje evolutivo del alma.
${getLanguageInstruction(lang)}

Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "signName": "Nombre místico del signo con su emoji correspondiente (ej: Cáncer ♋)",
  "element": "El elemento de la naturaleza y su energía vibracional oculta (ej: Agua (Emoción y Nutrición))",
  "rulingPlanet": "El planeta regente y la esencia mística de su fuerza (ej: La Luna, el útero de la memoria)",
  "personality": "Un párrafo extenso, místico, poético y profundo sobre el carácter sagrado, el temperamento y la misión evolutiva de este signo solar (aproximadamente 100-130 palabras).",
  "strengths": [
    "Un poder del alma o fortaleza expresada con misticismo y poesía",
    "Un segundo poder del alma místico y evocador"
  ],
  "challenges": [
    "Un desafío espiritual o sombra evolutiva a transmutar",
    "Un segundo desafío espiritual o sombra evolutiva"
  ],
  "advice": "Un consejo místico del astrólogo enfocado en cómo armonizar la energía de este signo mediante la meditación y la atención plena (mindfulness)."
}`;

    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signName: { type: Type.STRING },
            element: { type: Type.STRING },
            rulingPlanet: { type: Type.STRING },
            personality: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            challenges: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            advice: { type: Type.STRING }
          },
          required: ["signName", "element", "rulingPlanet", "personality", "strengths", "challenges", "advice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({
      ...result,
      sign
    });
  } catch (err: any) {
    console.warn("Falling back to procedural Zodiac due to Gemini error:", err.message || err);
    const fallback = getProceduralZodiac(birthDate, lang);
    res.json(fallback);
  }
});

// Visits persistence and counter logic
const VISITS_FILE = path.join(process.cwd(), "visits.json");

function getVisits(): number {
  try {
    if (fs.existsSync(VISITS_FILE)) {
      const data = fs.readFileSync(VISITS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (typeof parsed.count === "number") {
        return parsed.count;
      }
    }
  } catch (e) {
    console.error("Error reading visits file, using default:", e);
  }
  return 12847; // Default initial visits count
}

function saveVisits(count: number) {
  try {
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ count }), "utf-8");
  } catch (e) {
    console.error("Error writing visits file:", e);
  }
}

app.get("/api/visits", (req, res) => {
  const count = getVisits();
  res.json({ count });
});

app.post("/api/visits/increment", (req, res) => {
  let count = getVisits();
  count += 1;
  saveVisits(count);
  res.json({ count });
});

// Vite middleware configuration for full-stack SPA
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Momentos Zen server running on http://localhost:${PORT}`);
  });
};

startServer();
