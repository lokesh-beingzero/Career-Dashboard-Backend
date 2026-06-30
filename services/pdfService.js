import * as pdfParseModule from 'pdf-parse';

// Access the underlying PDFParse constructor directly from the namespace module
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