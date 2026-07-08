import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Info, X, Zap, Heart, Flame, Shield, HelpCircle } from "lucide-react";

interface SefirahInfo {
  id: string;
  name: string;
  hebrew: string;
  color: string;
  glowColor: string;
  targetX: number;
  targetY: number;
}

// Fixed target coordinates on a 400x600 viewport
const SEFIROT_NODES: SefirahInfo[] = [
  { id: "Keter", name: "Keter", hebrew: "כֶּתֶר", color: "#ffffff", glowColor: "rgba(255, 255, 255, 0.8)", targetX: 200, targetY: 50 },
  { id: "Chokhmah", name: "Chokhmah", hebrew: "חָכְמָה", color: "#93c5fd", glowColor: "rgba(147, 197, 253, 0.8)", targetX: 310, targetY: 120 },
  { id: "Binah", name: "Binah", hebrew: "בִּינָה", color: "#f472b6", glowColor: "rgba(244, 114, 182, 0.8)", targetX: 90, targetY: 120 },
  { id: "Chesed", name: "Chesed", hebrew: "חֶסֶD", color: "#60a5fa", glowColor: "rgba(96, 165, 250, 0.8)", targetX: 310, targetY: 230 },
  { id: "Gevurah", name: "Gevurah", hebrew: "גְּבוּרָה", color: "#f87171", glowColor: "rgba(248, 113, 113, 0.8)", targetX: 90, targetY: 230 },
  { id: "Tiferet", name: "Tiferet", hebrew: "תִּפְאֶרֶת", color: "#fbbf24", glowColor: "rgba(251, 191, 36, 0.8)", targetX: 200, targetY: 300 },
  { id: "Netzah", name: "Netzah", hebrew: "נֶצַח", color: "#34d399", glowColor: "rgba(52, 211, 153, 0.8)", targetX: 310, targetY: 410 },
  { id: "Hod", name: "Hod", hebrew: "הוֹד", color: "#f59e0b", glowColor: "rgba(245, 158, 11, 0.8)", targetX: 90, targetY: 410 },
  { id: "Yesod", name: "Yesod", hebrew: "יְסוֹד", color: "#a78bfa", glowColor: "rgba(167, 139, 250, 0.8)", targetX: 200, targetY: 480 },
  { id: "Malkuth", name: "Malkuth", hebrew: "מַלְכוּת", color: "#10b981", glowColor: "rgba(16, 185, 129, 0.8)", targetX: 200, targetY: 560 }
];

const SEFIROT_LINKS = [
  { source: "Keter", target: "Chokhmah" },
  { source: "Keter", target: "Binah" },
  { source: "Keter", target: "Tiferet" },
  { source: "Chokhmah", target: "Binah" },
  { source: "Chokhmah", target: "Chesed" },
  { source: "Chokhmah", target: "Tiferet" },
  { source: "Binah", target: "Gevurah" },
  { source: "Binah", target: "Tiferet" },
  { source: "Chesed", target: "Gevurah" },
  { source: "Chesed", target: "Tiferet" },
  { source: "Chesed", target: "Netzah" },
  { source: "Gevurah", target: "Tiferet" },
  { source: "Gevurah", target: "Hod" },
  { source: "Tiferet", target: "Netzah" },
  { source: "Tiferet", target: "Hod" },
  { source: "Tiferet", target: "Yesod" },
  { source: "Netzah", target: "Hod" },
  { source: "Netzah", target: "Yesod" },
  { source: "Hod", target: "Yesod" },
  { source: "Yesod", target: "Malkuth" },
  { source: "Netzah", target: "Malkuth" },
  { source: "Hod", target: "Malkuth" }
];

