// lib/pdf2img.ts
import * as pdfjs from 'pdfjs-dist';

export interface PdfConversionResult {
  imageUrl?: string;
  file: File | null;
  error?: string;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    // Check if file is valid
    if (!file) {
      return { file: null, error: "No file provided" };
    }

    if (file.type !== 'application/pdf') {
      return { file: null, error: `File is not a PDF. Type: ${file.type}` };
    }

    console.log("PDF.js version:", pdfjs.version);
    
    // Set worker to match the installed version (3.11.174)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    
    console.log("Worker set to version 3.11.174");

    console.log("Reading file...");
    const arrayBuffer = await file.arrayBuffer();
    console.log("File read successfully, size:", arrayBuffer.byteLength);

    console.log("Loading PDF document...");
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF loaded, pages:", pdf.numPages);

    console.log("Getting first page...");
    const page = await pdf.getPage(1);
    console.log("Got first page");

    // Set scale for good quality
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return { file: null, error: "Could not create canvas context" };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Fill with white background
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    console.log("Rendering page...");
    await page.render({ 
      canvasContext: context, 
      viewport,
      background: "white" 
    }).promise;
    console.log("Page rendered successfully");

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              file: null,
              error: "Failed to create image blob - canvas.toBlob returned null",
            });
          }
        },
        "image/png",
        0.95 // Slightly reduce quality for better compatibility
      );
    });
    
  } catch (err) {
    console.error("PDF conversion error details:", err);
    return {
      file: null,
      error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}