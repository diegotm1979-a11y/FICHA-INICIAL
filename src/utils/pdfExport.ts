import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface ExportPdfOptions {
  filename: string;
  orientation?: 'portrait' | 'landscape';
  elementId?: string;
  element?: HTMLElement;
}

/**
 * Robustly captures an HTML element and generates an A4 PDF for direct download to the user's computer.
 * Uses html2canvas-pro for full native support of modern CSS (including Tailwind CSS v4's oklch colors).
 * Handles multi-page documents (like rosters or dossiers) by splitting the canvas across A4 pages.
 */
export async function downloadElementAsPdf(
  target: HTMLElement | string,
  filename: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<boolean> {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) {
    console.error('PDF Export: Target element not found');
    return false;
  }

  try {
    const isLandscape = orientation === 'landscape';
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidthMm = isLandscape ? 297 : 210;
    const pageHeightMm = isLandscape ? 210 : 297;
    const marginMm = 8;
    const contentWidthMm = pageWidthMm - marginMm * 2;
    const usablePageHeightMm = pageHeightMm - marginMm * 2;

    // Render high-resolution canvas with full height capture using html2canvas-pro (with oklch support)
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      height: el.scrollHeight,
      windowWidth: el.scrollWidth > 1100 ? el.scrollWidth : 1200,
      onclone: (clonedDoc) => {
        const targetId = typeof target === 'string' ? target : el.id;
        const clonedTarget = targetId ? clonedDoc.getElementById(targetId) : null;
        if (clonedTarget) {
          clonedTarget.style.height = 'auto';
          clonedTarget.style.maxHeight = 'none';
          clonedTarget.style.overflow = 'visible';
        }
      },
    });

    const canvasWidthPx = canvas.width;
    const canvasHeightPx = canvas.height;

    // Collect elements marked to avoid breaking across pages
    const avoidBreakSelectors = [
      '[data-avoid-break="true"]',
      '.print-avoid-break',
      '.break-inside-avoid',
      '.page-break-after',
      '[data-page-break-after="true"]',
      '.grid > div',
      'table tbody tr',
    ];

    const elementsToAvoid = Array.from(
      el.querySelectorAll<HTMLElement>(avoidBreakSelectors.join(', '))
    );

    const rootRect = el.getBoundingClientRect();
    const totalContentHeightCss = el.scrollHeight || rootRect.height;
    const scaleY = canvasHeightPx / totalContentHeightCss;

    const protectedBlocks = elementsToAvoid
      .map((node) => {
        const nodeRect = node.getBoundingClientRect();
        const topRel = nodeRect.top - rootRect.top;
        const heightRel = nodeRect.height;
        const isForceBreakAfter =
          node.classList.contains('page-break-after') ||
          node.getAttribute('data-page-break-after') === 'true';

        return {
          topPx: Math.max(0, topRel * scaleY),
          bottomPx: (topRel + heightRel) * scaleY,
          heightPx: heightRel * scaleY,
          forceBreakAfter: isForceBreakAfter,
        };
      })
      .filter((b) => b.heightPx > 15);

    // Max page height in canvas coordinates according to A4 dimensions
    const maxPageHeightCanvasPx = (usablePageHeightMm / contentWidthMm) * canvasWidthPx;

    let currentTopPx = 0;
    let pageIndex = 0;

    while (currentTopPx < canvasHeightPx - 10) {
      let candidateBottomPx = currentTopPx + maxPageHeightCanvasPx;

      if (candidateBottomPx >= canvasHeightPx) {
        candidateBottomPx = canvasHeightPx;
      } else {
        // 1. Check for intentional explicit page breaks (e.g. dossier card dividers)
        const forceBreakBlock = protectedBlocks.find(
          (b) =>
            b.forceBreakAfter &&
            b.bottomPx > currentTopPx + 80 &&
            b.bottomPx <= candidateBottomPx
        );

        if (forceBreakBlock) {
          candidateBottomPx = Math.min(canvasHeightPx, forceBreakBlock.bottomPx + (4 * scaleY));
        } else {
          // 2. Check if candidateBottomPx cuts through the middle of any atomic section
          const splitBlocks = protectedBlocks.filter(
            (b) =>
              b.topPx < candidateBottomPx - 12 && // Starts before the page cut
              b.bottomPx > candidateBottomPx + 12 && // Ends after the page cut
              b.topPx > currentTopPx + (maxPageHeightCanvasPx * 0.12) // Has reasonable preceding content on this page
          );

          if (splitBlocks.length > 0) {
            // Cut right before the earliest split block to keep the section unified on the next page
            const earliestTop = Math.min(...splitBlocks.map((b) => b.topPx));
            candidateBottomPx = earliestTop;
          }
        }
      }

      const sliceHeightPx = Math.round(candidateBottomPx - currentTopPx);
      if (sliceHeightPx <= 0) {
        break;
      }

      // Create an isolated sub-canvas for this page slice
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidthPx;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          currentTopPx,
          canvasWidthPx,
          sliceHeightPx,
          0,
          0,
          canvasWidthPx,
          sliceHeightPx
        );
      }

      const sliceData = pageCanvas.toDataURL('image/jpeg', 0.95);
      const sliceHeightMm = (sliceHeightPx * contentWidthMm) / canvasWidthPx;

      if (pageIndex > 0) {
        pdf.addPage();
      }
      pdf.addImage(
        sliceData,
        'JPEG',
        marginMm,
        marginMm,
        contentWidthMm,
        sliceHeightMm,
        undefined,
        'FAST'
      );

      currentTopPx = candidateBottomPx;
      pageIndex++;
    }

    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Direct browser file download to computer via Blob URL
    try {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = cleanFilename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        if (document.body.contains(downloadLink)) {
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch {
      // Fallback to pdf.save
      pdf.save(cleanFilename);
    }

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Triggers safe browser printing, handling iframe sandbox restrictions gracefully.
 */
export function safePrint(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.warn('Native window.print() failed in this context:', err);
    return false;
  }
}