// Localized Static Meanings
const LOCALIZED_SEFIROT: Record<string, Record<string, { archetype: string; description: string; meaning: string }>> = {
  es: {
    Keter: {
      archetype: "La Corona",
      description: "Consciencia Suprema, Voluntad divina y el origen inmanifestado de todo lo que es.",
      meaning: "Representa el potencial puro, la chispa de inspiración divina antes de tomar forma y la conexión directa con el Creador."
    },
    Chokhmah: {
      archetype: "La Sabiduría",
      description: "Inspiración pura, fuerza creativa activa, flash intuitivo y dinamismo generador.",
      meaning: "Es la energía masculina primordial, la revelación intuitiva y el flujo inicial de ideas cósmicas."
    },
    Binah: {
      archetype: "La Comprensión",
      description: "Estructura, entendimiento racional, contención y la Gran Madre cósmica.",
      meaning: "Vierte el flujo caótico de Chokhmah en un molde conceptual, dando forma, lógica y capacidad de entendimiento profundo."
    },
    Chesed: {
      archetype: "La Misericordia",
      description: "Amor ilimitado, generosidad infinita, expansión benévola y compasión.",
      meaning: "Representa la fuerza que da sin pedir nada a cambio, el deseo de compartir y expandirse de manera amorosa."
    },
    Gevurah: {
      archetype: "La Severidad / Fuerza",
      description: "Disciplina sagrada, justicia, límites saludables, rigor y discernimiento riguroso.",
      meaning: "Equilibra a Chesed limitando su expansión desmedida. Representa la fuerza de decir 'no', estructurar límites y el discernimiento."
    },
    Tiferet: {
      archetype: "La Belleza",
      description: "Armonía cósmica, compasión balanceada, el corazón y el autoconocimiento.",
      meaning: "El centro del Árbol de la Vida. Integra la misericordia de Chesed y el rigor de Gevurah en un equilibrio perfecto y sanador."
    },
    Netzah: {
      archetype: "La Victoria",
      description: "Emoción persistente, pasión impulsora, instintos y fuerza artística indomable.",
      meaning: "Representa la resistencia a largo plazo, la victoria sobre los obstáculos emocionales y la energía artística que no conoce límites."
    },
    Hod: {
      archetype: "El Esplendor",
      description: "Intelecto analítico, comunicación, verdad, magia práctica y sincera humildad.",
      meaning: "Canaliza las emociones de Netzah a través del intelecto estructurado, permitiendo la comunicación fluida, el estudio y el refinamiento."
    },
    Yesod: {
      archetype: "El Fundamento",
      description: "Mente inconsciente, sueños, fuerza de atracción y canalización psíquica.",
      meaning: "La puerta de entrada a la manifestación. Reúne las energías de las esferas superiores y las prepara para concretarse en el mundo físico."
    },
    Malkuth: {
      archetype: "El Reino",
      description: "El mundo físico, manifestación tangible, conexión con la tierra y el cuerpo.",
      meaning: "El destino final del flujo de energía divina. Es donde las ideas, intenciones y oraciones se vuelven materia real y acción."
    }
  },
  en: {
    Keter: {
      archetype: "The Crown",
      description: "Supreme Consciousness, Divine Will, and the unmanifested origin of all existence.",
      meaning: "Represents pure potential, the spark of divine inspiration before taking shape, and the direct connection with the Source."
    },
    Chokhmah: {
      archetype: "Wisdom",
      description: "Pure inspiration, active creative force, intuitive flash, and generating dynamism.",
      meaning: "It is the primordial masculine energy, intuitive revelation, and the initial flow of cosmic ideas."
    },
    Binah: {
      archetype: "Understanding",
      description: "Structure, rational understanding, containment, and the Great Cosmic Mother.",
      meaning: "Pours the chaotic flow of Chokhmah into a conceptual mold, giving shape, logic, and deep comprehension."
    },
    Chesed: {
      archetype: "Mercy / Lovingkindness",
      description: "Limitless love, infinite generosity, benevolent expansion, and compassion.",
      meaning: "Represents the force of giving without expecting anything in return, the desire to share, and loving expansion."
    },
    Gevurah: {
      archetype: "Severity / Strength",
      description: "Sacred discipline, justice, healthy boundaries, rigor, and sharp discernment.",
      meaning: "Balances Chesed by limiting wild expansion. Represents the strength to say 'no', build boundaries, and execute justice."
    },
    Tiferet: {
      archetype: "Beauty",
      description: "Cosmic harmony, balanced compassion, the heart, and profound self-knowledge.",
      meaning: "The center of the Tree of Life. Integrates the mercy of Chesed and the rigor of Gevurah into a perfect healing balance."
    },
    Netzah: {
      archetype: "Victory / Endurance",
      description: "Persistent emotion, driving passion, instincts, and indomitable artistic force.",
      meaning: "Represents long-term resilience, victory over emotional obstacles, and artistic energy that knows no bounds."
    },
    Hod: {
      archetype: "Splendor",
      description: "Analytical intellect, communication, truth, practical magic, and sincere humility.",
      meaning: "Channels the emotions of Netzah through the structured intellect, allowing fluid communication, study, and refinement."
    },
    Yesod: {
      archetype: "The Foundation",
      description: "Unconscious mind, dreams, force of attraction, and psychic canalization.",
      meaning: "The gateway to manifestation. Gathers the energies of the upper spheres and prepares them to crystallize in the physical world."
    },
    Malkuth: {
      archetype: "The Kingdom",
      description: "The physical world, tangible manifestation, connection with earth and body.",
      meaning: "The ultimate destination of the divine energy flow. It is where ideas, intentions, and prayers turn into actual matter and action."
    }
  },
  pt: {
    Keter: {
      archetype: "A Coroa",
      description: "Consciência Suprema, Vontade divina e a origem imanifesta de tudo o que é.",
      meaning: "Representa o potencial puro, a centelha de inspiração divina antes de tomar forma e a conexão direta com o Criador."
    },
    Chokhmah: {
      archetype: "A Sabedoria",
      description: "Inspiração pura, força criativa ativa, flash intuitivo e dinamismo gerador.",
      meaning: "É a energia masculina primordial, a revelação intuitiva e o fluxo inicial de ideias cósmicas."
    },
    Binah: {
      archetype: "A Compreensão",
      description: "Estrutura, entendimento racional, contenção e a Grande Mãe cósmica.",
      meaning: "Verte o fluxo caótico de Chokhmah em um molde conceitual, dando forma, lógica e capacidade de entendimento profundo."
    },
    Chesed: {
      archetype: "A Misericórdia",
      description: "Amor ilimitado, generosidade infinita, expansão benevolente e compaixão.",
      meaning: "Representa a força que doa sem pedir nada em troca, o desejo de compartilhar e expandir-se de forma amorosa."
    },
    Gevurah: {
      archetype: "A Severidade / Força",
      description: "Disciplina sagrada, justiça, limites saudáveis, rigor e discernimento rigoroso.",
      meaning: "Equilibra Chesed limitando sua expansão desmedida. Representa a força de dizer 'não', estruturar limites e o discernimiento."
    },
    Tiferet: {
      archetype: "A Beleza",
      description: "Harmonia cósmica, compaixão equilibrada, o coração e o autoconhecimento.",
      meaning: "O centro da Árvore da Vida. Integra a misericórdia de Chesed e o rigor de Gevurah em um equilíbrio perfeito e curador."
    },
    Netzah: {
      archetype: "A Vitória",
      description: "Emoção persistente, paixão motriz, instintos e força artística indomável.",
      meaning: "Representa a resistência a longo prazo, a vitória sobre os obstáculos emocionais e a energia artística sem limites."
    },
    Hod: {
      archetype: "O Esplendor",
      description: "Intelecto analítico, comunicação, verdade, magia prática e sincera humildade.",
      meaning: "Canaliza as emoções de Netzah através do intelecto estruturado, permitindo a comunicação fluida, estudo e refinamento."
    },
    Yesod: {
      archetype: "O Fundamento",
      description: "Mente inconsciente, sonhos, força de atração e canalização psíquica.",
      meaning: "O portal de entrada para a manifestação. Reúne as energias das esferas superiores e as prepara para se concretizarem no mundo físico."
    },
    Malkuth: {
      archetype: "O Reino",
      description: "O mundo físico, manifestação tangível, conexão com a terra e o corpo.",
      meaning: "O destino final do fluxo de energia divina. É onde ideias, intenções e orações se tornam matéria real e ação concreta."
    }
  },
  de: {
    Keter: {
      archetype: "Die Krone",
      description: "Höchstes Bewusstsein, Göttlicher Wille und der unmanifestierte Ursprung aller Existenz.",
      meaning: "Repräsentiert das reine Potenzial, den Funken der göttlichen Inspiration vor jeder Form und die direkte Verbindung mit der Quelle."
    },
    Chokhmah: {
      archetype: "Die Weisheit",
      description: "Reine Inspiration, aktive kreative Kraft, intuitiver Geistesblitz und schöpferische Dynamik.",
      meaning: "Es ist die uranfängliche maskuline Energie, die intuitive Offenbarung und der anfängliche Fluss kosmischer Ideen."
    },
    Binah: {
      archetype: "Der Verstand",
      description: "Struktur, rationales Verständnis, Eingrenzung und die Große Kosmische Mutter.",
      meaning: "Gießt den chaotischen Fluss von Chokhmah in eine begriffliche Form und schenkt Struktur, Logik und tiefes Verständnis."
    },
    Chesed: {
      archetype: "Die Barmherzigkeit",
      description: "Grenzenlose Liebe, unendliche Großzügigkeit, gütige Ausdehnung und Mitgefühl.",
      meaning: "Repräsentiert die Kraft des Gebens, ohne Gegenleistung zu erwarten, den Wunsch zu teilen und liebevolle Expansion."
    },
    Gevurah: {
      archetype: "Die Strenge / Stärke",
      description: "Heilige Disziplin, Gerechtigkeit, gesunde Grenzen, Strenge und scharfe Unterscheidungskraft.",
      meaning: "Gleicht Chesed aus, indem sie maßlose Ausdehnung begrenzt. Steht für die Kraft, 'Nein' zu sagen, Grenzen zu setzen und Gerechtigkeit zu üben."
    },
    Tiferet: {
      archetype: "Die Schönheit",
      description: "Kosmische Harmonie, ausgewogenes Mitgefühl, das Herz und tiefe Selbsterkenntnis.",
      meaning: "Das Zentrum des Lebensbaums. Integriert die Barmherzigkeit von Chesed und die Strenge von Gevurah in ein perfektes, heilendes Gleichgewicht."
    },
    Netzah: {
      archetype: "Der Sieg / Ausdauer",
      description: "Anhaltendes Gefühl, treibende Leidenschaft, Instinkte und unbezähmbare künstlerische Kraft.",
      meaning: "Repräsentiert langfristige Widerstandsfähigkeit, den Sieg über emotionale Hindernisse und grenzenlose kreative Kraft."
    },
    Hod: {
      archetype: "Die Pracht",
      description: "Analytischer Intellekt, Kommunikation, Wahrheit, praktische Magie und aufrichtige Demut.",
      meaning: "Leitet die Emotionen von Netzah durch den strukturierten Intellekt, was flüssige Kommunikation, Studium und Verfeinerung ermöglicht."
    },
    Yesod: {
      archetype: "Das Fundament",
      description: "Unterbewusstsein, Träume, Anziehungskraft und psychische Kanalisierung.",
      meaning: "Das Tor zur Manifestation. Sammelt die Energien der oberen Sphären und bereitet sie auf die Verwirklichung in der physischen Welt vor."
    },
    Malkuth: {
      archetype: "Das Königreich",
      description: "Die physische Welt, greifbare Manifestation, Verbindung mit der Erde und dem Körper.",
      meaning: "Das endgültige Ziel des göttlichen Energieflusses. Hier werden Ideen, Absichten und Gebete zu tatsächlicher Materie und Handlung."
    }
  }
};

