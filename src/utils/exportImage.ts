/**
 * Utility to export Tarot or Runes readings as a stylized, high-resolution zen image.
 * Uses HTML5 Canvas to procedurally draw gradients, stars, cards, and beautiful typography.
 */

interface TarotReading {
  summary: string;
  drawnCards?: Array<{
    id: string;
    name: string;
    isReversed: boolean;
  }>;
  interpretations?: Array<{
    cardName: string;
    positionName: string;
    meaning: string;
  }>;
  advice: string;
}

interface RunesReading {
  summary: string;
  drawn?: Array<{
    id: string;
    name: string;
    symbol: string;
    isReversed: boolean;
  }>;
  interpretations?: Array<{
    symbol: string;
    position: string;
    runeName: string;
    meaning: string;
  }>;
  advice: string;
}

// Simple text wrapping helper for Canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): string[] {
  if (!text) return [];
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function exportReadingAsImage(
  type: "tarot" | "runas",
  question: string,
  reading: any,
  language: "es" | "en" | "pt"
) {
  if (!reading) return;

  // Create an offscreen canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = 800;
  
  // Set up styling constants
  const isTarot = type === "tarot";
  const primaryColor = isTarot ? "#f59e0b" : "#a855f7"; // Amber vs Purple
  const secondaryColor = isTarot ? "#fbbf24" : "#c084fc";
  const bgStart = "#090d16";
  const bgEnd = isTarot ? "#201301" : "#170a24";
  const accentBorder = isTarot ? "rgba(245, 158, 11, 0.25)" : "rgba(168, 85, 247, 0.25)";
  const cardBg = "rgba(15, 23, 42, 0.65)";
  const textColorMain = "#e2e8f0";
  const textColorMuted = "#94a3b8";

  // Translate labels based on language
  const allLabels: Record<string, any> = {
    es: {
      titleTarot: "LECTURA DE TAROT TERAPÉUTICO",
      titleRunes: "SABIDURÍA DE RUNAS ANCESTRALES",
      questionLabel: "CONSULTA:",
      summaryLabel: "SINOPSIS DE LA LECTURA",
      cardsLabel: "ARCANOS REVELADOS",
      runesLabel: "SÍMBOLOS REVELADOS",
      adviceLabel: "CONSEJO ZEN DE HOY",
      footer: "PORTAL DE MINDFULNESS & ESPIRITUALIDAD ZEN",
      reversed: "Invertida 🔄",
      upright: "Al Derecho"
    },
    en: {
      titleTarot: "THERAPEUTIC TAROT READING",
      titleRunes: "ANCESTRAL RUNES WISDOM",
      questionLabel: "QUERY:",
      summaryLabel: "READING SYNOPSIS",
      cardsLabel: "REVEALED ARCANAS",
      runesLabel: "REVEALED SYMBOLS",
      adviceLabel: "TODAY'S ZEN ADVICE",
      footer: "ZEN MINDFULNESS & SPIRITUALITY PORTAL",
      reversed: "Reversed 🔄",
      upright: "Upright"
    },
    pt: {
      titleTarot: "LEITURA DE TAROT TERAPÊUTICO",
      titleRunes: "SABEDORIA DE RUNAS ANCESTRAIS",
      questionLabel: "CONSULTA:",
      summaryLabel: "SINOPSE DA LEITURA",
      cardsLabel: "ARCANOS REVELADOS",
      runesLabel: "SÍMBOLOS REVELADOS",
      adviceLabel: "CONSELHO ZEN DE HOJE",
      footer: "PORTAL DE MINDFULNESS & ESPIRITUALIDADE ZEN",
      reversed: "Invertida 🔄",
      upright: "Normal"
    }
  };
  const labels = allLabels[language] || allLabels.es;

  // Let's do a dynamic height pre-calculation
  let currentY = 50;

  // Set font for measuring
  ctx.font = "italic 15px Georgia, serif";
  
  // 1. Title space
  currentY += 100;

  // 2. Question block space
  if (question && question.trim()) {
    ctx.font = "14px system-ui, sans-serif";
    const qLines = wrapText(ctx, `"${question.trim()}"`, 640, 22);
    currentY += 30 + qLines.length * 22 + 30; // block padding + spacing
  } else {
    currentY += 20;
  }

  // 3. Summary text space
  ctx.font = "15px system-ui, sans-serif";
  const summaryLines = wrapText(ctx, reading.summary, 680, 25);
  currentY += 30 + summaryLines.length * 25 + 40;

  // 4. Drawn items (Cards or Runes) space
  currentY += 30; // section title
  const items = isTarot 
    ? (reading as TarotReading).interpretations || []
    : (reading as RunesReading).interpretations || [];

  if (isTarot) {
    // Each tarot card is listed vertically
    items.forEach((item: any, i: number) => {
      ctx.font = "14px system-ui, sans-serif";
      const cardMeaningLines = wrapText(ctx, item.meaning, 480, 22);
      const itemHeight = Math.max(90, cardMeaningLines.length * 22 + 40);
      currentY += itemHeight + 15;
    });
  } else {
    // Runes: 2-column layout if multiple runes, or single column if 1
    const runeItems = items;
    if (runeItems.length === 1) {
      ctx.font = "14px system-ui, sans-serif";
      const meaningLines = wrapText(ctx, runeItems[0].meaning, 560, 22);
      currentY += Math.max(90, meaningLines.length * 22 + 45) + 15;
    } else {
      // 3 runes: we stack them or do staggered. Let's stack them for neat alignment and safety.
      runeItems.forEach((item: any) => {
        ctx.font = "14px system-ui, sans-serif";
        const meaningLines = wrapText(ctx, item.meaning, 560, 22);
        currentY += Math.max(80, meaningLines.length * 22 + 45) + 15;
      });
    }
  }

  // 5. Advice space
  currentY += 40; // spacing
  ctx.font = "bold 15px system-ui, sans-serif";
  const adviceLines = wrapText(ctx, reading.advice, 640, 25);
  currentY += 30 + adviceLines.length * 25 + 40;

  // 6. Footer space
  currentY += 80;

  // Set calculated height (minimum 800px)
  canvas.height = Math.max(850, currentY);

  // --- NOW START ACTUAL DRAWING ---
  
  // 1. Draw beautiful linear gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, width, canvas.height);
  bgGrad.addColorStop(0, bgStart);
  bgGrad.addColorStop(0.5, bgStart);
  bgGrad.addColorStop(1, bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, canvas.height);

  // 2. Draw soft radial glow effects in background
  const drawGlow = (x: number, y: number, r: number, color: string) => {
    const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    glowGrad.addColorStop(0, color);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  drawGlow(width / 2, 150, 250, isTarot ? "rgba(245, 158, 11, 0.04)" : "rgba(168, 85, 247, 0.04)");
  drawGlow(100, canvas.height - 200, 200, "rgba(30, 41, 59, 0.2)");
  drawGlow(width - 100, canvas.height / 2, 300, isTarot ? "rgba(120, 53, 4, 0.04)" : "rgba(88, 28, 135, 0.04)");

  // 3. Draw starry celestial background (45 tiny stars)
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  const starPositions = [
    { x: 50, y: 80, s: 1.5 }, { x: 120, y: 200, s: 1 }, { x: 700, y: 110, s: 2 },
    { x: 650, y: 250, s: 1.2 }, { x: 400, y: 70, s: 1.8 }, { x: 280, y: 180, s: 1 },
    { x: 750, y: 400, s: 1.5 }, { x: 80, y: 480, s: 2 }, { x: 720, y: 600, s: 1.2 },
    { x: 150, y: 750, s: 1.5 }, { x: 680, y: 850, s: 2 }, { x: 320, y: 920, s: 1.3 },
    { x: 90, y: 1100, s: 1.6 }, { x: 710, y: 1050, s: 1.1 }, { x: 380, y: 1250, s: 1.8 }
  ];
  // Add some more procedurally
  for (let i = 0; i < 30; i++) {
    const x = (i * 27 + 43) % width;
    const y = (i * 47 + 91) % canvas.height;
    const s = 0.5 + ((i % 3) * 0.5);
    starPositions.push({ x, y, s });
  }
  starPositions.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Draw outer gold/silver double border line (with safe margins)
  ctx.strokeStyle = accentBorder;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, 20, width - 40, canvas.height - 40);
  
  ctx.strokeStyle = isTarot ? "rgba(245, 158, 11, 0.08)" : "rgba(168, 85, 247, 0.08)";
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, width - 28, canvas.height - 28);

  // 5. Draw decorative header symbol
  ctx.fillStyle = primaryColor;
  ctx.font = "24px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(isTarot ? "✨ 🃏 ✨" : "✨ ᚱ ✨", width / 2, 60);

  // 6. Draw main title
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 20px Georgia, 'Times New Roman', serif";
  ctx.letterSpacing = "2px";
  ctx.textAlign = "center";
  ctx.fillText(isTarot ? labels.titleTarot : labels.titleRunes, width / 2, 100);

  // Reset letter spacing
  ctx.letterSpacing = "0px";

  // Draw elegant divider under title
  const gradLine = ctx.createLinearGradient(150, 0, width - 150, 0);
  gradLine.addColorStop(0, "transparent");
  gradLine.addColorStop(0.5, primaryColor);
  gradLine.addColorStop(1, "transparent");
  ctx.fillStyle = gradLine;
  ctx.fillRect(150, 115, width - 300, 1.5);

  let drawY = 150;

  // 7. Draw Question Box if present
  if (question && question.trim()) {
    ctx.font = "14px system-ui, sans-serif";
    const qLines = wrapText(ctx, `"${question.trim()}"`, 600, 22);
    const boxHeight = qLines.length * 22 + 40;

    // Box background
    ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    
    // Rounded rect
    const bx = 80;
    const by = drawY;
    const bw = 640;
    const bh = boxHeight;
    const r = 16;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, r);
    ctx.fill();
    ctx.stroke();

    // Question label
    ctx.fillStyle = secondaryColor;
    ctx.font = "bold 10px system-ui, sans-serif";
    ctx.letterSpacing = "1.5px";
    ctx.textAlign = "left";
    ctx.fillText(labels.questionLabel, bx + 20, by + 18);
    ctx.letterSpacing = "0px";

    // Question text
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "italic 14px Georgia, serif";
    qLines.forEach((line, li) => {
      ctx.fillText(line, bx + 20, by + 38 + li * 22);
    });

    drawY += boxHeight + 30;
  } else {
    drawY += 15;
  }

  // 8. Draw Summary Section
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 10px system-ui, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.textAlign = "left";
  ctx.fillText(labels.summaryLabel, 80, drawY);
  ctx.letterSpacing = "0px";

  drawY += 15;

  // Summary Text
  ctx.fillStyle = textColorMain;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textBaseline = "top";
  const sLines = wrapText(ctx, reading.summary, 640, 25);
  sLines.forEach((line) => {
    ctx.fillText(line, 80, drawY);
    drawY += 25;
  });

  drawY += 30;

  // 9. Draw Cards / Runes Section Title
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 10px system-ui, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.textAlign = "left";
  ctx.fillText(isTarot ? labels.cardsLabel : labels.runesLabel, 80, drawY);
  ctx.letterSpacing = "0px";

  drawY += 22;

  // 10. Draw Drawn Cards or Runes items
  if (isTarot) {
    const tarotReadingData = reading as TarotReading;
    const interpretations = tarotReadingData.interpretations || [];
    
    interpretations.forEach((item: any, i: number) => {
      const rawCard = tarotReadingData.drawnCards?.[i];
      const isReversed = rawCard?.isReversed || false;
      
      ctx.font = "14px system-ui, sans-serif";
      const cardMeaningLines = wrapText(ctx, item.meaning, 440, 22);
      const itemHeight = Math.max(90, cardMeaningLines.length * 22 + 40);

      // Card Item Container Background
      ctx.fillStyle = cardBg;
      ctx.strokeStyle = accentBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(80, drawY, 640, itemHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Left column: Visual Card Graphic representation
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
      ctx.beginPath();
      ctx.roundRect(95, drawY + 15, 120, itemHeight - 30, 12);
      ctx.fill();
      ctx.stroke();

      // Card Emoji
      ctx.fillStyle = primaryColor;
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🃏", 155, drawY + 38);

      // Card Name
      ctx.fillStyle = "#fef08a"; // Soft amber-yellow
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText(item.cardName, 155, drawY + 56);

      // Orientation status
      ctx.fillStyle = textColorMuted;
      ctx.font = "9px system-ui, sans-serif";
      ctx.fillText(isReversed ? labels.reversed : labels.upright, 155, drawY + 70);

      // Right column: Text description
      ctx.textAlign = "left";
      ctx.fillStyle = secondaryColor;
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText(item.positionName.toUpperCase(), 235, drawY + 23);
      ctx.letterSpacing = "0px";

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "13px system-ui, sans-serif";
      cardMeaningLines.forEach((line, li) => {
        ctx.fillText(line, 235, drawY + 38 + li * 22);
      });

      drawY += itemHeight + 15;
    });
  } else {
    // Runes layout
    const runesReadingData = reading as RunesReading;
    const interpretations = runesReadingData.interpretations || [];

    interpretations.forEach((item: any, i: number) => {
      const rawRune = runesReadingData.drawn?.[i];
      const isReversed = rawRune?.isReversed || false;

      ctx.font = "14px system-ui, sans-serif";
      const meaningLines = wrapText(ctx, item.meaning, 500, 22);
      const itemHeight = Math.max(80, meaningLines.length * 22 + 40);

      // Rune Item Container Background
      ctx.fillStyle = cardBg;
      ctx.strokeStyle = accentBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(80, drawY, 640, itemHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Left column: Rune circle representation
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
      ctx.beginPath();
      ctx.arc(140, drawY + itemHeight / 2, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rune symbol
      ctx.fillStyle = secondaryColor;
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.symbol, 140, drawY + itemHeight / 2 + 7);

      // Right column: Text description
      ctx.textAlign = "left";
      ctx.fillStyle = secondaryColor;
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.letterSpacing = "1.5px";
      ctx.fillText(item.position.toUpperCase(), 195, drawY + 22);
      ctx.letterSpacing = "0px";

      // Rune Name
      ctx.fillStyle = "#e9d5ff"; // Soft purple
      ctx.font = "bold 12px system-ui, sans-serif";
      ctx.fillText(item.runeName + (isReversed ? " 🔄" : ""), 195, drawY + 38);

      // Meaning
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "13px system-ui, sans-serif";
      meaningLines.forEach((line, li) => {
        ctx.fillText(line, 195, drawY + 54 + li * 22);
      });

      drawY += itemHeight + 15;
    });
  }

  drawY += 20;

  // 11. Draw Advice Box
  ctx.font = "bold 14px system-ui, sans-serif";
  const adviceLinesWrapped = wrapText(ctx, reading.advice, 600, 24);
  const adviceBoxHeight = adviceLinesWrapped.length * 24 + 45;

  // Background gradient for advice (rich, highlight feel)
  const advGrad = ctx.createLinearGradient(80, drawY, 720, drawY + adviceBoxHeight);
  if (isTarot) {
    advGrad.addColorStop(0, "rgba(120, 53, 4, 0.12)");
    advGrad.addColorStop(1, "rgba(15, 23, 42, 0.5)");
  } else {
    advGrad.addColorStop(0, "rgba(88, 28, 135, 0.12)");
    advGrad.addColorStop(1, "rgba(15, 23, 42, 0.5)");
  }
  ctx.fillStyle = advGrad;
  ctx.strokeStyle = isTarot ? "rgba(245, 158, 11, 0.3)" : "rgba(168, 85, 247, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(80, drawY, 640, adviceBoxHeight, 20);
  ctx.fill();
  ctx.stroke();

  // Advice Label
  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 10px system-ui, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.textAlign = "left";
  ctx.fillText(labels.adviceLabel, 100, drawY + 18);
  ctx.letterSpacing = "0px";

  // Advice text
  ctx.fillStyle = "#f1f5f9";
  ctx.font = "bold 13px system-ui, sans-serif";
  adviceLinesWrapped.forEach((line, li) => {
    ctx.fillText(line, 100, drawY + 36 + li * 24);
  });

  drawY += adviceBoxHeight + 50;

  // 12. Draw Footer
  ctx.fillStyle = primaryColor;
  ctx.font = "14px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(isTarot ? "🔮 ⚖️ 🎴" : "ᛉ ᚱ ᛗ", width / 2, drawY);

  ctx.fillStyle = textColorMuted;
  ctx.font = "bold 9px system-ui, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(labels.footer, width / 2, drawY + 22);

  // --- DOWNLOAD ACTION ---
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `lectura_${type}_zen_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to generate image:", err);
  }
}
