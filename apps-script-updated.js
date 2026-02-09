// CÓDIGO ATUALIZADO DO GOOGLE APPS SCRIPT
// Copie este código e substitua o que está no Apps Script

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cervejas');
    
    if (!sheet) {
      throw new Error('Aba "Cervejas" não encontrada');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Garantir que o preço seja salvo como número decimal
    const price = parseFloat(data.price);
    
    // Adicionar linha na planilha
    sheet.appendRow([
      data.addedBy || '',
      data.name || '',
      data.store || '',
      price,  // Número decimal
      data.quantity || 0,
      data.mlPerUnit || 0,
      data.type || '',
      data.isPack || false,
      data.packInfo || '',
      data.timestamp || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cervejas');
    
    if (!sheet) {
      throw new Error('Aba "Cervejas" não encontrada');
    }
    
    const data = sheet.getDataRange().getValues();
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: data }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// IMPORTANTE: Configure a coluna D (Preço Total) na planilha como "Número" com 2 casas decimais
// 1. Selecione a coluna D inteira
// 2. Vá em Formatar > Número > Número
// 3. Configure para 2 casas decimais
