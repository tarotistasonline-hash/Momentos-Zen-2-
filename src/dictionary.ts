export interface DictionaryEntry {
  title: string;
  subtitle: string;
  tagline: string;
  tabHome: string;
  tabTarot: string;
  tabRunes: string;
  tabKabbalah: string;
  tabNumerology: string;
  tabArticles: string;
  tabProgress: string;
  tabAstrology: string;
  zenReminder: string;
  howIsMind: string;
  howIsMindDesc: string;
  moodCalm: string;
  moodAnxious: string;
  moodSad: string;
  moodFrustrated: string;
  moodTired: string;
  moodHappy: string;
  stressLevel: string;
  generateZenBtn: string;
  generatingZen: string;
  generateZenActive: string;
  breathingTitle: string;
  breathingDesc: string;
  breathInhale: string;
  breathHold1: string;
  breathExhale: string;
  breathHold2: string;
  breathIdle: string;
  sessionLength: string;
  startBreathing: string;
  stopSession: string;
  soundMixer: string;
  soundMixerDesc: string;
  volume: string;
  soundRain: string;
  soundWaves: string;
  soundBowl: string;
  soundBirds: string;
  soundBonfire: string;
  soundCosmicWind: string;
  soundBells: string;
  soundMusic: string; // Background music
  musicVolume: string;
  astrologyTitle: string;
  astrologyDesc: string;
  astrologyBtn: string;
  astrologyLoading: string;
  astrologyResultTitle: string;
  astrologyAdviceTitle: string;
  voiceGuide: string; // Guided Voice Meditation
  voiceGuideDesc: string;
  voiceMedSession: string;
  voiceSelectSession: string;
  voiceSelectLanguage: string;
  voiceMeds: { id: string; name: string; desc: string }[];
  playVoice: string;
  playingVoice: string;
  stopVoice: string;
  tarotTitle: string;
  tarotDesc: string;
  tarotQuestionPlaceholder: string;
  tarotSpreadType: string;
  tarotCard1: string;
  tarotCard3: string;
  tarotCard5: string;
  tarotBtn: string;
  tarotLoading: string;
  tarotSummaryTitle: string;
  tarotAdviceTitle: string;
  runesTitle: string;
  runesDesc: string;
  runesQuestionPlaceholder: string;
  runesSpreadType: string;
  runesCard1: string;
  runesCard3: string;
  runesBtn: string;
  runesLoading: string;
  runesSummaryTitle: string;
  runesAdviceTitle: string;
  numTitle: string;
  numDesc: string;
  numNameLabel: string;
  numBirthLabel: string;
  numBtn: string;
  numLoading: string;
  numResultTitle: string;
  numLifePath: string;
  numExpression: string;
  numSoulUrge: string;
  numPersonality: string;
  kabTitle: string;
  kabDesc: string;
  kabAreaLabel: string;
  kabBtn: string;
  kabLoading: string;
  kabResultTitle: string;
  kabMedTitle: string;
  kabBlessingTitle: string;
  libTitle: string;
  libDesc: string;
  libReadMore: string;
  libBackBtn: string;
  libDeepKnowledge: string;
  progTitle: string;
  progDesc: string;
  progStreak: string;
  progMinutes: string;
  progActions: string;
  progNoHistory: string;
  progHistoryTitle: string;
  progStreakDays: string;
  progMinShort: string;
}