const UI_DICT: Record<string, {
  instructions: string;
  activeSefirahHeader: string;
  strengthHeader: string;
  shadowHeader: string;
  generalWisdomHeader: string;
  closeBtn: string;
  exploreTip: string;
  noReadingYet: string;
  hebrewLabel: string;
}> = {
  es: {
    instructions: "Interactúa con las Sefirot para explorar sus energías divinas. Arrastra las esferas para sentir las fuerzas sagradas que las unen.",
    activeSefirahHeader: "Sefirá de Alineación Activa de Hoy",
    strengthHeader: "Tu Fortaleza de Hoy",
    shadowHeader: "Tu Desafío / Sombra de Hoy",
    generalWisdomHeader: "Sabiduría General de esta Esfera",
    closeBtn: "Cerrar Panel",
    exploreTip: "Haz clic en cualquier esfera para sintonizar con su sabiduría.",
    noReadingYet: "Revela tu alineación cabalística arriba para ver tu Sefirá activa personalizada y activar la lectura interactiva.",
    hebrewLabel: "Glifo Hebreo:"
  },
  en: {
    instructions: "Interact with the Sefirot to explore their divine energies. Drag the spheres to feel the sacred forces binding them.",
    activeSefirahHeader: "Your Active Alignment Sefirah Today",
    strengthHeader: "Your Strength Today",
    shadowHeader: "Your Challenge / Shadow Today",
    generalWisdomHeader: "General Wisdom of this Sphere",
    closeBtn: "Close Panel",
    exploreTip: "Click on any sphere to tune into its wisdom.",
    noReadingYet: "Reveal your cabalistic alignment above to view your personalized active Sefirah and enable interactive readings.",
    hebrewLabel: "Hebrew Glyph:"
  },
  pt: {
    instructions: "Interaja com as Sefirot para explorar suas energias divinas. Arraste as esferas para sentir as forças sagradas que as unem.",
    activeSefirahHeader: "Sua Sefirá de Alinhamento Ativa Hoje",
    strengthHeader: "Sua Força Hoje",
    shadowHeader: "Seu Desafio / Sombra Hoje",
    generalWisdomHeader: "Sabedoria Geral desta Esfera",
    closeBtn: "Fechar Painel",
    exploreTip: "Clique em qualquer esfera para sintonizar com sua sabedoria.",
    noReadingYet: "Revele seu alinhamento cabalístico acima para ver sua Sefirá ativa personalizada e ativar a leitura interativa.",
    hebrewLabel: "Glifo Hebraico:"
  },
  de: {
    instructions: "Interagiere mit den Sefirot, um ihre göttlichen Energien zu erkunden. Ziehe an den Sphären, um die heiligen Kräfte zu spüren, die sie verbinden.",
    activeSefirahHeader: "Deine aktive Ausrichtungs-Sefirah heute",
    strengthHeader: "Deine Stärke heute",
    shadowHeader: "Deine Herausforderung / Schatten heute",
    generalWisdomHeader: "Allgemeine Weisheit dieser Sphäre",
    closeBtn: "Schließen",
    exploreTip: "Klicke auf eine Sphäre, um dich mit ihrer Weisheit zu verbinden.",
    noReadingYet: "Enthülle oben deine kabbalistische Ausrichtung, um deine personalisierte aktive Sefirah zu sehen und interaktive Lesungen freizuschalten.",
    hebrewLabel: "Hebräische Schrift:"
  }
};

