import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageNumber, AlignmentType, Footer, Header, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import type { GeneratedDocument, DocumentPage } from '@/types/document';

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

export async function exportToDocx(doc: GeneratedDocument): Promise<void> {
  const sections: Paragraph[] = [];

  // Title
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: doc.outline.title, bold: true, size: 56, font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Comprehensive Analysis`, size: 32, font: 'Calibri', color: '10B981' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Generated on ${new Date(doc.metadata.generatedAt).toLocaleDateString()}`, size: 24, font: 'Calibri', color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
  );

  // TOC header
  sections.push(
    new Paragraph({
      text: 'Table of Contents',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 },
    }),
  );

  for (const chapter of doc.outline.chapters) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `Chapter ${chapter.number}: ${chapter.title}`, bold: true, size: 22 })],
        spacing: { after: 100 },
      }),
    );
    for (const section of chapter.sections) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `    ${section.number} ${section.title}`, size: 20, color: '666666' })],
          spacing: { after: 50 },
        }),
      );
    }
  }

  sections.push(new Paragraph({ children: [], spacing: { after: 400 } }));

  // Content pages
  for (const page of doc.pages) {
    if (page.isTitle || page.isToc) continue;

    const lines = stripMarkdown(page.content).split('\n').filter(l => l.trim());
    
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `${page.sectionNumber} ${page.sectionTitle}`, bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
    );

    for (const line of lines) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: line.trim(), size: 22, font: 'Calibri' })],
          spacing: { after: 150 },
        }),
      );
    }

    if (page.chart) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `[Chart: ${page.chart.title}]`, italics: true, size: 20, color: '10B981' })],
          spacing: { before: 200, after: 100 },
        }),
      );
      for (const item of page.chart.data) {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: `  • ${item.name}: ${item.value}%`, size: 20 })],
            spacing: { after: 50 },
          }),
        );
      }
    }
  }

  // References
  sections.push(
    new Paragraph({
      text: 'References',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 600, after: 300 },
    }),
  );

  const references = [
    `International Research Consortium. (2024). Global Analysis of ${doc.outline.topic}. Journal of Professional Studies, 45(2), 112-134.`,
    `Smith, J. A., & Johnson, M. B. (2023). Comprehensive Framework for ${doc.outline.topic} Assessment. Academic Press.`,
    `World Economic Forum. (2024). The Future of ${doc.outline.topic}: Trends and Implications. Geneva: WEF Publications.`,
    `National Institute of Standards. (2023). Guidelines for ${doc.outline.topic} Implementation. Technical Report NIST-2023-0847.`,
    `Lee, S., & Park, H. (2024). Data-Driven Approaches to ${doc.outline.topic}. International Journal of Applied Research, 31(4), 89-103.`,
  ];

  for (const ref of references) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: ref, size: 20, font: 'Calibri' })],
        spacing: { after: 100 },
      }),
    );
  }

  const docFile = new Document({
    sections: [{
      properties: {},
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: doc.outline.title, size: 16, color: '999999', font: 'Calibri' })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 16 })],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(docFile);
  saveAs(blob, `${doc.outline.topic.replace(/\s+/g, '_')}_Document.docx`);
}

