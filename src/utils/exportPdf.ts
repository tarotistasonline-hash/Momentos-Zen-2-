import { jsPDF } from "jspdf";

interface TranslationLabels {
  title: string;
  question: string;
  summary: string;
  details: string;
  advice: string;
  footer: string;
  page: string;
}

const LANGUAGES_LABELS: Record<string, TranslationLabels> = {
  es: {
    title: "INFORME DE CONSULTA ESPIRITUAL ZEN",
    question: "CONSULTA / ENFOQUE",
    summary: "SINOPSIS Y ALINEACIÓN",
    details: "DETALLES DE LA REVELACIÓN",
    advice: "CONSEJO Y MEDITACIÓN",
    footer: "Portal de Mindfulness & Espiritualidad Zen · Tarotistas Online",
    page: "Página"
  },
  en: {
    title: "ZEN SPIRITUAL CONSULTATION REPORT",
    question: "QUERY / FOCUS",
    summary: "SYNOPSIS & ALIGNMENT",
    details: "REVELATION DETAILS",
    advice: "GUIDANCE & MEDITATION",
    footer: "Zen Mindfulness & Spirituality Portal · Tarotistas Online",
    page: "Page"
  },
  pt: {
    title: "RELATÓRIO DE CONSULTA ESPIRITUAL ZEN",
    question: "CONSULTA / FOCO",
    summary: "SINOPSE E ALINHAMENTO",
    details: "DETALHES DA REVELAÇÃO",
    advice: "CONSELHO E MEDITAÇÃO",
    footer: "Portal de Mindfulness & Espiritualidade Zen · Tarotistas Online",
    page: "Página"
  },
  de: {
    title: "ZEN SPIRITUELLER BERATUNGSBERICHT",
    question: "ANFRAGE / FOKUS",
    summary: "ZUSAMMENFASSUNG & AUSRICHTUNG",
    details: "DETAILS DER OFFENBARUNG",
    advice: "RATSCHLAG & MEDITATION",
    footer: "Zen Achtsamkeits- & Spiritualitätsportal · Tarotistas Online",
    page: "Seite"
  }
};