export const DICTIONARY: Record<"es" | "en" | "pt" | "de", DictionaryEntry> = {
  es: {
    title: "Momentos Zen • Música para Meditar",
    subtitle: "MÚSICA RELAX • ESPACIO DE PAZ INTERIOR",
    tagline: "Un oasis holístico interactivo con tarot, cábala, numerología y mindfulness.",
    tabHome: "Meditación",
    tabTarot: "Tarot",
    tabRunes: "Runas",
    tabKabbalah: "Cábala",
    tabNumerology: "Numerología",
    tabArticles: "Artículos",
    tabProgress: "Ángeles",
    tabAstrology: "Perfil Zodiacal",
    zenReminder: "RECORDATORIO ZEN",
    howIsMind: "¿Cómo te sentís hoy?",
    howIsMindDesc: "Selecciona tu estado emocional para recibir reflexiones y ejercicios adaptados.",
    moodCalm: "🧘 Calmado",
    moodAnxious: "😰 Ansioso",
    moodSad: "😢 Triste",
    moodFrustrated: "😤 Frustrado",
    moodTired: "😴 Cansado",
    moodHappy: "😊 Alegre",
    stressLevel: "NIVEL DE ESTRÉS / AGITACIÓN:",
    generateZenBtn: "Generar Guía Zen de Hoy",
    generatingZen: "Generando Espacio de Calma...",
    generateZenActive: "Espacio de Calma Activo",
    breathingTitle: "Respiración Zen",
    breathingDesc: "Guía de respiración cuadrada para calmar tu mente de inmediato.",
    breathInhale: "Inhala",
    breathHold1: "Retén",
    breathExhale: "Exhala",
    breathHold2: "Vacío",
    breathIdle: "Listo",
    sessionLength: "DURACIÓN DE SESIÓN:",
    startBreathing: "Comenzar Respiración",
    stopSession: "Detener Sesión",
    soundMixer: "Mezclador de Sonidos Relax",
    soundMixerDesc: "Activa y calibra sonidos ambientales para tu meditación activa.",
    volume: "Volumen",
    soundRain: "🌧️ Lluvia",
    soundWaves: "🌊 Olas de Mar",
    soundBowl: "🥣 Cuenco Tibetano",
    soundBirds: "🐦 Aves del Bosque",
    soundBonfire: "🔥 Fogata Relajante",
    soundCosmicWind: "🌌 Viento Estelar",
    soundBells: "🔔 Campanas Celestiales",
    soundMusic: "🎵 Música de Fondo",
    musicVolume: "Volumen de Música",
    astrologyTitle: "Tránsitos Astrológicos del Día",
    astrologyDesc: "Analiza el movimiento planetario actual y comprende cómo influyen las posiciones astronómicas en tu bienestar.",
    astrologyBtn: "Consultar Clima Astrológico",
    astrologyLoading: "Calculando Tránsitos Astrológicos...",
    astrologyResultTitle: "Clima Astrológico Actual",
    astrologyAdviceTitle: "Consejo del Astrólogo",
    voiceGuide: "Meditaciones por Voz",
    voiceGuideDesc: "Escucha meditaciones místicas guiadas por voz generada con técnicas de mindfulness.",
    voiceMedSession: "TEMA DE MEDITACIÓN:",
    voiceSelectSession: "Seleccionar Sesión",
    voiceSelectLanguage: "Idioma de la voz:",
    voiceMeds: [
      { id: "calm-anxiety", name: "Calmar la Ansiedad", desc: "Suaviza el torrente de pensamientos y encuentra tu centro pacífico." },
      { id: "chakra-alignment", name: "Alineación de Chakras", desc: "Visualiza y equilibra los centros energéticos de tu ser." },
      { id: "deep-sleep", name: "Conexión con el Sueño", desc: "Suelta las tensiones del día y prepárate para un descanso sagrado." },
      { id: "kabbalah-light", name: "Luz de la Cábala", desc: "Alinea tu alma con las esferas celestiales del Árbol de la Vida." }
    ],
    playVoice: "Iniciar Guía de Voz",
    playingVoice: "Reproduciendo voz...",
    stopVoice: "Detener Voz",
    tarotTitle: "Lectura del Tarot Terapéutico",
    tarotDesc: "Consulta los arquetipos sagrados para iluminar tu presente y expandir tu conciencia.",
    tarotQuestionPlaceholder: "Escribe tu pregunta o intención espiritual aquí...",
    tarotSpreadType: "TIPO DE TIRADA:",
    tarotCard1: "Una Carta (Guía de Hoy)",
    tarotCard3: "Tres Cartas (Pasado, Presente, Futuro)",
    tarotCard5: "Cinco Cartas (Cruz Cósmica)",
    tarotBtn: "Invocación de Cartas",
    tarotLoading: "Abriendo el portal de sabiduría...",
    tarotSummaryTitle: "Revelación del Tarot",
    tarotAdviceTitle: "Consejo de la Lectura",
    runesTitle: "Runas Nórdicas Ancestrales",
    runesDesc: "Accede a la sabiduría mística del Yggdrasil y el consejo directo de Odín.",
    runesQuestionPlaceholder: "Consulta a las runas nórdicas...",
    runesSpreadType: "TIPO DE LECTURA:",
    runesCard1: "Runa Única",
    runesCard3: "Consejo Rúnico Triple",
    runesBtn: "Extraer Runas",
    runesLoading: "Lanzando piedras sagradas al viento...",
    runesSummaryTitle: "Vaticinio Rúnico",
    runesAdviceTitle: "Consejo del Sabio Odín",
    numTitle: "Numerología Pitagórica",
    numDesc: "Descubre el mapa matemático y vibracional inscrito en tu nombre y fecha de nacimiento.",
    numNameLabel: "Nombre Completo (Sin acentos):",
    numBirthLabel: "Fecha de Nacimiento:",
    numBtn: "Calcular Vibración",
    numLoading: "Decodificando frecuencias cósmicas...",
    numResultTitle: "Tu Perfil Vibracional",
    numLifePath: "Misión de Vida",
    numExpression: "Habilidades Innatas",
    numSoulUrge: "Anhelos del Alma",
    numPersonality: "Máscara Social",
    kabTitle: "Cábala y Árbol de la Vida",
    kabDesc: "Determina tu Sefirah regente para alinear tu energía psicológica con el plano divino.",
    kabAreaLabel: "Área de Foco Espiritual:",
    kabBtn: "Generar Mapa de Alineación",
    kabLoading: "Mapeando esferas del Árbol...",
    kabResultTitle: "Alineación del Árbol de la Vida",
    kabMedTitle: "Meditación de Sefirah Activa",
    kabBlessingTitle: "Bendición del Árbol",
    libTitle: "Biblioteca de Mindfulness",
    libDesc: "Sabiduría ancestral y técnicas psicológicas breves para la paz interior diaria.",
    libReadMore: "Profundizar Conocimiento →",
    libBackBtn: "← Volver a la Biblioteca",
    libDeepKnowledge: "Invocando conocimiento profundo...",
    progTitle: "Bitácora de Progreso",
    progDesc: "Registra tu constancia y revive la sabiduría de tus consultas históricas.",
    progStreak: "Racha Activa",
    progMinutes: "Minutos de Meditación",
    progActions: "Acciones Completadas",
    progNoHistory: "No hay consultas en la bitácora aún. Explora el tarot o las runas para comenzar.",
    progHistoryTitle: "Historial de Revelaciones Ancestrales",
    progStreakDays: "días",
    progMinShort: "min"
  },
  en: {
    title: "Zen Moments • Meditation Music",
    subtitle: "RELAX MUSIC • SPACE OF INNER PEACE",
    tagline: "An interactive holistic oasis with tarot, kabbalah, numerology, and mindfulness.",
    tabHome: "Meditation",
    tabTarot: "Tarot",
    tabRunes: "Runes",
    tabKabbalah: "Kabbalah",
    tabNumerology: "Numerology",
    tabArticles: "Articles",
    tabProgress: "Angels",
    tabAstrology: "Zodiac Profile",
    zenReminder: "ZEN REMINDER",
    howIsMind: "How is your mind today?",
    howIsMindDesc: "Select your emotional state to receive tailored reflections and exercises.",
    moodCalm: "🧘 Calm",
    moodAnxious: "😰 Anxious",
    moodSad: "😢 Sad",
    moodFrustrated: "😤 Frustrated",
    moodTired: "😴 Tired",
    moodHappy: "😊 Joyful",
    stressLevel: "STRESS & AGITATION LEVEL:",
    generateZenBtn: "Generate Daily Zen Guide",
    generatingZen: "Generating Space of Calm...",
    generateZenActive: "Calm Space Active",
    breathingTitle: "Zen Breather",
    breathingDesc: "Box breathing guide to calm your mind instantly.",
    breathInhale: "Inhale",
    breathHold1: "Hold",
    breathExhale: "Exhale",
    breathHold2: "Empty",
    breathIdle: "Ready",
    sessionLength: "SESSION DURATION:",
    startBreathing: "Start Breathing",
    stopSession: "Stop Session",
    soundMixer: "Relax Sound Mixer",
    soundMixerDesc: "Activate and adjust ambient sounds for active meditation.",
    volume: "Volume",
    soundRain: "🌧️ Rain",
    soundWaves: "🌊 Sea Waves",
    soundBowl: "🥣 Tibetan Bowl",
    soundBirds: "🐦 Forest Birds",
    soundBonfire: "🔥 Crackling Bonfire",
    soundCosmicWind: "🌌 Stellar Wind",
    soundBells: "🔔 Celestial Bells",
    soundMusic: "🎵 Ambient Music",
    musicVolume: "Music Volume",
    astrologyTitle: "Daily Astrological Transits",
    astrologyDesc: "Analyze current planetary movements and understand how astronomical positions influence your well-being.",
    astrologyBtn: "Consult Astrological Climate",
    astrologyLoading: "Calculating Astrological Transits...",
    astrologyResultTitle: "Current Astrological Climate",
    astrologyAdviceTitle: "Astrological Advice",
    voiceGuide: "Voice Meditations",
    voiceGuideDesc: "Listen to mystical voice-guided meditations generated with mindfulness techniques.",
    voiceMedSession: "MEDITATION THEME:",
    voiceSelectSession: "Select Session",
    voiceSelectLanguage: "Voice language:",
    voiceMeds: [
      { id: "calm-anxiety", name: "Calming Anxiety", desc: "Soothe the rush of thoughts and find your peaceful center." },
      { id: "chakra-alignment", name: "Chakra Alignment", desc: "Visualize and balance the energy centers of your being." },
      { id: "deep-sleep", name: "Sleep Connection", desc: "Release the tension of the day and prepare for a sacred rest." },
      { id: "kabbalah-light", name: "Kabbalah Light", desc: "Align your soul with the celestial spheres of the Tree of Life." }
    ],
    playVoice: "Start Voice Guide",
    playingVoice: "Playing voice...",
    stopVoice: "Stop Voice",
    tarotTitle: "Therapeutic Tarot Reading",
    tarotDesc: "Consult the sacred archetypes to illuminate your present and expand your consciousness.",
    tarotQuestionPlaceholder: "Write your question or spiritual intention here...",
    tarotSpreadType: "SPREAD TYPE:",
    tarotCard1: "One Card (Daily Guide)",
    tarotCard3: "Three Cards (Past, Present, Future)",
    tarotCard5: "Five Cards (Celestial Cross)",
    tarotBtn: "Invoke Cards",
    tarotLoading: "Opening the wisdom portal...",
    tarotSummaryTitle: "Tarot Revelation",
    tarotAdviceTitle: "Reading Advice",
    runesTitle: "Ancestral Norse Runes",
    runesDesc: "Access the mystical wisdom of Yggdrasil and direct advice from Odin.",
    runesQuestionPlaceholder: "Consult the Norse runes...",
    runesSpreadType: "READING TYPE:",
    runesCard1: "Single Rune",
    runesCard3: "Triple Rune Advice",
    runesBtn: "Draw Runes",
    runesLoading: "Casting sacred stones in the wind...",
    runesSummaryTitle: "Runic Prophecy",
    runesAdviceTitle: "Advice from Odin",
    numTitle: "Pythagorean Numerology",
    numDesc: "Discover the mathematical and vibrational map inscribed in your name and birth date.",
    numNameLabel: "Full Name (No accents):",
    numBirthLabel: "Date of Birth:",
    numBtn: "Calculate Vibration",
    numLoading: "Decoding sacred vibrations...",
    numResultTitle: "Your Vibrational Profile",
    numLifePath: "Life Mission",
    numExpression: "Innate Abilities",
    numSoulUrge: "Soul Desires",
    numPersonality: "Social Mask",
    kabTitle: "Kabbalah & Tree of Life",
    kabDesc: "Determine your ruling Sefirah to align your psychological energy with the divine plane.",
    kabAreaLabel: "Spiritual Focus Area:",
    kabBtn: "Generate Alignment Map",
    kabLoading: "Mapping Tree spheres...",
    kabResultTitle: "Tree of Life Alignment",
    kabMedTitle: "Active Sefirah Meditation",
    kabBlessingTitle: "Tree Blessing",
    libTitle: "Mindfulness Library",
    libDesc: "Ancient wisdom and brief psychological techniques for daily inner peace.",
    libReadMore: "Deepen Knowledge →",
    libBackBtn: "← Back to Library",
    libDeepKnowledge: "Invoking deep knowledge...",
    progTitle: "Progress Log",
    progDesc: "Track your consistency and relive the wisdom of your historical readings.",
    progStreak: "Active Streak",
    progMinutes: "Meditated Minutes",
    progActions: "Completed Actions",
    progNoHistory: "No readings in the log yet. Explore tarot or runes to begin.",
    progHistoryTitle: "History of Ancestral Revelations",
    progStreakDays: "days",
    progMinShort: "min"
  },
  pt: {
    title: "Momentos Zen • Música de Meditação",
    subtitle: "MÚSICA RELAX • ESPAÇO DE PAZ INTERIOR",
    tagline: "Um oásis holístico interativo com tarot, cabala, numerologia e mindfulness.",
    tabHome: "Meditação",
    tabTarot: "Tarot",
    tabRunes: "Runas",
    tabKabbalah: "Cabala",
    tabNumerology: "Numerologia",
    tabArticles: "Artigos",
    tabProgress: "Anjos",
    tabAstrology: "Perfil Zodiacal",
    zenReminder: "LEMBRETE ZEN",
    howIsMind: "Como está a sua mente hoje?",
    howIsMindDesc: "Selecione seu estado emocional para receber reflexões e exercícios adaptados.",
    moodCalm: "🧘 Calmo",
    moodAnxious: "😰 Ansioso",
    moodSad: "😢 Triste",
    moodFrustrated: "😤 Frustrado",
    moodTired: "😴 Cansado",
    moodHappy: "😊 Alegre",
    stressLevel: "NÍVEL DE ESTRESSE / AGITAÇÃO:",
    generateZenBtn: "Gerar Guia Zen de Hoje",
    generatingZen: "Gerando Espaço de Calma...",
    generateZenActive: "Espaço de Calma Ativo",
    breathingTitle: "Respiração Zen",
    breathingDesc: "Guia de respiração quadrada para acalmar sua mente imediatamente.",
    breathInhale: "Inale",
    breathHold1: "Retenha",
    breathExhale: "Exale",
    breathHold2: "Vazio",
    breathIdle: "Pronto",
    sessionLength: "DURAÇÃO DA SESSÃO:",
    startBreathing: "Começar Respiração",
    stopSession: "Parar Sessão",
    soundMixer: "Misturador de Sons Relax",
    soundMixerDesc: "Ative e calibre sons ambientais para sua meditação ativa.",
    volume: "Volume",
    soundRain: "🌧️ Chuva",
    soundWaves: "🌊 Ondas do Mar",
    soundBowl: "🥣 Tigela Tibetana",
    soundBirds: "🐦 Aves da Floresta",
    soundBonfire: "🔥 Fogueira Relaxante",
    soundCosmicWind: "🌌 Vento Estelar",
    soundBells: "🔔 Sinos Celestiais",
    soundMusic: "🎵 Música de Fundo",
    musicVolume: "Volume da Música",
    astrologyTitle: "Trânsitos Astrológicos do Dia",
    astrologyDesc: "Analise o movimento planetário atual e entenda como as posições astronômicas influenciam seu bem-estar.",
    astrologyBtn: "Consultar Clima Astrológico",
    astrologyLoading: "Calculando Trânsitos Astrológicos...",
    astrologyResultTitle: "Clima Astrológico Atual",
    astrologyAdviceTitle: "Conselho do Astrólogo",
    voiceGuide: "Meditações por Voz",
    voiceGuideDesc: "Ouça meditações místicas guiadas por voz gerada com técnicas de mindfulness.",
    voiceMedSession: "TEMA DA MEDITAÇÃO:",
    voiceSelectSession: "Selecionar Sessão",
    voiceSelectLanguage: "Idioma da voz:",
    voiceMeds: [
      { id: "calm-anxiety", name: "Acalmar a Ansiedade", desc: "Suavize o fluxo de pensamentos e encontre seu centro pacífico." },
      { id: "chakra-alignment", name: "Alinhamento dos Chakras", desc: "Visualize e equilibre os centros energéticos do seu ser." },
      { id: "deep-sleep", name: "Conexão com o Sono", desc: "Solte as tensões do dia e prepare-se para um descanso sagrado." },
      { id: "kabbalah-light", name: "Luz da Cabala", desc: "Alinhe sua alma com as esferas celestiais da Árvore da Vida." }
    ],
    playVoice: "Iniciar Guia de Voz",
    playingVoice: "Reproduzindo voz...",
    stopVoice: "Parar Voz",
    tarotTitle: "Leitura de Tarot Terapêutico",
    tarotDesc: "Consulte os arquétipos sagrados para iluminar seu presente e expandir sua consciência.",
    tarotQuestionPlaceholder: "Escreva sua pergunta ou intenção espiritual aqui...",
    tarotSpreadType: "TIPO DE JOGADA:",
    tarotCard1: "Uma Carta (Guia de Hoje)",
    tarotCard3: "Três Cartas (Passado, Presente, Futuro)",
    tarotCard5: "Cinco Cartas (Cruz Cósmica)",
    tarotBtn: "Invocação de Cartas",
    tarotLoading: "Abrindo o portal de sabedoria...",
    tarotSummaryTitle: "Revelação do Tarot",
    tarotAdviceTitle: "Conselho da Leitura",
    runesTitle: "Runas Nórdicas Ancestrais",
    runesDesc: "Aceda à sabedoria mística do Yggdrasil e ao conselho direto de Odin.",
    runesQuestionPlaceholder: "Consulte as runas nórdicas...",
    runesSpreadType: "TIPO DE LEITURA:",
    runesCard1: "Runa Única",
    runesCard3: "Conselho Rúnico Triplo",
    runesBtn: "Extrair Runas",
    runesLoading: "Lançando pedras sagradas ao vento...",
    runesSummaryTitle: "Vaticínio Rúnico",
    runesAdviceTitle: "Conselho de Odin",
    numTitle: "Numerologia Pitagórica",
    numDesc: "Descubra o mapa matemático e vibracional inscrito em seu nome e data de nascimento.",
    numNameLabel: "Nome Completo (Sem acentos):",
    numBirthLabel: "Data de Nascimento:",
    numBtn: "Calcular Vibração",
    numLoading: "Decodificando frequências cósmicas...",
    numResultTitle: "Seu Perfil Vibracional",
    numLifePath: "Missão de Vida",
    numExpression: "Habilidades Inatas",
    numSoulUrge: "Desejos da Alma",
    numPersonality: "Máscara Social",
    kabTitle: "Cabala e Árvore da Vida",
    kabDesc: "Determine sua Sefirah regente para alinhar sua energia psicológica com o plano divino.",
    kabAreaLabel: "Área de Foco Espiritual:",
    kabBtn: "Gerar Mapa de Alinhamento",
    kabLoading: "Mapeando esferas da Árvore...",
    kabResultTitle: "Alinhamento da Árvore da Vida",
    kabMedTitle: "Meditação da Sefirah Ativa",
    kabBlessingTitle: "Bênção da Árvore",
    libTitle: "Biblioteca de Mindfulness",
    libDesc: "Sabedoria ancestral e técnicas psicológicas breves para a paz interior diária.",
    libReadMore: "Aprofundar Conhecimento →",
    libBackBtn: "← Voltar à Biblioteca",
    libDeepKnowledge: "Invocando conhecimento profundo...",
    progTitle: "Registro de Progresso",
    progDesc: "Acompanhe sua consistência e reviva a sabedoria de suas leituras históricas.",
    progStreak: "Série Ativa",
    progMinutes: "Minutos de Meditação",
    progActions: "Ações Concluídas",
    progNoHistory: "Ainda não há consultas no registro. Explore o tarot ou as runas para começar.",
    progHistoryTitle: "Histórico de Revelações Ancestrais",
    progStreakDays: "dias",
    progMinShort: "min"
  },
  de: {
    title: "Zen-Momente • Meditationsmusik",
    subtitle: "RELAX-MUSIK • RAUM FÜR INNERE RUHE",
    tagline: "Eine interaktive ganzheitliche Oase mit Tarot, Kabbala, Numerologie und Achtsamkeit.",
    tabHome: "Meditation",
    tabTarot: "Tarot",
    tabRunes: "Runen",
    tabKabbalah: "Kabbala",
    tabNumerology: "Numerologie",
    tabArticles: "Artikel",
    tabProgress: "Engel",
    tabAstrology: "Tierkreisprofil",
    zenReminder: "ZEN-ERINNERUNG",
    howIsMind: "Wie geht es deinem Geist heute?",
    howIsMindDesc: "Wähle deinen emotionalen Zustand, um maßgeschneiderte Reflexionen und Übungen zu erhalten.",
    moodCalm: "🧘 Gelassen",
    moodAnxious: "😰 Ängstlich",
    moodSad: "😢 Traurig",
    moodFrustrated: "😤 Frustriert",
    moodTired: "😴 Müde",
    moodHappy: "😊 Glücklich",
    stressLevel: "STRESSNIVEAU / UNRUHE:",
    generateZenBtn: "Erzeuge heutigen Zen-Leitfaden",
    generatingZen: "Erzeuge Raum der Ruhe...",
    generateZenActive: "Raum der Ruhe aktiv",
    breathingTitle: "Zen-Atmung",
    breathingDesc: "Quadratische Atemführung, um deinen Geist sofort zu beruhigen.",
    breathInhale: "Einatmen",
    breathHold1: "Halten",
    breathExhale: "Ausatmen",
    breathHold2: "Leere",
    breathIdle: "Bereit",
    sessionLength: "SITZUNGSDAUER:",
    startBreathing: "Atmung starten",
    stopSession: "Sitzung beenden",
    soundMixer: "Relax-Soundmixer",
    soundMixerDesc: "Aktiviere und kalibriere Umgebungsgeräusche für deine aktive Meditation.",
    volume: "Lautstärke",
    soundRain: "🌧️ Regen",
    soundWaves: "🌊 Meereswellen",
    soundBowl: "🥣 Tibetische Klangschale",
    soundBirds: "🐦 Waldvögel",
    soundBonfire: "🔥 Entspannendes Lagerfeuer",
    soundCosmicWind: "🌌 Sternenwind",
    soundBells: "🔔 Himmlische Glocken",
    soundMusic: "🎵 Hintergrundmusik",
    musicVolume: "Musiklautstärke",
    astrologyTitle: "Astrologische Transite des Tages",
    astrologyDesc: "Analysiere die aktuellen Planetenbewegungen und verstehe, wie astronomische Positionen dein Wohlbefinden beeinflussen.",
    astrologyBtn: "Astrologisches Klima abfragen",
    astrologyLoading: "Berechne astrologische Transite...",
    astrologyResultTitle: "Aktuelles astrologisches Klima",
    astrologyAdviceTitle: "Ratschlag des Astrologen",
    voiceGuide: "Geführte Sprachmeditationen",
    voiceGuideDesc: "Höre mystische geführte Meditationen, die mit Achtsamkeitstechniken erstellt wurden.",
    voiceMedSession: "MEDITATIONSTHEMA:",
    voiceSelectSession: "Sitzung auswählen",
    voiceSelectLanguage: "Sprachausgabe:",
    voiceMeds: [
      { id: "calm-anxiety", name: "Angst beruhigen", desc: "Besänftige die Flut der Gedanken und finde deine friedliche Mitte." },
      { id: "chakra-alignment", name: "Chakra-Ausrichtung", desc: "Visualisiere und balanciere die Energiezentren deines Wesens." },
      { id: "deep-sleep", name: "Schlafverbindung", desc: "Lasse die Spannungen des Tages los und bereite dich auf einen erholsamen Schlaf vor." },
      { id: "kabbalah-light", name: "Licht der Kabbala", desc: "Richte deine Seele auf die himmlischen Sphären des Lebensbaums aus." }
    ],
    playVoice: "Sprachführung starten",
    playingVoice: "Spiele Stimme ab...",
    stopVoice: "Stimme stoppen",
    tarotTitle: "Therapeutisches Tarot-Lesen",
    tarotDesc: "Konsultiere die heiligen Archetypen, um deine Gegenwart zu erleuchten und dein Bewusstsein zu erweitern.",
    tarotQuestionPlaceholder: "Schreibe deine Frage oder spirituelle Absicht hier...",
    tarotSpreadType: "ART DER LEGUNG:",
    tarotCard1: "Eine Karte (Tageskarte)",
    tarotCard3: "Drei Karten (Vergangenheit, Gegenwart, Zukunft)",
    tarotCard5: "Fünf Karten (Kosmisches Kreuz)",
    tarotBtn: "Kartenbeschwörung",
    tarotLoading: "Öffne das Portal der Weisheit...",
    tarotSummaryTitle: "Offenbarung des Tarot",
    tarotAdviceTitle: "Ratschlag der Legung",
    runesTitle: "Ahnenschatz der Nordischen Runen",
    runesDesc: "Greife auf die mystische Weisheit von Yggdrasil und den direkten Rat von Odin zu.",
    runesQuestionPlaceholder: "Befrage die nordischen Runen...",
    runesSpreadType: "LEGEMETHODE:",
    runesCard1: "Einzelne Rune",
    runesCard3: "Dreifacher Runenrat",
    runesBtn: "Runen ziehen",
    runesLoading: "Werfe die heiligen Steine in den Wind...",
    runesSummaryTitle: "Runen-Orakel",
    runesAdviceTitle: "Ratschlag von Odin",
    numTitle: "Pythagoreische Numerologie",
    numDesc: "Entdecke den mathematischen und Schwingungs-Bauplan deines Namens und Geburtsdatums.",
    numNameLabel: "Vollständiger Name (Ohne Akzente):",
    numBirthLabel: "Geburtsdatum:",
    numBtn: "Schwingung berechnen",
    numLoading: "Dekodiere kosmische Frequenzen...",
    numResultTitle: "Dein Schwingungsprofil",
    numLifePath: "Lebensweg",
    numExpression: "Innewohnende Fähigkeiten",
    numSoulUrge: "Wünsche der Seele",
    numPersonality: "Soziale Maske",
    kabTitle: "Kabbala und Lebensbaum",
    kabDesc: "Bestimme deine herrschende Sefirah, um deine psychologische Energie auf die göttliche Ebene auszurichten.",
    kabAreaLabel: "Fokus deiner spirituellen Energie:",
    kabBtn: "Ausrichtungskarte erstellen",
    kabLoading: "Kartiere die Sphären des Baumes...",
    kabResultTitle: "Ausrichtung des Lebensbaums",
    kabMedTitle: "Meditation der aktiven Sefirah",
    kabBlessingTitle: "Segen des Lebensbaums",
    libTitle: "Achtsamkeits-Bibliothek",
    libDesc: "Alte Weisheit und kurze psychologische Techniken für den täglichen inneren Frieden.",
    libReadMore: "Wissen vertiefen →",
    libBackBtn: "← Zurück zur Bibliothek",
    libDeepKnowledge: "Rufe tiefes Wissen ab...",
    progTitle: "Fortschritts-Logbuch",
    progDesc: "Verfolge deine Beständigkeit und erlebe die Weisheit deiner historischen Lesungen neu.",
    progStreak: "Aktive Strähne",
    progMinutes: "Meditierte Minuten",
    progActions: "Abgeschlossene Aktionen",
    progNoHistory: "Noch keine Lesungen im Logbuch vorhanden. Erkunde Tarot oder Runen, um zu beginnen.",
    progHistoryTitle: "Geschichte der Ahnen-Offenbarungen",
    progStreakDays: "Tage",
    progMinShort: "Min"
  }
};

