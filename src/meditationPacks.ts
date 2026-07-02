export interface MeditationExercise {
  id: string;
  name: string;
  desc: string;
  duration: string;
  sentences: string[];
}

export interface MeditationPack {
  id: string;
  title: string;
  desc: string;
  icon: string; // Used to pick correct Lucide icon
  color: string; // Tailwind gradient bg
  textColor: string; // Text accent color
  borderColor: string; // Border accent color
  exercises: MeditationExercise[];
}

export const MEDITATION_PACKS: Record<"es" | "en" | "pt", MeditationPack[]> = {
  es: [
    {
      id: "stress-reduction",
      title: "Reducción del Estrés",
      desc: "Técnicas diseñadas para calmar el sistema nervioso, disolver la tensión física y restaurar la paz mental ante situaciones abrumadoras.",
      icon: "ZapOff",
      color: "from-rose-500/10 to-orange-500/10",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      exercises: [
        {
          id: "stress-sos",
          name: "Respiro SOS",
          desc: "Restablecimiento inmediato y calma para momentos de pánico o agobio.",
          duration: "3 min",
          sentences: [
            "Detente por un instante. Inhala aire profundamente por la nariz durante cuatro segundos...",
            "Mantén el aire por cuatro segundos...",
            "Exhala lentamente por la boca liberando la tensión...",
            "Siente cómo tu cuerpo se afloja. Estás aquí, estás a salvo."
          ]
        },
        {
          id: "stress-body-scan",
          name: "Escaneo Corporal de Calma",
          desc: "Suaviza la tensión acumulada de pies a cabeza con conciencia plena.",
          duration: "5 min",
          sentences: [
            "Cierra los ojos y lleva la atención a tus pies, relajándolos por completo.",
            "Sube por tus piernas, tu abdomen y tu pecho, sintiendo cómo se liberan las tensiones.",
            "Relaja tus hombros y tu mandíbula. Siente tu cuerpo ligero como una pluma.",
            "Descansa en esta agradable sensación de ligereza corporal."
          ]
        },
        {
          id: "stress-dissolve-worries",
          name: "Disolver Preocupaciones",
          desc: "Visualización guiada para desapegarte de los pensamientos de estrés.",
          duration: "4 min",
          sentences: [
            "Visualiza tus preocupaciones actuales como pequeñas hojas secas sobre un río.",
            "Mira cómo el río se las lleva suavemente corriente abajo.",
            "No necesitas aferrarte a ellas. Deja que fluyan y desaparezcan.",
            "Tu mente queda limpia y clara como agua de manantial."
          ]
        },
        {
          id: "stress-grounding-54321",
          name: "Anclaje en el Presente",
          desc: "Conéctate con tus sentidos físicos aquí y ahora para detener el ruido mental.",
          duration: "4 min",
          sentences: [
            "Conéctate con tu entorno. Nombra mentalmente tres cosas que puedas ver a tu alrededor.",
            "Presta atención a dos sonidos que alcances a percibir en este instante.",
            "Siente el roce del aire o la ropa sobre tu piel.",
            "Estás plenamente presente. La tormenta en tu mente ha pasado."
          ]
        },
        {
          id: "stress-muscle-release",
          name: "Liberación de Mandíbula y Hombros",
          desc: "Tensión y relajación muscular rápida para liberar el estrés acumulado.",
          duration: "3 min",
          sentences: [
            "Aprieta los puños y los hombros con fuerza durante tres segundos...",
            "Ahora suéltalos de golpe, sintiendo el torrente de relajación.",
            "Permite que la mandíbula se entreabra y que la lengua descanse.",
            "Siente la deliciosa oleada de alivio físico recorriendo tu cuerpo."
          ]
        },
        {
          id: "stress-safe-haven",
          name: "El Refugio Seguro",
          desc: "Crea un espacio sagrado de paz y protección absoluta en tu mente.",
          duration: "5 min",
          sentences: [
            "Imagina un lugar en la naturaleza donde te sientas completamente seguro y amparado.",
            "Escucha los sonidos pacíficos de ese santuario mental.",
            "Siente que nada ni nadie puede perturbar tu paz en este espacio.",
            "Este refugio siempre está dentro de ti. Puedes volver cuando quieras."
          ]
        },
        {
          id: "stress-mental-detox",
          name: "Detox Mental",
          desc: "Limpieza consciente de la sobrecarga de información diaria.",
          duration: "4 min",
          sentences: [
            "Inhala aire fresco y visualízalo como luz que limpia tu mente de pensamientos repetitivos.",
            "Al exhalar, imagina que liberas un humo gris que representa el ruido mental.",
            "Siente cómo el espacio dentro de tu cabeza se vuelve amplio y silencioso.",
            "Disfruta de este momento de claridad y silencio interior."
          ]
        }
      ]
    },
    {
      id: "sleep-stories",
      title: "Historias para Dormir",
      desc: "Relatos pausados y atmósferas envolventes diseñadas para guiar tu mente hacia un sueño reparador y profundo.",
      icon: "Moon",
      color: "from-indigo-500/10 to-purple-500/10",
      textColor: "text-indigo-300",
      borderColor: "border-indigo-500/20",
      exercises: [
        {
          id: "sleep-blue-mist",
          name: "El Valle de la Niebla Azul",
          desc: "Camina por un sendero de tranquilidad infinita y desconéctate.",
          duration: "6 min",
          sentences: [
            "Imagina que caminas por un sendero suave rodeado de una niebla azulada.",
            "La niebla acaricia tu piel y te envuelve en una sensación de calma profunda.",
            "Cada paso que das te aleja de las preocupaciones del día.",
            "Te dejas llevar por la paz silenciosa del sendero."
          ]
        },
        {
          id: "sleep-wind-temple",
          name: "El Templo del Viento",
          desc: "Escucha la sabiduría del viento en las montañas sagradas.",
          duration: "5 min",
          sentences: [
            "Visualiza un antiguo templo de piedra en la cima de una colina tranquila.",
            "El viento suave acaricia los campanarios, creando una melodía hipnótica.",
            "Te recuestas sobre el suelo cálido del templo, escuchando la música del aire.",
            "Tu respiración se sincroniza con el susurro constante del viento."
          ]
        },
        {
          id: "sleep-lake-silence",
          name: "El Lago del Silencio",
          desc: "Contempla las aguas mansas bajo una luna de plata.",
          duration: "5 min",
          sentences: [
            "Contempla un hermoso lago cuyas aguas son tan mansas que parecen un espejo perfecto.",
            "La luna se refleja con un brillo plateado sobre la superficie inmóvil.",
            "Siente cómo la quietud del agua se traslada a tu propia mente.",
            "Te sumerges en una calma absoluta, lista para el descanso celestial."
          ]
        },
        {
          id: "sleep-whispering-forest",
          name: "El Bosque de los Susurros",
          desc: "Un paseo nocturno arropado por el murmullo de hojas antiguas.",
          duration: "6 min",
          sentences: [
            "Entra en un bosque antiguo por la noche, donde las hojas susurran historias de paz.",
            "El aroma a pino y tierra húmeda te arropa con una calidez reconfortante.",
            "Los árboles te cuidan, meciéndose suavemente bajo la brisa nocturna.",
            "Te dejas dormir sintiéndote protegido por la naturaleza sabia."
          ]
        },
        {
          id: "sleep-clouds-journey",
          name: "El Viaje de las Nubes",
          desc: "Flota sin gravedad hacia un estado de paz absoluta.",
          duration: "5 min",
          sentences: [
            "Imagina que te recuestas sobre una nube esponjosa y cálida.",
            "La nube se eleva suavemente, flotando sin gravedad bajo las estrellas.",
            "Siente cómo se desvanece todo el peso físico de tus músculos.",
            "Flotas libre, ligera y en completa comunión con el universo del sueño."
          ]
        },
        {
          id: "sleep-lighthouse-end",
          name: "El Faro del Fin del Mundo",
          desc: "Descansa sintiendo el suave vaivén de las olas seguras.",
          duration: "6 min",
          sentences: [
            "Imagina un faro seguro en la distancia que emite una luz cálida y rítmica.",
            "Escuchas el oleaje suave golpeando la base de las rocas con un compás constante.",
            "El vaivén de las olas limpia tus pensamientos y te mece con dulzura.",
            "La luz del faro vela por tu tranquilidad en esta noche de paz."
          ]
        },
        {
          id: "sleep-tea-lights",
          name: "El Jardín de las Luces de Té",
          desc: "Encuentra calma encendiendo pequeñas luces de gratitud antes de dormir.",
          duration: "5 min",
          sentences: [
            "Imagina un jardín oscuro iluminado por pequeñas velas en recipientes de cristal.",
            "Cada vela representa algo hermoso por lo que puedes dar gracias hoy.",
            "Siente la calidez de la gratitud encendiendo tu pecho con suavidad.",
            "Con el corazón agradecido y relajado, te entregas al descanso reparador."
          ]
        }
      ]
    },
    {
      id: "mindful-mornings",
      title: "Mañanas Conscientes",
      desc: "Rutinas cortas y poderosas para despertar tu cuerpo con suavidad, enfocar tu atención y comenzar el día con propósito.",
      icon: "Sun",
      color: "from-amber-500/10 to-emerald-500/10",
      textColor: "text-amber-300",
      borderColor: "border-amber-500/20",
      exercises: [
        {
          id: "morning-sunrise-clarity",
          name: "Claridad del Amanecer",
          desc: "Establece tu intención y sintoniza tu vibración matutina.",
          duration: "4 min",
          sentences: [
            "Abre los ojos y siente la luz fresca del amanecer entrando en tu espacio.",
            "Inhala profundamente el aire nuevo, llenándote de energía y vitalidad.",
            "Visualiza tu día transcurriendo con fluidez, paz y enfoque claro.",
            "Establece tu intención: Hoy elijo actuar con calma y compasión."
          ]
        },
        {
          id: "morning-sensory-awakening",
          name: "Despertar Sensorial",
          desc: "Conecta con tu respiración y estira suavemente tu mente y cuerpo.",
          duration: "3 min",
          sentences: [
            "Estira tus brazos y tus dedos suavemente, despertando tu cuerpo físico.",
            "Presta atención al latido rítmico de tu corazón en el pecho.",
            "Siente la temperatura del aire matutino sobre tu piel.",
            "Estás vivo, despierto y listo para recibir los regalos de este nuevo día."
          ]
        },
        {
          id: "morning-power-affirmations",
          name: "Afirmaciones de Poder",
          desc: "Decretos de confianza y paz para afrontar la jornada con fuerza espiritual.",
          duration: "4 min",
          sentences: [
            "Repite mentalmente con convicción: Soy capaz, soy fuerte, estoy en paz.",
            "Tengo la sabiduría necesaria para afrontar cualquier reto hoy.",
            "Mi mente está clara y mi corazón está de intenciones nobles.",
            "Camino con confianza, sabiendo que el universo apoya mi crecimiento."
          ]
        },
        {
          id: "morning-energy-wellspring",
          name: "La Fuente de Energía",
          desc: "Visualiza luz dorada revitalizando cada célula de tu cuerpo.",
          duration: "4 min",
          sentences: [
            "Visualiza una esfera de luz dorada brillante justo encima de tu cabeza.",
            "Siente cómo esa luz líquida desciende, revitalizando tus músculos y mente.",
            "La energía fluye libremente, disolviendo cualquier rastro de cansancio.",
            "Te sientes ligero, lleno de vitalidad y con una alegría serena."
          ]
        },
        {
          id: "morning-mindful-step",
          name: "Paso a Paso Consciente",
          desc: "Camina con presencia pura hacia tus actividades de hoy.",
          duration: "3 min",
          sentences: [
            "Coloca tus pies firmemente sobre el suelo y siente la conexión con la tierra.",
            "Da tu primer paso del día sintiendo la presión y el soporte del suelo.",
            "No hay prisa. Cada paso es un acto de presencia pura.",
            "Camina conscientemente hacia tu jornada, habitando plenamente tu cuerpo."
          ]
        },
        {
          id: "morning-light-shield",
          name: "Escudo de Luz",
          desc: "Crea una burbuja de protección y serenidad para proteger tu campo energético.",
          duration: "4 min",
          sentences: [
            "Imagina una burbuja de luz blanca y cálida rodeando todo tu cuerpo.",
            "Esta burbuja actúa como un escudo protector para tu energía mental hoy.",
            "Las tensiones y negatividades externas resbalarán sin afectarte.",
            "Mantienes tu paz interior intacta, irradiando serenidad a donde vayas."
          ]
        },
        {
          id: "morning-gratitude-awakening",
          name: "El Despertar de la Gratitud",
          desc: "Agradece tres bendiciones sencillas para abrir tu corazón a la abundancia.",
          duration: "4 min",
          sentences: [
            "Antes de empezar tus tareas, piensa en tres cosas sencillas que agradeces hoy.",
            "Puede ser el calor de la cama, una taza de café, o el simple hecho de respirar.",
            "Siente cómo la gratitud expande tu pecho y dibuja una suave sonrisa en tu rostro.",
            "Comienzas el día con abundancia en tu corazón. Estás listo."
          ]
        }
      ]
    }
  ],
  en: [
    {
      id: "stress-reduction",
      title: "Stress Reduction",
      desc: "Techniques designed to soothe the nervous system, dissolve physical tension, and restore mental peace in overwhelming situations.",
      icon: "ZapOff",
      color: "from-rose-500/10 to-orange-500/10",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      exercises: [
        {
          id: "stress-sos",
          name: "SOS Breath",
          desc: "Immediate reset and calming for moments of panic or overwhelming distress.",
          duration: "3 min",
          sentences: [
            "Stop for a moment. Inhale deeply through your nose for four seconds...",
            "Hold your breath for four seconds...",
            "Exhale slowly through your mouth, releasing the tension...",
            "Feel your body loosen. You are here, you are safe."
          ]
        },
        {
          id: "stress-body-scan",
          name: "Body Scan of Calm",
          desc: "Soften accumulated tension from head to toe with complete awareness.",
          duration: "5 min",
          sentences: [
            "Close your eyes and bring your attention to your feet, relaxing them completely.",
            "Move up through your legs, your abdomen, and your chest, feeling the tension melt away.",
            "Relax your shoulders and your jaw. Feel your body light as a feather.",
            "Rest in this pleasant sensation of physical lightness."
          ]
        },
        {
          id: "stress-dissolve-worries",
          name: "Dissolve Worries",
          desc: "Guided visualization to detach yourself from stressful thoughts.",
          duration: "4 min",
          sentences: [
            "Visualize your current worries as dry leaves resting on a river.",
            "Watch as the river gently carries them away downstream.",
            "You do not need to hold onto them. Let them flow and fade away.",
            "Your mind remains clean and clear like pure spring water."
          ]
        },
        {
          id: "stress-grounding-54321",
          name: "Present Grounding",
          desc: "Connect with your physical senses here and now to stop mental noise.",
          duration: "4 min",
          sentences: [
            "Connect with your surroundings. Mentally name three things you can see around you.",
            "Pay attention to two sounds you can hear in this very moment.",
            "Feel the touch of the air or clothing against your skin.",
            "You are fully present. The storm in your mind has passed."
          ]
        },
        {
          id: "stress-muscle-release",
          name: "Jaw and Shoulder Release",
          desc: "Quick muscle tension and relaxation to release accumulated stress.",
          duration: "3 min",
          sentences: [
            "Clench your fists and shoulders tightly for three seconds...",
            "Now release them suddenly, feeling the rush of relaxation.",
            "Let your jaw drop slightly and allow your tongue to rest.",
            "Feel the delicious wave of physical relief flowing through your body."
          ]
        },
        {
          id: "stress-safe-haven",
          name: "The Safe Haven",
          desc: "Create a sacred space of absolute peace and protection in your mind.",
          duration: "5 min",
          sentences: [
            "Imagine a place in nature where you feel completely safe and protected.",
            "Listen to the peaceful sounds of this mental sanctuary.",
            "Feel that nothing and no one can disturb your peace in this space.",
            "This haven is always within you. You can return whenever you wish."
          ]
        },
        {
          id: "stress-mental-detox",
          name: "Mental Detox",
          desc: "Conscious cleansing of daily information overload.",
          duration: "4 min",
          sentences: [
            "Inhale fresh air, visualizing it as light cleansing your mind of repetitive thoughts.",
            "As you exhale, imagine releasing gray smoke representing mental noise.",
            "Feel the space inside your head become vast and quiet.",
            "Enjoy this moment of inner clarity and silence."
          ]
        }
      ]
    },
    {
      id: "sleep-stories",
      title: "Sleep Stories",
      desc: "Slow-paced tales and enveloping atmospheres designed to guide your mind into deep, restful sleep.",
      icon: "Moon",
      color: "from-indigo-500/10 to-purple-500/10",
      textColor: "text-indigo-300",
      borderColor: "border-indigo-500/20",
      exercises: [
        {
          id: "sleep-blue-mist",
          name: "The Valley of Blue Mist",
          desc: "Walk along a path of infinite tranquility and disconnect.",
          duration: "6 min",
          sentences: [
            "Imagine walking along a soft path surrounded by a gentle blue mist.",
            "The mist caresses your skin and wraps you in a feeling of deep calm.",
            "Each step you take distances you from the worries of the day.",
            "You let yourself be carried away by the silent peace of the path."
          ]
        },
        {
          id: "sleep-wind-temple",
          name: "The Temple of the Wind",
          desc: "Listen to the wisdom of the wind in the sacred mountains.",
          duration: "5 min",
          sentences: [
            "Visualize an ancient stone temple atop a quiet, peaceful hill.",
            "The gentle wind caresses the bell towers, creating a hypnotic melody.",
            "You lie down on the warm floor of the temple, listening to the music of the air.",
            "Your breathing synchronizes with the steady whisper of the wind."
          ]
        },
        {
          id: "sleep-lake-silence",
          name: "The Lake of Silence",
          desc: "Contemplate peaceful waters beneath a silver moon.",
          duration: "5 min",
          sentences: [
            "Contemplate a beautiful lake whose waters are so still they look like a perfect mirror.",
            "The moon reflects with a silvery glow on the motionless surface.",
            "Feel the stillness of the water transfer into your own mind.",
            "You sink into absolute calm, ready for heavenly rest."
          ]
        },
        {
          id: "sleep-whispering-forest",
          name: "The Whispering Forest",
          desc: "A nighttime stroll blanketed by the murmur of ancient leaves.",
          duration: "6 min",
          sentences: [
            "Enter an ancient forest at night, where the leaves whisper stories of peace.",
            "The scent of pine and damp earth wraps you in comforting warmth.",
            "The trees watch over you, swaying gently in the night breeze.",
            "You let yourself fall asleep feeling protected by wise nature."
          ]
        },
        {
          id: "sleep-clouds-journey",
          name: "The Journey of the Clouds",
          desc: "Float weightlessly toward a state of absolute peace.",
          duration: "5 min",
          sentences: [
            "Imagine lying down on a warm, fluffy, comfortable cloud.",
            "The cloud rises gently, floating weightlessly beneath the stars.",
            "Feel all the physical weight fade away from your muscles.",
            "You float free, light, and in complete communion with the dream universe."
          ]
        },
        {
          id: "sleep-lighthouse-end",
          name: "The Lighthouse at the End of the World",
          desc: "Rest while feeling the gentle rise and fall of safe waves.",
          duration: "6 min",
          sentences: [
            "Observe a safe lighthouse in the distance emitting a warm, rhythmic light.",
            "Listen to the gentle waves lapping the base of the rocks in a steady rhythm.",
            "The sway of the water cleanses your thoughts and rocks you gently.",
            "The lighthouse light watches over your tranquility in this peaceful night."
          ]
        },
        {
          id: "sleep-tea-lights",
          name: "The Garden of Tea Lights",
          desc: "Find calm by lighting small tea lights of gratitude before sleep.",
          duration: "5 min",
          sentences: [
            "Imagine a dark garden illuminated by small candles in glass jars.",
            "Each candle represents something beautiful you can be grateful for today.",
            "Feel the warmth of gratitude gently lighting up your chest.",
            "With a grateful and relaxed heart, you surrender to restful sleep."
          ]
        }
      ]
    },
    {
      id: "mindful-mornings",
      title: "Mindful Mornings",
      desc: "Short and powerful routines to wake up your body gently, focus your attention, and start the day with purpose.",
      icon: "Sun",
      color: "from-amber-500/10 to-emerald-500/10",
      textColor: "text-amber-300",
      borderColor: "border-amber-500/20",
      exercises: [
        {
          id: "morning-sunrise-clarity",
          name: "Sunrise Clarity",
          desc: "Set your intention and attune your morning vibration.",
          duration: "4 min",
          sentences: [
            "Open your eyes and feel the fresh light of dawn entering your space.",
            "Inhale the new air deeply, filling yourself with energy and vitality.",
            "Visualize your day unfolding with ease, peace, and clear focus.",
            "Set your intention: Today, I choose to act with calm and compassion."
          ]
        },
        {
          id: "morning-sensory-awakening",
          name: "Sensory Awakening",
          desc: "Connect with your breath and gently stretch your mind and body.",
          duration: "3 min",
          sentences: [
            "Gently stretch your arms and fingers, awakening your physical body.",
            "Pay attention to the rhythmic beating of your heart in your chest.",
            "Feel the temperature of the morning air on your skin.",
            "You are alive, awake, and ready to receive the gifts of this new day."
          ]
        },
        {
          id: "morning-power-affirmations",
          name: "Power Affirmations",
          desc: "Decrees of confidence and peace to face the day with spiritual strength.",
          duration: "4 min",
          sentences: [
            "Repeat mentally with conviction: I am capable, I am strong, I am at peace.",
            "I have the necessary wisdom to face any challenge today.",
            "My mind is clear and my heart is filled with noble intentions.",
            "I walk with confidence, knowing the universe supports my growth."
          ]
        },
        {
          id: "morning-energy-wellspring",
          name: "The Wellspring of Energy",
          desc: "Visualize golden light revitalizing every cell in your body.",
          duration: "4 min",
          sentences: [
            "Visualize a sphere of brilliant golden light right above your head.",
            "Feel that liquid light descend, revitalizing your muscles and mind.",
            "The energy flows freely, dissolving any trace of tiredness.",
            "You feel light, filled with vitality, and carrying a serene joy."
          ]
        },
        {
          id: "morning-mindful-step",
          name: "Mindful Step-by-Step",
          desc: "Walk with pure presence toward your daily activities.",
          duration: "3 min",
          sentences: [
            "Place your feet firmly on the ground, feeling the connection with the earth.",
            "Take your first step of the day, sensing the pressure and support of the floor.",
            "There is no rush. Every step is an act of pure presence.",
            "Walk mindfully into your day, fully inhabiting your body."
          ]
        },
        {
          id: "morning-light-shield",
          name: "Shield of Light",
          desc: "Create a bubble of protection and serenity to shield your energetic field.",
          duration: "4 min",
          sentences: [
            "Imagine a bubble of warm, white light surrounding your entire body.",
            "This bubble acts as a protective shield for your mental energy today.",
            "External tensions and negativities will slide off without affecting you.",
            "You keep your inner peace intact, radiating serenity wherever you go."
          ]
        },
        {
          id: "morning-gratitude-awakening",
          name: "Gratitude Awakening",
          desc: "Acknowledge three simple blessings to open your heart to abundance.",
          duration: "4 min",
          sentences: [
            "Before starting your tasks, think of three simple things you are grateful for today.",
            "It could be the warmth of your bed, a cup of coffee, or simply breathing.",
            "Feel how gratitude expands your chest and draws a soft smile on your face.",
            "You start the day with abundance in your heart. You are ready."
          ]
        }
      ]
    }
  ],
  pt: [
    {
      id: "stress-reduction",
      title: "Redução do Estresse",
      desc: "Técnicas projetadas para acalmar o sistema nervoso, dissolver a tensão física e restaurar a paz mental diante de situações opressoras.",
      icon: "ZapOff",
      color: "from-rose-500/10 to-orange-500/10",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      exercises: [
        {
          id: "stress-sos",
          name: "Respiro SOS",
          desc: "Restabelecimento imediato e calma para momentos de pânico ou sobrecarga.",
          duration: "3 min",
          sentences: [
            "Pare por um momento. Inspire profundamente pelo nariz por quatro segundos...",
            "Segure a respiração por quatro segundos...",
            "Expire lentamente pela boca, liberando a tensão...",
            "Sinta seu corpo relaxar. Você está aqui, você está seguro."
          ]
        },
        {
          id: "stress-body-scan",
          name: "Escaneamento Corporal de Calma",
          desc: "Suavize a tensão acumulada de pés a cabeça com consciência plena.",
          duration: "5 min",
          sentences: [
            "Feche os olhos e leve a atenção aos seus pés, relaxando-os completamente.",
            "Suba pelas pernas, abdômen e peito, sentindo as tensões se dissiparem.",
            "Relaxe os ombros e o maxilar. Sinta seu corpo leve como uma pena.",
            "Descanse nesta sensação agradável de leveza corporal."
          ]
        },
        {
          id: "stress-dissolve-worries",
          name: "Dissolver Preocupações",
          desc: "Visualização guiada para desapegar-se dos pensamentos estressantes.",
          duration: "4 min",
          sentences: [
            "Visualize suas preocupações atuais como pequenas folhas secas em um rio.",
            "Observe como o rio as leva suavemente corrente abaixo.",
            "Você não precisa se apegar a elas. Deixe-as fluir e desaparecer.",
            "Sua mente fica limpa e clara como água de nascente."
          ]
        },
        {
          id: "stress-grounding-54321",
          name: "Ancoragem no Presente",
          desc: "Conecte-se com seus sentidos físicos aqui e agora para parar o ruído mental.",
          duration: "4 min",
          sentences: [
            "Conecte-se com o ambiente. Nomeie mentalmente três coisas que você pode ver ao seu redor.",
            "Preste atenção a dois sons que consegue perceber neste instante.",
            "Sinta o toque do ar ou da roupa na sua pele.",
            "Você está totalmente presente. A tempestade na sua mente passou."
          ]
        },
        {
          id: "stress-muscle-release",
          name: "Liberação de Maxilar e Ombros",
          desc: "Tensão e relaxamento muscular rápido para liberar o estresse acumulado.",
          duration: "3 min",
          sentences: [
            "Aperte os punhos e os ombros com força por três segundos...",
            "Agora solte-os de repente, sentindo o fluxo de relaxamento.",
            "Deixe o maxilar relaxar e a língua descansar.",
            "Sinta a deliciosa onda de alívio físico percorrendo seu corpo."
          ]
        },
        {
          id: "stress-safe-haven",
          name: "O Refúgio Seguro",
          desc: "Crie um espaço sagrado de paz e proteção absoluta em sua mente.",
          duration: "5 min",
          sentences: [
            "Imagine um lugar na natureza onde você se sinta totalmente seguro e protegido.",
            "Ouça os sons pacíficos deste santuário mental.",
            "Sinta que nada nem ninguém pode perturbar sua paz neste espaço.",
            "Este refúgio sempre está dentro de você. Pode voltar quando quiser."
          ]
        },
        {
          id: "stress-mental-detox",
          name: "Detox Mental",
          desc: "Limpeza consciente da sobrecarga de informação diária.",
          duration: "4 min",
          sentences: [
            "Inspire ar fresco e visualize-o como uma luz que limpa sua mente de pensamentos repetitivos.",
            "Ao expirar, imagine liberar uma fumaça cinza que representa o ruído mental.",
            "Sinta como o espaço dentro da sua cabeça se torna amplo e silencioso.",
            "Aproveite este momento de clareza e silêncio interior."
          ]
        }
      ]
    },
    {
      id: "sleep-stories",
      title: "Histórias para Dormir",
      desc: "Relatos calmos e atmosferas envolventes projetadas para guiar sua mente a um sono reparador e profundo.",
      icon: "Moon",
      color: "from-indigo-500/10 to-purple-500/10",
      textColor: "text-indigo-300",
      borderColor: "border-indigo-500/20",
      exercises: [
        {
          id: "sleep-blue-mist",
          name: "O Vale da Névoa Azul",
          desc: "Caminhe por uma trilha de tranquilidade infinita e desligue-se.",
          duration: "6 min",
          sentences: [
            "Imagine caminhar por uma trilha suave cercada por uma névoa azulada.",
            "A névoa acarinha sua pele e o envolve em uma sensação de calma profunda.",
            "Cada passo dado o afasta das preocupações do dia.",
            "Você se deixa levar pela paz silenciosa do caminho."
          ]
        },
        {
          id: "sleep-wind-temple",
          name: "O Templo do Vento",
          desc: "Ouça a sabedoria do vento nas montanhas sagradas.",
          duration: "5 min",
          sentences: [
            "Visualize um antigo templo de pedra no topo de uma colina calma.",
            "O vento suave acaricia os campanários, criando uma melodia hipnótica.",
            "Você se deita no chão quente do templo, ouvindo a música do ar.",
            "Sua respiração se sincroniza com o sussurro constante do vento."
          ]
        },
        {
          id: "sleep-lake-silence",
          name: "O Lago do Silêncio",
          desc: "Contemple as águas calmas sob uma lua de prata.",
          duration: "5 min",
          sentences: [
            "Contemple um belo lago cujas águas são tão calmas que parecem um espelho perfeito.",
            "A lua se reflete com um brilho prateado na superfície imóvel.",
            "Sinta a quietude da água se transferir para sua própria mente.",
            "Você mergulha em uma calma absoluta, pronto para o descanso celestial."
          ]
        },
        {
          id: "sleep-whispering-forest",
          name: "A Floresta dos Sussurros",
          desc: "Um passeio noturno acolhido pelo sussurro de folhas antigas.",
          duration: "6 min",
          sentences: [
            "Entre em uma floresta antiga à noite, onde as folhas sussurram histórias de paz.",
            "O aroma de pinho e terra úmida o envolve em um calor reconfortante.",
            "As árvores cuidam de você, balançando suavemente sob a brisa noturna.",
            "Você adormece sentindo-se protegido pela natureza sábia."
          ]
        },
        {
          id: "sleep-clouds-journey",
          name: "A Viagem das Nuvens",
          desc: "Flutue sem gravidade em direção a um estado de paz absoluta.",
          duration: "5 min",
          sentences: [
            "Imagine deitar-se em uma nuvem fofa e calorosa.",
            "A nuvem sobe suavemente, flutuando sem gravidade sob as estrelas.",
            "Sinta todo o peso físico desaparecer dos seus músculos.",
            "Você flutua livre, leve e em completa comunhão com o universo do sono."
          ]
        },
        {
          id: "sleep-lighthouse-end",
          name: "O Farol no Fim do Mundo",
          desc: "Descanse sentindo o suave balanço das ondas seguras.",
          duration: "6 min",
          sentences: [
            "Observe um farol seguro à distância que emite uma luz quente e rítmica.",
            "Ouça as ondas suaves batendo na base das rochas em um ritmo constante.",
            "O balanço das águas limpa seus pensamentos e o nina docemente.",
            "A luz do farol vela pela sua tranquilidade nesta noite de paz."
          ]
        },
        {
          id: "sleep-tea-lights",
          name: "O Jardim das Luzes de Chá",
          desc: "Encontre calma acendendo pequenas luzes de gratidão antes de dormir.",
          duration: "5 min",
          sentences: [
            "Imagine um jardim escuro iluminado por pequenas velas em potes de vidro.",
            "Cada vela representa algo belo pelo qual você pode agradecer hoje.",
            "Sinta o calor da gratidão acendendo suavemente seu peito.",
            "Com o coração grato e relaxado, você se entrega ao sono restaurador."
          ]
        }
      ]
    },
    {
      id: "mindful-mornings",
      title: "Manhãs Conscientes",
      desc: "Rotinas curtas e poderosas para despertar seu corpo com suavidade, focar sua atenção e começar o dia com propósito.",
      icon: "Sun",
      color: "from-amber-500/10 to-emerald-500/10",
      textColor: "text-amber-300",
      borderColor: "border-amber-500/20",
      exercises: [
        {
          id: "morning-sunrise-clarity",
          name: "Clareza do Amanhecer",
          desc: "Defina sua intenção e sintonize sua vibração matinal.",
          duration: "4 min",
          sentences: [
            "Abra os olhos e sinta a luz fresca do amanecer entrando no seu espaço.",
            "Inspire profundamente o ar novo, enchendo-se de energia e vitalidade.",
            "Visualize seu dia fluindo com facilidade, paz e foco claro.",
            "Defina sua intenção: Hoje escolho agir com calma e compaixão."
          ]
        },
        {
          id: "morning-sensory-awakening",
          name: "Despertar Sensorial",
          desc: "Conecte-se com sua respiração e alongue suavemente sua mente e corpo.",
          duration: "3 min",
          sentences: [
            "Alongue os braços e dedos suavemente, despertando seu corpo físico.",
            "Preste atenção à batida rítmica do seu coração no peito.",
            "Sinta a temperatura do ar matinal na sua pele.",
            "Você está vivo, acordado e pronto para receber os presentes deste novo dia."
          ]
        },
        {
          id: "morning-power-affirmations",
          name: "Afirmações de Poder",
          desc: "Decretos de confiança e paz para enfrentar o dia com força espiritual.",
          duration: "4 min",
          sentences: [
            "Repita mentalmente com convicção: Sou capaz, sou forte, estou em paz.",
            "Tenho a sabedoria necessária para enfrentar qualquer desafio hoje.",
            "Minha mente está clara e meu coração está cheio de intenções nobres.",
            "Caminho com confiança, sabendo que o universo apoia meu crescimento."
          ]
        },
        {
          id: "morning-energy-wellspring",
          name: "A Fonte de Energia",
          desc: "Visualize a luz dourada revitalizando cada célula do seu corpo.",
          duration: "4 min",
          sentences: [
            "Visualize uma esfera de luz dourada brilhante bem acima da sua cabeça.",
            "Sinta essa luz líquida descer, revitalizando seus músculos e mente.",
            "A energia flui livremente, dissolvendo qualquer vestígio de cansaço.",
            "Você se sente leve, cheio de vitalidade e com uma alegria serena."
          ]
        },
        {
          id: "morning-mindful-step",
          name: "Passo a Passo Consciente",
          desc: "Caminhe com presença pura em direção às suas atividades de hoje.",
          duration: "3 min",
          sentences: [
            "Coloque os pés firmemente no chão e sinta a conexão com a terra.",
            "Dê o seu primeiro passo do dia sentindo a pressão e o apoio do chão.",
            "Não há pressa. Cada passo é um ato de presença pura.",
            "Caminhe conscientemente em direção ao seu dia, habitando plenamente seu corpo."
          ]
        },
        {
          id: "morning-light-shield",
          name: "Escudo de Luz",
          desc: "Crie uma bolha de proteção e serenidade para proteger seu campo energético.",
          duration: "4 min",
          sentences: [
            "Imagine uma bolha de luz branca e calorosa ao redor de todo o seu corpo.",
            "Esta bolha age como um escudo protetor para sua energia mental hoje.",
            "Tensões e negatividades externas vão escorregar sem afetar você.",
            "Você mantém sua paz interior intacta, irradiando serenidade onde quer que vá."
          ]
        },
        {
          id: "morning-gratitude-awakening",
          name: "O Despertar da Gratidão",
          desc: "Agradeça três bênçãos simples para abrir seu coração à abundância.",
          duration: "4 min",
          sentences: [
            "Antes de começar suas tarefas, pense em três coisas simples pelas quais agradece hoje.",
            "Pode ser o calor da cama, uma xícara de café ou o simples fato de respirar.",
            "Sinta como a gratidão expande seu peito e desenha um leve sorriso no rosto.",
            "Você começa o dia com abundância em seu coração. Você está pronto."
          ]
        }
      ]
    }
  ]
};