interface TreeOfLifeVisualizerProps {
  treeReading: any;
  language: "es" | "en" | "pt" | "de";
}

export default function TreeOfLifeVisualizer({ treeReading, language }: TreeOfLifeVisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const nodesRef = useRef<any[]>(SEFIROT_NODES);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<any[]>(() =>
    SEFIROT_NODES.map(d => ({
      ...d,
      x: d.targetX,
      y: d.targetY,
      fx: null,
      fy: null
    }))
  );
  const [links, setLinks] = useState<any[]>(() =>
    SEFIROT_LINKS.map(d => {
      const sourceNode = SEFIROT_NODES.find(n => n.id === d.source)!;
      const targetNode = SEFIROT_NODES.find(n => n.id === d.target)!;
      return {
        source: { ...sourceNode, x: sourceNode.targetX, y: sourceNode.targetY },
        target: { ...targetNode, x: targetNode.targetX, y: targetNode.targetY }
      };
    })
  );

  const dict = UI_DICT[language] || UI_DICT.es;
  const activeSefirahName = treeReading?.activeSefirah?.name;

  // Set up selected node automatically when treeReading updates
  useEffect(() => {
    if (activeSefirahName) {
      setSelectedNodeId(activeSefirahName);
    }
  }, [activeSefirahName]);

  // Drag handlers using ref to prevent stale closures
  const handleDragStart = (event: any, nodeIndex: number) => {
    if (!simulationRef.current) return;
    if (!event.active) simulationRef.current.alphaTarget(0.2).restart();
    
    const node = nodesRef.current[nodeIndex];
    if (node) {
      node.fx = event.x;
      node.fy = event.y;
    }
  };

  const handleDrag = (event: any, nodeIndex: number) => {
    const node = nodesRef.current[nodeIndex];
    if (node) {
      node.fx = event.x;
      node.fy = event.y;
    }
  };

  const handleDragEnd = (event: any, nodeIndex: number) => {
    if (!simulationRef.current) return;
    if (!event.active) simulationRef.current.alphaTarget(0);
    
    const node = nodesRef.current[nodeIndex];
    if (node) {
      node.fx = null;
      node.fy = null;
    }
  };

  // Create D3 Force Simulation on mount
  useEffect(() => {
    if (!svgRef.current) return;

    // Deep copy nodes and links for the simulation to avoid mutating initial constants
    const simNodes = SEFIROT_NODES.map(d => ({
      ...d,
      x: d.targetX + (Math.random() - 0.5) * 10, // slight offset for beauty
      y: d.targetY + (Math.random() - 0.5) * 10,
      fx: null as number | null,
      fy: null as number | null
    }));

    const simLinks = SEFIROT_LINKS.map(d => ({
      source: simNodes.find(n => n.id === d.source)!,
      target: simNodes.find(n => n.id === d.target)!
    }));

    nodesRef.current = simNodes;
    setNodes(simNodes);
    setLinks(simLinks);

    // D3 Force simulation to maintain sacred geometry structure while being responsive to dragging
    const simulation = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink(simLinks).distance(d => {
        const s = d.source as any;
        const t = d.target as any;
        if (s && t && typeof s.targetX === 'number' && typeof t.targetX === 'number') {
          return Math.hypot(s.targetX - t.targetX, s.targetY - t.targetY);
        }
        return 80;
      }).strength(0.8))
      .force("charge", d3.forceManyBody().strength(-80))
      .force("x", d3.forceX<any>(d => d.targetX).strength(0.35))
      .force("y", d3.forceY<any>(d => d.targetY).strength(0.35))
      .alphaDecay(0.05);

    simulationRef.current = simulation;

    // Tick listener - directly mutates DOM positions to prevent expensive React re-renders on every frame
    simulation.on("tick", () => {
      const svg = d3.select(svgRef.current);
      if (!svg.empty()) {
        // Update link lines
        svg.selectAll(".link-line-outer")
          .each(function(this: any, d, i) {
            const link = simLinks[i];
            if (link) {
              d3.select(this)
                .attr("x1", link.source.x)
                .attr("y1", link.source.y)
                .attr("x2", link.target.x)
                .attr("y2", link.target.y);
            }
          });

        svg.selectAll(".link-line-core")
          .each(function(this: any, d, i) {
            const link = simLinks[i];
            if (link) {
              d3.select(this)
                .attr("x1", link.source.x)
                .attr("y1", link.source.y)
                .attr("x2", link.target.x)
                .attr("y2", link.target.y);
            }
          });

        // Update Sefirot node circles & text positions
        simNodes.forEach(node => {
          const group = svg.select(`#node-group-${node.id}`);
          if (!group.empty()) {
            const cx = node.x ?? node.targetX;
            const cy = node.y ?? node.targetY;
            
            group.selectAll("circle")
              .attr("cx", cx)
              .attr("cy", cy);
              
            group.selectAll("text")
              .attr("x", cx);
              
            group.select(".node-title")
              .attr("y", cy - 22);
              
            group.select(".node-hebrew")
              .attr("y", cy + 4);
          }
        });
      }
    });

    return () => {
      simulation.stop();
    };
  }, []);

  // Setup drag behaviors using D3 inside React (attaches only once on initialization)
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    
    nodes.forEach((node, i) => {
      svg.select(`#node-group-${node.id}`)
        .call(
          d3.drag<any, any>()
            .on("start", (event) => handleDragStart(event, i))
            .on("drag", (event) => handleDrag(event, i))
            .on("end", (event) => handleDragEnd(event, i))
        );
    });
  }, [nodes.length]);

  // Find info from reading mapping
  const selectedNodeStatic = LOCALIZED_SEFIROT[language]?.[selectedNodeId || ""] || LOCALIZED_SEFIROT.es[selectedNodeId || ""];
  const selectedNodeInfo = SEFIROT_NODES.find(n => n.id === selectedNodeId);

  // Check if Gemini generated a reading block for this Sefirah today
  const matchingReadingItem = treeReading?.sefirotMap?.find((item: any) => {
    if (!selectedNodeId) return false;
    const sName = item.sefirah?.toLowerCase() || "";
    const nodeNameLower = selectedNodeId.toLowerCase();
    return sName.includes(nodeNameLower) || nodeNameLower.includes(sName);
  });

  const isActiveSefirah = selectedNodeId === activeSefirahName;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch bg-slate-950/80 border border-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Interactive Sefirot Chart */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[460px] sm:min-h-[580px] bg-slate-950/40 rounded-2xl border border-slate-900/50 p-2 overflow-hidden">
        
        {/* Header Text */}
        <div className="absolute top-4 left-4 right-4 z-10 text-center sm:text-left">
          <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="w-3 h-3 animate-spin text-amber-400" /> GRAPHICAL SEFIROT REPRESENTATION
          </span>
          <p className="text-[10px] text-slate-400 max-w-sm mt-1 mx-auto sm:mx-0 leading-normal hidden sm:block">
            {dict.instructions}
          </p>
        </div>

        {/* Tip */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-center pointer-events-none">
          <span className="px-3 py-1 bg-slate-900/90 border border-slate-800/80 rounded-full text-[10px] text-slate-400 font-bold tracking-wider uppercase">
            {dict.exploreTip}
          </span>
        </div>

        {/* SVG Drawing Canvas */}
        <svg
          ref={svgRef}
          viewBox="0 0 400 600"
          className="w-full max-w-[340px] sm:max-w-[420px] aspect-[2/3] drop-shadow-[0_0_15px_rgba(16,185,129,0.05)] select-none cursor-grab active:cursor-grabbing"
        >
          <defs>
            {/* Custom glowing filters */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 22 Connecting Paths */}
          <g>
            {links.map((link, idx) => {
              const isSourceActive = link.source.id === activeSefirahName;
              const isTargetActive = link.target.id === activeSefirahName;
              const isHighlighted = isSourceActive || isTargetActive;

              const isSourceSelected = link.source.id === selectedNodeId;
              const isTargetSelected = link.target.id === selectedNodeId;
              const isSelectedPath = isSourceSelected || isTargetSelected;

              return (
                <g key={`link-${idx}`}>
                  {/* Outer glowing path */}
                  <line
                    x1={link.source.x ?? link.source.targetX}
                    y1={link.source.y ?? link.source.targetY}
                    x2={link.target.x ?? link.target.targetX}
                    y2={link.target.y ?? link.target.targetY}
                    stroke={isHighlighted ? "rgba(245,158,11,0.25)" : isSelectedPath ? "rgba(16,185,129,0.2)" : "rgba(30,41,59,0.4)"}
                    strokeWidth={isHighlighted ? 4 : isSelectedPath ? 3 : 2}
                    className="link-line-outer transition-colors duration-300"
                  />
                  {/* Core elegant laser path */}
                  <line
                    x1={link.source.x ?? link.source.targetX}
                    y1={link.source.y ?? link.source.targetY}
                    x2={link.target.x ?? link.target.targetX}
                    y2={link.target.y ?? link.target.targetY}
                    stroke={isHighlighted ? "#fbbf24" : isSelectedPath ? "#10b981" : "#1e293b"}
                    strokeWidth={isHighlighted ? 1.5 : isSelectedPath ? 1.2 : 0.8}
                    strokeDasharray={isHighlighted ? "4 4" : "none"}
                    className={`link-line-core ${isHighlighted ? "animate-[dash_10s_linear_infinite]" : ""}`}
                  />
                </g>
              );
            })}
          </g>

          {/* Sefirot Spheres */}
          <g>
            {nodes.map((node) => {
              const isActive = node.id === activeSefirahName;
              const isSelected = node.id === selectedNodeId;
              
              const cx = node.x ?? node.targetX;
              const cy = node.y ?? node.targetY;

              return (
                <g
                  key={node.id}
                  id={`node-group-${node.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  className="cursor-pointer select-none"
                >
                  {/* Subtle dragging outer orbit */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 28 : isActive ? 24 : 20}
                    fill="transparent"
                    stroke={isSelected ? "rgba(16,185,129,0.3)" : isActive ? "rgba(245,158,11,0.2)" : "transparent"}
                    strokeWidth={isActive || isSelected ? 2 : 0}
                    className="transition-all duration-300"
                  />

                  {/* High Intensity Ambient Aura Glow */}
                  {(isActive || isSelected) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 24 : 20}
                      fill={isSelected ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.08)"}
                      filter="url(#superGlow)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer glowing rim */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={18}
                    fill="#020617"
                    stroke={isSelected ? "#10b981" : isActive ? "#fbbf24" : "#1e293b"}
                    strokeWidth={isSelected ? 2.5 : isActive ? 2 : 1.2}
                    filter="url(#glow)"
                    className="transition-all duration-300 hover:stroke-slate-100"
                  />

                  {/* Inner sacred colored core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 6 : 4}
                    fill={node.color}
                    opacity={isSelected ? 1 : 0.7}
                  />

                  {/* Node Title Text (poetic acronym) */}
                  <text
                    x={cx}
                    y={cy - 22}
                    textAnchor="middle"
                    fill={isSelected ? "#10b981" : isActive ? "#fbbf24" : "#94a3b8"}
                    fontSize={10}
                    fontWeight="bold"
                    letterSpacing="0.05em"
                    className="node-title font-serif select-none pointer-events-none transition-all duration-300"
                  >
                    {node.name}
                  </text>

                  {/* Hebrew Glyph Inside */}
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill={isSelected ? "rgba(16,185,129,0.7)" : isActive ? "rgba(251,191,36,0.7)" : "rgba(148,163,184,0.35)"}
                    fontSize={11}
                    fontWeight="bold"
                    className="node-hebrew font-serif select-none pointer-events-none transition-all duration-300"
                  >
                    {node.hebrew}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Sefirah Detailed Reading Context Panel */}
      <div className="w-full lg:w-80 flex flex-col justify-between gap-5 bg-slate-950/50 border border-slate-900 rounded-2xl p-5 shadow-inner">
        {selectedNodeId ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNodeId}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-start justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shadow-md"
                    style={{
                      backgroundColor: `${selectedNodeInfo?.color}15`,
                      borderColor: selectedNodeInfo?.color,
                      color: selectedNodeInfo?.color
                    }}
                  >
                    {selectedNodeInfo?.hebrew.charAt(0) || "✡️"}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-1.5">
                      {selectedNodeId}
                      {isActiveSefirah && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[8px] text-amber-400 uppercase font-black tracking-widest animate-pulse">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                      {selectedNodeStatic?.archetype}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 hover:bg-slate-900 text-slate-500 hover:text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Today's Custom Forces from Gemini (If this node is matching today's map) */}
              {matchingReadingItem ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/10 rounded-xl">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                      {dict.strengthHeader}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      {matchingReadingItem.strength}
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-950/15 border border-amber-500/10 rounded-xl">
                    <span className="text-[9px] font-bold text-amber-400/90 uppercase tracking-widest block mb-1">
                      {dict.shadowHeader}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      {matchingReadingItem.shadow}
                    </p>
                  </div>
                </div>
              ) : isActiveSefirah && treeReading?.alignmentExplanation ? (
                // Active Sefirah full reading
                <div className="p-3.5 bg-indigo-950/15 border border-indigo-500/10 rounded-xl">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                    {dict.activeSefirahHeader}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                    {treeReading.alignmentExplanation}
                  </p>
                </div>
              ) : null}

              {/* General Wisdom of the Sefirah */}
              <div className="p-3.5 bg-slate-900/30 border border-slate-900 rounded-xl flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400" /> {dict.generalWisdomHeader}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {selectedNodeStatic?.description}
                </p>
                <p className="text-[10px] text-slate-500 italic mt-1 font-medium border-t border-slate-900 pt-1.5">
                  {selectedNodeStatic?.meaning}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                  <span className="font-bold">{dict.hebrewLabel}</span>
                  <span className="font-serif text-xs text-slate-400">{selectedNodeInfo?.hebrew}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              ✡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === "en" ? "EXPLORE THE TREE" : language === "pt" ? "EXPLORAR A ÁRVORE" : language === "de" ? "BAUM ERFORSCHEN" : "EXPLORAR EL ÁRBOL"}
              </h4>
              <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto mt-1 leading-normal font-medium">
                {treeReading ? dict.exploreTip : dict.noReadingYet}
              </p>
            </div>
          </div>
        )}

        {selectedNodeId && (
          <button
            onClick={() => setSelectedNodeId(null)}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs py-2 rounded-xl transition-all cursor-pointer shadow-md text-center font-bold"
          >
            {dict.closeBtn}
          </button>
        )}
      </div>
    </div>
  );
}
