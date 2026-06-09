const fs = require('fs');
const pdfParse = require('pdf-parse');

async function testPdf() {
  try {
    // Let's create a perfectly valid minimalist PDF using a string buffer
    // This is a minimal valid PDF 1.0 document
    const pdfString = `%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF`;
    
    const buffer = Buffer.from(pdfString);
    const data = await pdfParse(buffer);
    console.log("SUCCESS:", data.text);
  } catch (err) {
    console.error("PDF PARSE ERROR:", err);
  }
}

testPdf();