export const MINDFULNESS_ARTICLES_LOCALIZED: Record<"es" | "en" | "pt" | "de", any[]> = {
  es: [
    { id: "calmar-mente", title: "5 Técnicas para calmar la mente en 5 minutos", summary: "Ejercicios rápidos y discretos para recuperar el centro en cualquier situación estresante.", emoji: "🧘" },
    { id: "respirar-calma", title: "Respiración: El Secreto de la Calma", summary: "Descubre cómo regular tu sistema nervioso autónomo mediante la respiración diafragmática.", emoji: "🌬️" },
    { id: "sueno-zen", title: "Rituales de Sueño Profundo", summary: "Cómo desconectar tu mente de la hiperestimulación digital para un descanso verdaderamente reparador.", emoji: "🌙" },
    { id: "atencion-plena", title: "Atención Plena en la Vida Cotidiana", summary: "Prácticas sencillas para convertir tareas cotidianas (lavar platos, caminar) en meditación activa.", emoji: "🧘" },
    { id: "soltar-estres", title: "El Arte de Soltar y Dejar Ir", summary: "Estrategias budistas y psicológicas para desenredarte de preocupaciones fuera de tu control.", emoji: "🌊" },
    { id: "astrologia-vida", title: "Astrología y Ciclos Vitales", summary: "Entiende cómo los tránsitos celestes reflejan fases evolutivas de tu mente y tu espíritu.", emoji: "🪐" },
    { id: "sonidos-sanadores", title: "Frecuencias Solfeggio de Bienestar", summary: "Cómo las ondas acústicas estimulan la armonía cerebral, reducen el cortisol y calman la ansiedad.", emoji: "🎵" }
  ],
  en: [
    { id: "calmar-mente", title: "5 Techniques to calm the mind in 5 minutes", summary: "Quick and discrete exercises to reclaim your focus in any stressful scenario.", emoji: "🧘" },
    { id: "respirar-calma", title: "Breathing: The Secret of Calm", summary: "Discover how to regulate your autonomic nervous system using diaphragmatic breathing.", emoji: "🌬️" },
    { id: "sueno-zen", title: "Deep Sleep Rituals", summary: "How to disconnect your mind from digital hyperstimulation for a truly restful sleep.", emoji: "🌙" },
    { id: "atencion-plena", title: "Mindfulness in Everyday Life", summary: "Simple practices to turn regular chores (washing dishes, walking) into active meditation.", emoji: "🧘" },
    { id: "soltar-estres", title: "The Art of Letting Go", summary: "Buddhist and psychological strategies to untangle yourself from worries outside your control.", emoji: "🌊" },
    { id: "astrologia-vida", title: "Astrology and Life Cycles", summary: "Understand how celestial transits reflect evolutionary phases of your mind and spirit.", emoji: "🪐" },
    { id: "sonidos-sanadores", title: "Solfeggio Frequencies of Well-being", summary: "How acoustic waves stimulate brain harmony, reduce cortisol, and soothe anxiety.", emoji: "🎵" }
  ],
  pt: [
    { id: "calmar-mente", title: "5 Técnicas para acalmar a mente em 5 minutos", summary: "Exercícios rápidos e discretos para recuperar o seu foco em qualquer situação estressante.", emoji: "🧘" },
    { id: "respirar-calma", title: "Respiração: O Segredo da Calma", summary: "Descubra como regular seu sistema nervoso autônomo através da respiração diafragmática.", emoji: "🌬️" },
    { id: "sueno-zen", title: "Rituais de Sono Profundo", summary: "Como desconectar sua mente da hiperestimulação digital para um sono verdadeiramente reparador.", emoji: "🌙" },
    { id: "atencion-plena", title: "Atenção Plena na Vida Cotidiana", summary: "Práticas simples para transformar tarefas cotidianas (lavar louça, caminhar) em meditação ativa.", emoji: "🧘" },
    { id: "soltar-estres", title: "A Arte de Soltar e Deixar Ir", summary: "Estratégias budistas e psicológicas para se desvencilhar de preocupações fora do seu controle.", emoji: "🌊" },
    { id: "astrologia-vida", title: "Astrologia e Ciclos Vitais", summary: "Entenda como os trânisitos celestes refletem fases evolutivas de sua mente e espírito.", emoji: "🪐" },
    { id: "sonidos-sanadores", title: "Frequências Solfeggio de Bem-estar", summary: "Como as ondas acústicas estimulam a harmonia cerebral, reduzem o cortisol e acalmam a ansiedade.", emoji: "🎵" }
  ],
  de: [
    { id: "calmar-mente", title: "5 Techniken zur Beruhigung des Geistes in 5 Minuten", summary: "Schnelle und diskrete Übungen zur Wiedererlangung des Fokus in jeder stressigen Situation.", emoji: "🧘" },
    { id: "respirar-calma", title: "Atmung: Das Geheimnis der Ruhe", summary: "Entdecke, wie du dein vegetatives Nervensystem durch Zwerchfellatmung regulieren kannst.", emoji: "🌬️" },
    { id: "sueno-zen", title: "Rituale für tiefen Schlaf", summary: "Wie du deinen Geist von digitaler Reizüberflutung befreist, um einen wirklich erholsamen Schlaf zu finden.", emoji: "🌙" },
    { id: "atencion-plena", title: "Achtsamkeit im Alltag", summary: "Einfache Übungen, um alltägliche Aufgaben (Geschirrspülen, Gehen) in aktive Meditation zu verwandeln.", emoji: "🧘" },
    { id: "soltar-estres", title: "Die Kunst des Loslassens", summary: "Buddhistische und psychologische Strategien, um dich von Sorgen außerhalb deiner Kontrolle zu befreien.", emoji: "🌊" },
    { id: "astrologia-vida", title: "Astrologie und Lebenszyklen", summary: "Verstehe, wie himmlische Transite die Entwicklungsphasen deines Geistes und deiner Seele widerspiegeln.", emoji: "🪐" },
    { id: "sonidos-sanadores", title: "Solfeggio-Frequenzen für das Wohlbefinden", summary: "Wie Schallwellen die Gehirnharmonie anregen, Cortisol senken und Ängste lindern.", emoji: "🎵" }
  ]
};

