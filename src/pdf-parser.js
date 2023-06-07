// https://www.labnol.org/extract-text-from-pdf-220422
function extractPdfText(fileId) {
    const language = 'fr';
    const pdfDocument = DriveApp.getFileById(fileId);
    const { id, title } = Drive.Files.insert(
      {
        title: pdfDocument.getName().replace(/\.pdf$/, ''),
        mimeType: pdfDocument.getMimeType() || 'application/pdf',
      },
      pdfDocument.getBlob(),
      {
        ocr: true,
        ocrLanguage: language,
        fields: 'id,title',
      }
    );
    const textContent = DocumentApp.openById(id).getBody().getText();
    Drive.Files.remove(id);
    Drive.Files.remove(fileId);
    return textContent;
  };
  