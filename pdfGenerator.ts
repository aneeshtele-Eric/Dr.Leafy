import { jsPDF } from 'jspdf';
import { Patient, User } from '../types';

// Normalizes unicode punctuation for jsPDF Helvetica font compatibility
function sanitizePdfText(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/[\u2010\u2012\u2013\u2014]/g, '-') // en-dash and em-dash to hyphen
    .replace(/[\u2018\u2019]/g, "'")             // smart single quotes
    .replace(/[\u201C\u201D]/g, '"')             // smart double quotes
    .replace(/[\u2022]/g, '*')                   // bullets
    .replace(/[\u2026]/g, '...')                 // ellipsis
    .replace(/[\u00A0]/g, ' ');                  // non-breaking space
}

export function generatePatientPdf(
  patient: Patient,
  currentVigor: number,
  user?: User | null
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [20, 66, 38];
  const secondaryColor: [number, number, number] = [55, 104, 71];
  const leafColor: [number, number, number] = [59, 131, 86];
  const textColor: [number, number, number] = [22, 29, 26];
  const mutedTextColor: [number, number, number] = [80, 95, 85];
  const lightBg: [number, number, number] = [243, 251, 245];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DR. LEAFY  |  CLINICAL BOTANICAL RECOVERY DOSSIER', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const reportDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.text(
    sanitizePdfText(`Validated Care Protocol #${patient.id}  *  Generated on ${reportDate}`),
    margin,
    18
  );

  y = 32;

  // Specimen Status Card
  doc.setFillColor(...lightBg);
  doc.setDrawColor(200, 220, 205);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'FD');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(sanitizePdfText(patient.name), margin + 4, y + 7);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  doc.text(sanitizePdfText(`${patient.commonName}  *  ${patient.latinName}`), margin + 4, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text(sanitizePdfText(`Location: ${patient.room}`), margin + 4, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedTextColor);
  doc.text(
    sanitizePdfText(`Caregiver: ${user?.name || 'Conservatory Specialist'}  |  Confidence: ${patient.matchPct}`),
    margin + 4,
    y + 23
  );

  // Severity & Vigor Pills
  const rightX = pageWidth - margin - 58;
  doc.setFillColor(250, 240, 230);
  doc.setDrawColor(217, 119, 70);
  doc.roundedRect(rightX, y + 3, 54, 10, 2, 2, 'FD');
  doc.setTextColor(190, 75, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(sanitizePdfText(patient.severity.text.slice(0, 28)), rightX + 2, y + 9);

  doc.setFillColor(234, 244, 238);
  doc.setDrawColor(59, 131, 86);
  doc.roundedRect(rightX, y + 15, 54, 9, 2, 2, 'FD');
  doc.setTextColor(...leafColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    sanitizePdfText(`Vigor Index: ${currentVigor}% (${patient.baseVigor}% Base)`),
    rightX + 2,
    y + 21
  );

  y += 34;

  // Section 1: Vigor Recovery Trajectory Chart
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. VIGOR RECOVERY TRAJECTORY & HISTORY', margin, y);
  y += 4;

  const chartBoxHeight = 44;
  doc.setFillColor(250, 253, 251);
  doc.setDrawColor(220, 230, 224);
  doc.roundedRect(margin, y, contentWidth, chartBoxHeight, 2, 2, 'FD');

  const chartLeft = margin + 14;
  const chartRight = margin + contentWidth - 10;
  const chartTop = y + 8;
  const chartBottom = y + chartBoxHeight - 10;
  const chartPlotWidth = chartRight - chartLeft;
  const chartPlotHeight = chartBottom - chartTop;

  // Y-axis grid
  doc.setDrawColor(230, 238, 232);
  doc.setLineWidth(0.2);
  [0, 50, 90, 100].forEach((val) => {
    const yVal = chartBottom - (val / 100) * chartPlotHeight;
    doc.line(chartLeft, yVal, chartRight, yVal);
    doc.setTextColor(...mutedTextColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(`${val}%`, chartLeft - 8, yVal + 1);
  });

  const y90 = chartBottom - (90 / 100) * chartPlotHeight;
  doc.setDrawColor(59, 131, 86);
  doc.setLineWidth(0.3);
  doc.line(chartLeft, y90, chartRight, y90);
  doc.setTextColor(...leafColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('90% Remission Baseline', chartRight - 28, y90 - 1.5);

  const rawNotes = patient.careNotes || [];
  const pointsData = rawNotes.map((cn) => ({
    date: cn.date,
    vigor: cn.vigorAtTime ?? patient.baseVigor,
  }));
  pointsData.push({ date: 'Today', vigor: currentVigor });

  if (pointsData.length > 0) {
    const coords = pointsData.map((p, idx) => {
      const xCoord =
        pointsData.length === 1
          ? chartLeft + chartPlotWidth / 2
          : chartLeft + (idx / (pointsData.length - 1)) * chartPlotWidth;
      const yCoord = chartBottom - (p.vigor / 100) * chartPlotHeight;
      return { x: xCoord, y: yCoord, date: p.date, vigor: p.vigor };
    });

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.8);
    for (let i = 0; i < coords.length - 1; i++) {
      doc.line(coords[i].x, coords[i].y, coords[i + 1].x, coords[i + 1].y);
    }

    coords.forEach((c) => {
      doc.setFillColor(...leafColor);
      doc.circle(c.x, c.y, 1.4, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(c.x, c.y, 0.7, 'F');

      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(`${c.vigor}%`, c.x - 3, c.y - 2.5);

      doc.setTextColor(...mutedTextColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text(sanitizePdfText(c.date), c.x - 4, chartBottom + 5);
    });
  }

  y += chartBoxHeight + 6;

  // Section 2: Clinical Observations
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. CLINICAL OBSERVATIONS & CARE NOTES HISTORY', margin, y);
  y += 4;

  const notesList = patient.careNotes || [];
  if (notesList.length === 0) {
    doc.setTextColor(...mutedTextColor);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.text('No historical care notes logged yet.', margin, y + 4);
    y += 10;
  } else {
    notesList.forEach((cn) => {
      doc.setFillColor(250, 252, 250);
      doc.setDrawColor(225, 235, 228);
      doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');

      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(sanitizePdfText(cn.date), margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedTextColor);
      doc.text(sanitizePdfText(`Logged by: ${cn.author}`), margin + 24, y + 4.5);

      if (cn.vigorAtTime) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...leafColor);
        doc.text(`Vigor: ${cn.vigorAtTime}%`, contentWidth + margin - 22, y + 4.5);
      }

      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const wrappedNote = doc.splitTextToSize(sanitizePdfText(cn.note), contentWidth - 8);
      doc.text(wrappedNote, margin + 3, y + 8.5);
      y += 14;
    });
  }

  // Page 2: Roadmap and Protocols
  doc.addPage();
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(
    sanitizePdfText(`PATIENT #${patient.id} - CLINICAL ROADMAP & TREATMENT PROTOCOLS`),
    margin,
    8
  );

  y = 20;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. CARE JOURNEY ROADMAP & ACTION TASKS', margin, y);
  y += 5;

  patient.phases.forEach((phase) => {
    doc.setFillColor(240, 248, 242);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(
      sanitizePdfText(`PHASE ${phase.number}: ${phase.title.toUpperCase()}`),
      margin + 2.5,
      y + 4.2
    );
    y += 8;

    phase.tasks.forEach((task) => {
      doc.setDrawColor(task.completed ? 59 : 180, task.completed ? 131 : 180, task.completed ? 86 : 180);
      doc.setFillColor(task.completed ? 234 : 255, task.completed ? 244 : 255, task.completed ? 238 : 255);
      doc.roundedRect(margin + 2, y, 4, 4, 1, 1, 'FD');

      if (task.completed) {
        doc.setTextColor(...leafColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text('v', margin + 3.1, y + 3.1);
      }

      doc.setTextColor(task.completed ? 100 : 20, task.completed ? 110 : 66, task.completed ? 105 : 38);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(sanitizePdfText(task.title), margin + 8, y + 3.2);

      doc.setTextColor(...mutedTextColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(sanitizePdfText(`[${task.time}]`), contentWidth + margin - 20, y + 3.2);

      const taskDesc = doc.splitTextToSize(sanitizePdfText(task.desc), contentWidth - 12);
      doc.text(taskDesc, margin + 8, y + 7.5);
      y += 11;
    });

    y += 2;
  });

  // Targeted Treatment Protocols
  y += 2;
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. TARGETED TREATMENT PROTOCOLS', margin, y);
  y += 5;

  (patient.treatmentProtocols.organicRemedies || []).forEach((rem) => {
    doc.setFillColor(248, 252, 249);
    doc.setDrawColor(220, 235, 225);
    doc.roundedRect(margin, y, contentWidth, 11, 1.5, 1.5, 'FD');

    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(sanitizePdfText(`ORGANIC: ${rem.title}`), margin + 3, y + 4.2);

    doc.setTextColor(...leafColor);
    doc.setFontSize(7.5);
    doc.text(sanitizePdfText(rem.badge), margin + 70, y + 4.2);

    doc.setTextColor(...mutedTextColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(sanitizePdfText(rem.usage), contentWidth + margin - 35, y + 4.2);

    doc.setTextColor(...textColor);
    const desc = doc.splitTextToSize(sanitizePdfText(rem.desc), contentWidth - 8);
    doc.text(desc, margin + 3, y + 8);
    y += 13;
  });

  (patient.treatmentProtocols.commercialSolutions || []).forEach((sol) => {
    doc.setFillColor(252, 250, 248);
    doc.setDrawColor(235, 225, 215);
    doc.roundedRect(margin, y, contentWidth, 11, 1.5, 1.5, 'FD');

    doc.setTextColor(180, 80, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(sanitizePdfText(`SOLUTION: ${sol.title}`), margin + 3, y + 4.2);

    doc.setTextColor(...mutedTextColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const desc = doc.splitTextToSize(sanitizePdfText(sol.desc), contentWidth - 8);
    doc.text(desc, margin + 3, y + 8);
    y += 13;
  });

  // Footer Sign-Off
  y += 4;
  doc.setFillColor(240, 248, 242);
  doc.setDrawColor(180, 215, 190);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DR. LEAFY CLINICAL SIGN-OFF', margin + 4, y + 5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...textColor);
  const noteWrapped = doc.splitTextToSize(sanitizePdfText(patient.drNote), contentWidth - 8);
  doc.text(noteWrapped, margin + 4, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...secondaryColor);
  doc.text(
    sanitizePdfText(`Verified Protocol ID: DL-${patient.id}-AUTH  *  Next check-in: ${patient.checkinText}`),
    margin + 4,
    y + 20
  );

  // Bottom footer page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(140, 150, 145);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(
      `Dr. Leafy AI Botanical Health System  *  Confidential Record  *  Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 6
    );
  }

  return doc;
}