// Guided Voice Meditation Scripts (Split into elegant segments for the narrator speech synthesis)
export const VOICE_SCRIPTS: Record<"es" | "en" | "pt" | "de", Record<string, string[]>> = {
  es: {
    "calm-anxiety": [
      "Cierra los ojos y pon la espalda recta.",
      "Toma una respiración muy profunda y lenta por la nariz... siente el aire frío entrar... y exhala suavemente por la boca, liberando todo el peso de tus hombros.",
      "Siente el peso de tu cuerpo apoyado en la tierra. Estás a salvo aquí. El pasado ya pasó, el futuro es solo una idea. Solo existe este preciso momento.",
      "Deja ir las expectativas. Si un pensamiento de preocupación cruza por tu mente, no te resistas. Míralo como una nube pasajera en un cielo inmenso de consciencia.",
      "Repite mentalmente conmigo: Estoy en paz. Todo está bien. Confío en el fluir de la vida.",
      "Abre los ojos despacio, sintiendo la ligereza y la calma en tu ser."
    ],
    "chakra-alignment": [
      "Siéntate cómodamente y respira de manera constante.",
      "Visualiza una luz roja en la base de tu columna vertebral, dándote estabilidad y enraizamiento en la tierra.",
      "Ahora siente una luz dorada y cálida en tu plexo solar, encendiendo tu poder interior, tu confianza y tu fuerza vital.",
      "Lleva tu atención al centro del pecho. Siente una luz verde esmeralda expandirse con cada respiración, irradiando amor incondicional y perdón hacia ti y hacia el mundo.",
      "Visualiza una luz azul brillante en tu garganta, permitiéndote expresar tu verdad con honestidad y amor.",
      "Finalmente, imagina una luz violeta pura en tu coronilla, conectándote con la sabiduría cósmica universal. Siente la armonía completa en todo tu ser."
    ],
    "deep-sleep": [
      "Acuéstate cómodamente y deja caer los brazos a los lados.",
      "Cierra suavemente los ojos. Siente la suavidad de tu respiración, como una marea tranquila que sube y baja en la noche.",
      "Siente cómo se relajan los párpados, la mandíbula, y cómo tu cabeza se vuelve agradablemente pesada.",
      "No hay nada que resolver ahora. El día ha terminado. Has hecho lo mejor que has podido. Ahora es el momento de soltarlo todo.",
      "Imagínate flotando en un océano tibio bajo un cielo cubierto de estrellas titilantes. Cada estrella cuida de tu descanso.",
      "Permítete sumergirte en un sueño profundo, sanador y lleno de paz. Buenas noches."
    ],
    "kabbalah-light": [
      "Cierra los ojos e imagina el gran Árbol de la Vida frente a ti.",
      "Visualiza la esfera dorada de Tiferet brillando con fuerza en tu corazón, trayendo belleza y equilibrio a tu alma.",
      "Siente la energía protectora y estructurante de Gevurah y compártela con la expansión amorosa y misericordiosa de Chesed.",
      "Conéctate con Malkuth, sintiendo el reino físico sagrado bajo tus pies, un canal de manifestación divina.",
      "Siente la luz infinita de Keter descender desde lo alto y bendecir cada una de tus células.",
      "Lleva esta paz contigo, sabiendo que eres parte de un diseño perfecto y sagrado."
    ]
  },
  en: {
    "calm-anxiety": [
      "Close your eyes and straighten your spine.",
      "Take a very deep, slow breath in through your nose... feel the cool air entering... and exhale gently through your mouth, letting go of all the weight in your shoulders.",
      "Feel the weight of your body supported by the earth. You are safe here. The past is gone, the future is just an idea. Only this precise moment exists.",
      "Let go of all expectations. If a worrying thought crosses your mind, do not fight it. Observe it like a passing cloud in a vast sky of awareness.",
      "Repeat mentally with me: I am at peace. All is well. I trust the flow of life.",
      "Slowly open your eyes, feeling the lightness and calm within you."
    ],
    "chakra-alignment": [
      "Sit comfortably and breathe in a steady rhythm.",
      "Visualize a vibrant red light at the base of your spine, giving you stability and grounding you to the earth.",
      "Now feel a warm, golden light in your solar plexus, igniting your inner power, confidence, and life force.",
      "Bring your awareness to the center of your chest. Feel an emerald green light expand with every breath, radiating unconditional love and forgiveness to yourself and the world.",
      "Visualize a brilliant blue light in your throat, allowing you to express your truth with honesty and love.",
      "Finally, imagine a pure violet light at the crown of your head, connecting you with universal celestial wisdom. Feel complete harmony in your entire being."
    ],
    "deep-sleep": [
      "Lie down comfortably and let your arms rest at your sides.",
      "Gently close your eyes. Feel the softness of your breath, like a peaceful tide rising and falling in the night.",
      "Feel your eyelids and your jaw relax, and notice how your head becomes pleasantly heavy.",
      "There is nothing to solve right now. The day is done. You have done your best. Now is the time to let go of everything.",
      "Imagine yourself floating in a warm ocean under a sky covered with twinkling stars. Every star protects your rest.",
      "Allow yourself to sink into a deep, healing, and peaceful sleep. Good night."
    ],
    "kabbalah-light": [
      "Close your eyes and imagine the grand Tree of Life in front of you.",
      "Visualize the golden sphere of Tiferet shining brightly in your heart, bringing beauty and balance to your soul.",
      "Feel the protective and structuring energy of Gevurah, and balance it with the loving and merciful expansion of Chesed.",
      "Connect with Malkuth, feeling the sacred physical realm beneath your feet, a channel of divine manifestation.",
      "Feel the infinite light of Keter descending from above, blessing every single cell in your body.",
      "Carry this peace with you, knowing you are part of a perfect and sacred design."
    ]
  },
  pt: {
    "calm-anxiety": [
      "Feche os olhos e endireite sua coluna.",
      "Respire muito fundo e devagar pelo nariz... sinta o ar fresco entrar... e expire suavemente pela boca, liberando todo o peso dos seus ombros.",
      "Sinta o peso do seu corpo apoiado na terra. Você está seguro aqui. O passado já foi, o futuro é apenas uma ideia. Apenas este momento exato existe.",
      "Abandone as expectativas. Se um pensamento de preocupação cruzar sua mente, não resista. Veja-o como uma nuvem passageira em um céu imenso de consciência.",
      "Repita mentalmente comigo: Estou em paz. Tudo está bem. Eu confio no fluxo da vida.",
      "Abra os olhos devagar, sentindo a leveza e a calma em seu ser."
    ],
    "chakra-alignment": [
      "Sente-se confortavelmente e respire de forma constante.",
      "Visualize uma luz vermelha brilhante na base da sua coluna, dando-lhe estabilidade e enraizamento na terra.",
      "Agora sinta uma luz dourada e calorosa no seu plexo solar, acendendo seu poder interior, sua confiança e sua força vital.",
      "Traga sua atenção para o centro do peito. Sinta uma luz verde esmeralda se expandir a cada respiração, irradiando amor incondicional e perdão para si mesmo e para o mundo.",
      "Visualize uma luz azul brilhante na sua garganta, permitindo que você expresse sua verdade com honestidade e amor.",
      "Finalmente, imagine uma luz violeta pura no topo da sua cabeça, conectando você com a sabedoria cósmica universal. Sinta harmonia completa em todo o seu ser."
    ],
    "deep-sleep": [
      "Deite-se confortavelmente e deixe os braços caírem ao lado do corpo.",
      "Feche suavemente os olhos. Sinta a suavidade da sua respiração, como uma maré calma que sobe e desce na noite.",
      "Sinta como pálpebras, maxilar se relaxam, e sua cabeça fica agradavelmente pesada.",
      "Não há nada para resolver agora. O dia terminou. Você fez o melhor que pôde. Agora é o momento de soltar tudo.",
      "Imagine-se flutuando em um oceano morno sob um céu coberto de estrelas cintilantes. Cada estrela cuida do seu descanso.",
      "Permita-se mergulhar em um sono profundo, restaurador e cheio de paz. Boa noite."
    ],
    "kabbalah-light": [
      "Feche os olhos e imagine a grande Árvore da Vida à sua frente.",
      "Visualize a esfera dourada de Tiferet brilhando fortemente em seu coração, trazendo beleza e equilíbrio para sua alma.",
      "Sinta a energia protetora e estruturante de Gevurah e equilibre-a com a expansão amorosa e misericordiosa de Chesed.",
      "Conecte-se com Malkuth, sentindo o reino físico sagrado sob seus pés, um canal de manifestação divina.",
      "Sinta a luz infinita de Keter descer do alto e abençoar cada uma de suas células.",
      "Leve essa paz com você, sabendo que você faz parte de um plano perfeito e sagrado."
    ]
  },
  de: {
    "calm-anxiety": [
      "Schließe deine Augen und richte deine Wirbelsäule auf.",
      "Atme sehr tief und langsam durch die Nase ein... spüre, wie kühle Luft einströmt... und atme sanft durch den Mund aus, während du alle Last von deinen Schultern abfallen lässt.",
      "Spüre das Gewicht deines Körpers, getragen von der Erde. Du bist hier sicher. Die Vergangenheit ist vorbei, die Zukunft nur ein Gedanke. Nur dieser präzise Augenblick existiert.",
      "Lasse alle Erwartungen los. Wenn ein sorgenvoller Gedanke deinen Geist durchquert, bekämpfe ihn nicht. Beobachte ihn wie eine vorüberziehende Wolke an einem weiten Himmel des Bewusstseins.",
      "Wiederhole geistig mit mir: Ich bin in Frieden. Alles ist gut. Ich vertraue dem Fluss des Lebens.",
      "Öffne langsam deine Augen und spüre die Leichtigkeit und Ruhe in dir."
    ],
    "chakra-alignment": [
      "Setze dich bequem hin und atme in einem gleichmäßigen Rhythmus.",
      "Visualisiere ein lebendiges rotes Licht an der Basis deiner Wirbelsäule, das dir Stabilität gibt und dich mit der Erde verbindet.",
      "Spüre nun ein warmes, goldenes Licht in deinem Solarplexus, das deine innere Kraft, dein Vertrauen und deine Lebenskraft entzündet.",
      "Bringe deine Aufmerksamkeit in die Mitte deiner Brust. Spüre, wie sich mit jedem Atemzug ein smaragdgrünes Licht ausdehnt und bedingungslose Liebe und Vergebung für dich selbst und die Welt ausstrahlt.",
      "Visualisiere ein strahlend blaues Licht in deiner Kehle, das es dir ermöglicht, deine Wahrheit mit Ehrlichkeit und Liebe auszudrücken.",
      "Stelle dir schließlich ein reines violettes Licht auf deinem Scheitel vor, das dich mit der universellen kosmischen Weisheit verbindet. Spüre die vollkommene Harmonie in deinem gesamten Wesen."
    ],
    "deep-sleep": [
      "Lege dich bequem hin und lasse deine Arme an den Seiten ruhen.",
      "Schließe sanft deine Augen. Spüre die Sanftheit deines Atems, wie eine friedliche Ebbe und Flut, die in der Nacht auf- und absteigt.",
      "Spüre, wie sich deine Augenlider und dein Kiefer entspannen, und bemerke, wie dein Kopf angenehm schwer wird.",
      "Es gibt jetzt nichts zu lösen. Der Tag ist vorbei. Du hast dein Bestes getan. Jetzt ist es an der Zeit, alles loszulassen.",
      "Stelle dir vor, du treibst in einem warmen Ozean unter einem von funkelnden Sternen übersäten Himmel. Jeder Stern wacht über deine Ruhe.",
      "Erlaube dir, in einen tiefen, heilenden und friedlichen Schlaf zu sinken. Gute Nacht."
    ],
    "kabbalah-light": [
      "Schließe deine Augen und stelle dir den großen Lebensbaum vor dir vor.",
      "Visualisiere die goldene Sphäre von Tiferet, die hell in deinem Herzen leuchtet und Schönheit und Balance in deine Seele bringt.",
      "Spüre die schützende und strukturierende Energie von Gevurah und bringe sie in Einklang mit der liebevollen und barmherzigen Ausdehnung von Chesed.",
      "Verbinde dich mit Malkuth und spüre das heilige physische Reich unter deinen Füßen, einen Kanal der göttlichen Manifestation.",
      "Spüre das unendliche Licht von Keter, das von oben herabsteigt und jede einzelne Zelle deines Körpers segnet.",
      "Trage diesen Frieden mit dir, im Wissen, dass du Teil eines perfekten und heiligen Entwurfs bist."
    ]
  }
};