export const PACK_LABELS = {
  es: {
    packsTitle: "Colecciones Temáticas de Meditación por Voz",
    packsSubtitle: "Programas diseñados paso a paso para disolver la tensión mental, renovar el descanso y despertar con enfoque.",
    activePackTitle: "Explorando la Colección:",
    session: "Sesión",
    playAll: "Iniciar Guía por Voz",
    playing: "Reproduciendo...",
    pause: "Pausar",
    sessionsCount: "7 Sesiones de meditación",
    duration: "Duración",
    startExercise: "Haz clic en cualquier sesión para iniciar su guía por voz con subtítulos interactivos",
    nowPlaying: "Sesión activa en curso:"
  },
  en: {
    packsTitle: "Themed Meditation Collections",
    packsSubtitle: "Step-by-step programs designed to dissolve mental tension, renew rest, and wake up with focus.",
    activePackTitle: "Exploring Collection:",
    session: "Session",
    playAll: "Start Voice Guide",
    playing: "Playing...",
    pause: "Pause",
    sessionsCount: "7 Guided sessions",
    duration: "Duration",
    startExercise: "Click on any session to start its guided voice narration with live subtitles",
    nowPlaying: "Active session in progress:"
  },
  pt: {
    packsTitle: "Coleções Temáticas de Meditação",
    packsSubtitle: "Programas desenhados passo a passo para dissolver a tensão mental, renovar o descanso e acordar com foco.",
    activePackTitle: "Explorando a Coleção:",
    session: "Sessão",
    playAll: "Iniciar Guia por Voz",
    playing: "Reproduzindo...",
    pause: "Pausar",
    sessionsCount: "7 Sessões de meditação",
    duration: "Duração",
    startExercise: "Clique em qualquer sessão para iniciar seu guia por voz com legendas interativas",
    nowPlaying: "Sessão ativa em andamento:"
  }
};