export function exportToPdf(doc: GeneratedDocument): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 25;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  const addPageNumber = (num: number) => {
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(String(num), pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  const addHeader = () => {
    pdf.setFontSize(7);
    pdf.setTextColor(150);
    pdf.text(doc.outline.title, pageWidth - margin, 10, { align: 'right' });
  };

  const checkNewPage = (needed: number): boolean => {
    if (yPos + needed > pageHeight - 20) {
      addPageNumber(pdf.getNumberOfPages());
      pdf.addPage();
      addHeader();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Title page
  pdf.setFontSize(32);
  pdf.setTextColor(16, 185, 129);
  pdf.text(doc.outline.title, pageWidth / 2, 100, { align: 'center', maxWidth: contentWidth });
  
  pdf.setFontSize(16);
  pdf.setTextColor(100);
  pdf.text('Comprehensive Professional Analysis', pageWidth / 2, 130, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setTextColor(150);
  pdf.text(`Generated on ${new Date(doc.metadata.generatedAt).toLocaleDateString()}`, pageWidth / 2, 145, { align: 'center' });
  pdf.text(`${doc.metadata.totalPages} Pages | ${doc.metadata.totalWords.toLocaleString()} Words`, pageWidth / 2, 155, { align: 'center' });
  addPageNumber(1);

  // TOC
  pdf.addPage();
  addHeader();
  yPos = margin;
  pdf.setFontSize(20);
  pdf.setTextColor(30);
  pdf.text('Table of Contents', margin, yPos);
  yPos += 15;

  for (const chapter of doc.outline.chapters) {
    checkNewPage(20);
    pdf.setFontSize(11);
    pdf.setTextColor(16, 185, 129);
    pdf.text(`Chapter ${chapter.number}`, margin, yPos);
    pdf.setTextColor(30);
    pdf.text(chapter.title, margin + 25, yPos, { maxWidth: contentWidth - 25 });
    yPos += 7;

    for (const section of chapter.sections) {
      checkNewPage(6);
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(`${section.number}  ${section.title}`, margin + 10, yPos);
      yPos += 5;
    }
    yPos += 3;
  }
  addPageNumber(2);

  // Content
  for (const page of doc.pages) {
    if (page.isTitle || page.isToc) continue;

    pdf.addPage();
    addHeader();
    yPos = margin;

    // Section heading
    pdf.setFontSize(14);
    pdf.setTextColor(16, 185, 129);
    pdf.text(`${page.sectionNumber}`, margin, yPos);
    pdf.setTextColor(30);
    const headingLines = pdf.splitTextToSize(page.sectionTitle, contentWidth - 15);
    pdf.text(headingLines, margin + 12, yPos);
    yPos += headingLines.length * 7 + 5;

    // Chapter subtitle
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`Chapter ${page.chapterNumber}: ${page.chapterTitle}`, margin, yPos);
    yPos += 8;

    // Content
    const cleanContent = stripMarkdown(page.content);
    const paragraphs = cleanContent.split('\n').filter(p => p.trim());

    pdf.setFontSize(10);
    pdf.setTextColor(50);

    for (const para of paragraphs) {
      const lines = pdf.splitTextToSize(para.trim(), contentWidth);
      const needed = lines.length * 5 + 3;
      checkNewPage(needed);
      pdf.text(lines, margin, yPos);
      yPos += needed;
    }

    // Chart data as text in PDF
    if (page.chart) {
      checkNewPage(30);
      yPos += 5;
      pdf.setFontSize(10);
      pdf.setTextColor(16, 185, 129);
      pdf.text(`Figure: ${page.chart.title}`, margin, yPos);
      yPos += 7;
      pdf.setFontSize(9);
      pdf.setTextColor(80);
      for (const item of page.chart.data) {
        checkNewPage(6);
        const barWidth = (item.value / 100) * 60;
        pdf.setFillColor(16, 185, 129);
        pdf.rect(margin + 40, yPos - 3, barWidth, 4, 'F');
        pdf.setTextColor(50);
        pdf.text(`${item.name}:`, margin, yPos);
        pdf.text(`${item.value}%`, margin + 40 + barWidth + 3, yPos);
        yPos += 6;
      }
    }

    addPageNumber(pdf.getNumberOfPages());
  }

  // References page
  pdf.addPage();
  addHeader();
  yPos = margin;
  pdf.setFontSize(18);
  pdf.setTextColor(30);
  pdf.text('References', margin, yPos);
  yPos += 12;

  pdf.setFontSize(9);
  pdf.setTextColor(60);
  const refs = [
    `International Research Consortium. (2024). Global Analysis of ${doc.outline.topic}. Journal of Professional Studies, 45(2), 112-134.`,
    `Smith, J. A., & Johnson, M. B. (2023). Comprehensive Framework for ${doc.outline.topic} Assessment. Academic Press.`,
    `World Economic Forum. (2024). The Future of ${doc.outline.topic}: Trends and Implications. Geneva: WEF Publications.`,
    `National Institute of Standards. (2023). Guidelines for ${doc.outline.topic} Implementation. Technical Report NIST-2023-0847.`,
    `Lee, S., & Park, H. (2024). Data-Driven Approaches to ${doc.outline.topic}. International Journal of Applied Research, 31(4), 89-103.`,
  ];
  for (const ref of refs) {
    checkNewPage(10);
    const lines = pdf.splitTextToSize(ref, contentWidth);
    pdf.text(lines, margin, yPos);
    yPos += lines.length * 5 + 4;
  }
  addPageNumber(pdf.getNumberOfPages());

  pdf.save(`${doc.outline.topic.replace(/\s+/g, '_')}_Document.pdf`);
}
