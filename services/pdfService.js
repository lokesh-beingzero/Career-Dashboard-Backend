import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pdfParseModule = await import('pdf-parse');
const pdfParse = pdfParseModule.PDFParse;

/**
 * Extracts text content from a PDF Buffer
 * @param {Buffer} buffer 
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromPdf = async (buffer) => {
  const uint8ArrayData = new Uint8Array(buffer);
  const pdfParseObj = new pdfParse(uint8ArrayData);
  const pdfData = await pdfParseObj.getText();
  return pdfData.text;
};