export function exportReadingAsPdf(
  type: "tarot" | "runas" | "arbol" | "numerologia" | "angeles" | "luna",
  titleName: string,
  queryText: string,
  reading: any,
  language: "es" | "en" | "pt" | "de" = "es"
) {
  if (!reading) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const labels = LANGUAGES_LABELS[language] || LANGUAGES_LABELS.es;

  // Color Palette
  const primaryColor = { r: 180, g: 83, b: 9 }; // Amber-700
  const secondaryColor = { r: 30, g: 41, b: 59 }; // Slate-800 (Dark text)
  const mutedColor = { r: 100, g: 116, b: 139 }; // Slate-500 (Muted)
  const borderLight = { r: 226, g: 232, b: 240 }; // Slate-200
  const bgPaper = { r: 250, g: 249, b: 246 }; // Elegant off-white

  // Page variables
  const marginX = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - 2 * marginX;
  let currentY = 25;

  const addNewPage = () => {
    // Draw footer on current page before adding a new one
    drawFooter();
    doc.addPage();
    drawBackground();
    currentY = 25;
  };

  const drawBackground = () => {
    // Fill full page background with elegant off-white paper tone
    doc.setFillColor(bgPaper.r, bgPaper.g, bgPaper.b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Double border lines
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.25);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.75);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  };

  const drawFooter = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
    
    // Centered footer text
    doc.text(labels.footer, pageWidth / 2, pageHeight - 14, { align: "center" });
    // Page number
    doc.text(`${labels.page} ${pageCount}`, pageWidth - 16, pageHeight - 14, { align: "right" });
  };

  const checkYSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 25) {
      addNewPage();
    }
  };

  const writeHeading = (text: string) => {
    checkYSpace(12);
    doc.setFont("Times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.text(text.toUpperCase(), marginX, currentY);
    currentY += 4;
    
    // Gold accent underline
    doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.setLineWidth(0.35);
    doc.line(marginX, currentY, marginX + 30, currentY);
    currentY += 6;
  };

  const writeParagraph = (text: string, fontSize = 10, fontStyle = "normal") => {
    if (!text) return;
    doc.setFont("Helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
    
    const splitText = doc.splitTextToSize(text, contentWidth);
    const textHeight = splitText.length * (fontSize * 0.45);
    
    checkYSpace(textHeight + 2);
    doc.text(splitText, marginX, currentY);
    currentY += textHeight + 4;
  };

  // 1. Initial page setup
  drawBackground();

  // 2. Main title
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.text(labels.title, pageWidth / 2, currentY, { align: "center" });
  currentY += 6;

  doc.setFont("Times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
  doc.text(titleName, pageWidth / 2, currentY, { align: "center" });
  currentY += 8;

  // Top elegant decorative line
  doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, currentY, pageWidth / 2 + 40, currentY);
  currentY += 12;

  // 3. Question / Query
  if (queryText && queryText.trim()) {
    writeHeading(labels.question);
    writeParagraph(`"${queryText.trim()}"`, 11, "oblique");
    currentY += 2;
  }

  // 4. Summary / General Alignment
  writeHeading(labels.summary);
  if (type === "tarot" || type === "runas") {
    writeParagraph(reading.summary, 10, "normal");
  } else if (type === "arbol") {
    writeParagraph(reading.alignmentExplanation, 10, "normal");
  } else if (type === "numerologia") {
    writeParagraph(reading.introduction, 10, "normal");
  } else if (type === "angeles") {
    writeParagraph(reading.coreMessage, 10, "normal");
  } else if (type === "luna") {
    writeParagraph(reading.alignmentExplanation, 10, "normal");
  }
  currentY += 2;

  // 5. Details Section
  if (type === "tarot" && reading.interpretations) {
    writeHeading(labels.details);
    reading.interpretations.forEach((item: any, idx: number) => {
      const reversedLabel = reading.drawnCards?.[idx]?.isReversed 
        ? `(${language === "en" ? "Reversed" : language === "pt" ? "Invertida" : "Invertida"})` 
        : `(${language === "en" ? "Upright" : language === "pt" ? "Normal" : "Al Derecho"})`;
        
      checkYSpace(25);
      // Box style for each card
      doc.setFillColor(245, 245, 240);
      doc.rect(marginX - 2, currentY - 4, contentWidth + 4, 6, "F");

      doc.setFont("Times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text(`${idx + 1}. ${item.cardName} ${reversedLabel}`, marginX, currentY);
      currentY += 3;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
      doc.text(item.positionName.toUpperCase(), marginX, currentY);
      currentY += 5;

      writeParagraph(item.meaning, 9.5, "normal");
      currentY += 2;
    });
  } else if (type === "runas" && reading.interpretations) {
    writeHeading(labels.details);
    reading.interpretations.forEach((item: any, idx: number) => {
      const reversedLabel = reading.drawn?.[idx]?.isReversed 
        ? `(${language === "en" ? "Reversed" : language === "pt" ? "Invertida" : "Invertida"})` 
        : "";
        
      checkYSpace(25);
      // Box style for each rune
      doc.setFillColor(245, 245, 240);
      doc.rect(marginX - 2, currentY - 4, contentWidth + 4, 6, "F");

      doc.setFont("Times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text(`${idx + 1}. Runa ${item.runeName} [${item.symbol}] ${reversedLabel}`, marginX, currentY);
      currentY += 3;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b);
      doc.text(item.position.toUpperCase(), marginX, currentY);
      currentY += 5;

      writeParagraph(item.meaning, 9.5, "normal");
      currentY += 2;
    });
  } else if (type === "arbol") {
    writeHeading(labels.details);
    if (reading.activeSefirah) {
      checkYSpace(20);
      doc.setFillColor(245, 245, 240);
      doc.rect(marginX - 2, currentY - 4, contentWidth + 4, 12, "F");

      doc.setFont("Times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text(`Sefirá Activa: ${reading.activeSefirah.name}`, marginX, currentY + 1);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
      doc.text(`Arquetipo: ${reading.activeSefirah.archetype} · Valor: ${reading.activeSefirah.value}`, marginX, currentY + 5.5);
      currentY += 12;
    }

    if (reading.sefirotMap) {
      writeParagraph(language === "en" ? "KABBALISTIC MAP ALIGNMENTS:" : "ALINEACIONES DEL MAPA CABALÍSTICO:", 10, "bold");
      reading.sefirotMap.forEach((item: any) => {
        checkYSpace(18);
        doc.setFont("Times", "bold");
        doc.setFontSize(10);
        doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        doc.text(`• ${item.sefirah}`, marginX, currentY);
        currentY += 4;

        writeParagraph(`- Fortaleza: ${item.strength}\n- Desafío: ${item.shadow}`, 9, "normal");
        currentY += 1;
      });
    }
  } else if (type === "numerologia") {
    writeHeading(labels.details);
    if (reading.scores) {
      checkYSpace(30);
      doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
      doc.setLineWidth(0.5);
      doc.line(marginX, currentY, marginX + contentWidth, currentY);
      currentY += 4;

      const scoresList = [
        { name: language === "en" ? "Life Path" : "Camino de Vida", val: reading.scores.lifePath },
        { name: language === "en" ? "Soul Expression" : "Expresión del Alma", val: reading.scores.soulExpression },
        { name: language === "en" ? "Heart's Desire" : "Deseo del Corazón", val: reading.scores.heartDesire },
        { name: language === "en" ? "Pythagorean Destiny" : "Destino Pitagórico", val: reading.scores.destinyNumber }
      ];

      scoresList.forEach((score) => {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
        doc.text(score.name, marginX, currentY);

        doc.setFont("Times", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        doc.text(String(score.val), marginX + contentWidth - 15, currentY, { align: "right" });
        currentY += 6;
      });
      currentY += 2;
    }
  } else if (type === "angeles") {
    writeHeading(labels.details);
    checkYSpace(25);
    doc.setFillColor(245, 245, 240);
    doc.rect(marginX - 2, currentY - 4, contentWidth + 4, 14, "F");

    doc.setFont("Times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.text(`Ángel Protector: ${reading.angelName}`, marginX, currentY + 2);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
    doc.text(`Cristal de sintonía celestial: ${reading.crystal || "Cuarzo Blanco"}`, marginX, currentY + 7);
    currentY += 15;
  }

  // 6. Advice & Meditation / Reflection
  if (type === "tarot" || type === "runas") {
    writeHeading(labels.advice);
    writeParagraph(reading.advice, 10, "bold");
  } else if (type === "arbol" && reading.kabbalisticMeditation) {
    writeHeading(labels.advice);
    writeParagraph(reading.kabbalisticMeditation.title, 11, "bold");
    writeParagraph(reading.kabbalisticMeditation.practice, 10, "normal");
    if (reading.blessing) {
      currentY += 2;
      writeParagraph(reading.blessing, 10.5, "oblique");
    }
  } else if (type === "numerologia" && reading.cosmicAdvice) {
    writeHeading(labels.advice);
    writeParagraph(reading.cosmicAdvice, 10, "normal");
  } else if (type === "angeles" && reading.affirmation) {
    writeHeading(labels.advice);
    writeParagraph(language === "en" ? "LIGHT AFFIRMATION:" : "AFIRMACIÓN DIARIA DE LUZ:", 10, "bold");
    writeParagraph(`"${reading.affirmation}"`, 11, "italic");
  } else if (type === "luna") {
    writeHeading(labels.advice);
    writeParagraph(language === "en" ? "PRACTICAL MOON ALIGNMENT ADVICE" : "CONSEJO PRÁCTICO DE ALINEACIÓN LUNAR", 10, "bold");
    writeParagraph(
      language === "en" 
        ? "Align your actions with this phase's cosmic alignment. Meditate on the natural expansion or integration of your thoughts."
        : "Sincroniza tus intenciones con esta fase lunar. Dedica espacio para reflexionar en los frutos o soltar lo que ya no sirve.",
      10,
      "italic"
    );
  }

  // Draw final footer
  drawFooter();

  // Save PDF
  try {
    doc.save(`Lectura_${type}_Zen_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error("Failed to export PDF:", err);
  }
}
