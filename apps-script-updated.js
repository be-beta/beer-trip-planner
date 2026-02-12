// APPS SCRIPT PARA GRUPOS SIMPLES
// Cole este código no Google Apps Script

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Criar grupo
    if (data.action === 'create_group') {
      const groupsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Grupos');
      
      if (!groupsSheet) {
        throw new Error('Aba "Grupos" não encontrada');
      }
      
      groupsSheet.appendRow([
        data.groupId,
        data.groupName,
        data.groupCode
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, action: 'group_created' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Adicionar cerveja
    if (data.action === 'add_beer') {
      const beersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cervejas');
      
      if (!beersSheet) {
        throw new Error('Aba "Cervejas" não encontrada');
      }
      
      const price = parseFloat(data.price);
      
      beersSheet.appendRow([
        data.addedBy || '',
        data.name || '',
        data.store || '',
        price,
        data.quantity || 0,
        data.mlPerUnit || 0,
        data.type || '',
        data.isPack || false,
        data.packInfo || '',
        data.timestamp || '',
        data.groupId || '',  // Coluna K - ID do Grupo
        false                // Coluna L - Deletado
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, action: 'beer_added' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Deletar cerveja (soft delete)
    if (data.action === 'delete_beer') {
      const beersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cervejas');
      
      if (!beersSheet) {
        throw new Error('Aba "Cervejas" não encontrada');
      }
      
      const rowIndex = data.rowIndex;
      beersSheet.getRange(rowIndex, 12).setValue(true);  // Coluna L (12)
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, action: 'beer_deleted' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Ação não reconhecida' }))
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