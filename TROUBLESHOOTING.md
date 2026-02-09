# 🔧 Guia de Solução de Problemas - Calculadora de Cerveja

## ✅ Checklist de Configuração

Vamos verificar passo a passo se tudo está configurado corretamente:

---

## 1️⃣ Configuração da Planilha do Google Sheets

### Verifique se os cabeçalhos estão EXATAMENTE assim:

```
A1: Adicionado por
B1: Nome
C1: Mercado/Loja
D1: Preço Total
E1: Quantidade
F1: ML por unidade
G1: Tipo
H1: É Pack
I1: Info Pack
J1: Data/Hora
```

### Nome da aba:
- A primeira aba DEVE se chamar **"Cervejas"** (sem acentos, exatamente assim)

---

## 2️⃣ Configuração do Google Apps Script

### Passo 1: Abrir o Apps Script
1. Na planilha, vá em **Extensões > Apps Script**
2. Delete todo o código que vier por padrão

### Passo 2: Cole este código EXATAMENTE:

```javascript
function doPost(e) {
  try {
    // Permitir CORS
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cervejas');
    
    if (!sheet) {
      throw new Error('Aba "Cervejas" não encontrada');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Adicionar linha na planilha
    sheet.appendRow([
      data.addedBy || '',
      data.name || '',
      data.store || '',
      data.price || 0,
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
```

### Passo 3: Implantar o Apps Script

**MUITO IMPORTANTE:**

1. Clique em **"Implantar" > "Nova implantação"**
2. Em "Tipo", clique no ícone de engrenagem ⚙️ e selecione **"Aplicativo da Web"**
3. Configure assim:
   - **Descrição**: Calculadora de Cerveja
   - **Executar como**: **Eu** (sua conta)
   - **Quem tem acesso**: **Qualquer pessoa** ⚠️ (IMPORTANTE!)
4. Clique em **"Implantar"**
5. **Autorize o script** quando solicitado
6. Copie a **URL do aplicativo da Web**
   - Deve ser algo como: `https://script.google.com/macros/s/ABC123XYZ.../exec`

---

## 3️⃣ Configuração da API Key do Google

### Passo 1: Criar a API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **"APIs e Serviços" > "Biblioteca"**
4. Procure por **"Google Sheets API"**
5. Clique em **"Ativar"**
6. Vá em **"Credenciais"** (menu lateral esquerdo)
7. Clique em **"+ Criar credenciais" > "Chave de API"**
8. Copie a chave gerada

### Passo 2: Restringir a API Key

1. Clique em "Editar chave de API"
2. Em **"Restrições de aplicativo"**, selecione **"Nenhuma"** (ou configure conforme necessário)
3. Em **"Restrições de API"**, selecione **"Restringir chave"**
4. Marque apenas: **Google Sheets API**
5. Clique em **"Salvar"**

---

## 4️⃣ Configuração da Planilha (Compartilhamento)

### Tornar a planilha acessível:

1. Clique em **"Compartilhar"** (canto superior direito)
2. Em **"Acesso geral"**, mude para **"Qualquer pessoa com o link"**
3. Permissão: **"Leitor"** (não precisa ser editor)
4. Clique em **"Concluído"**

### Pegar o ID da planilha:

A URL da planilha é algo como:
```
https://docs.google.com/spreadsheets/d/1abc123XYZ456/edit#gid=0
```

O ID é a parte entre `/d/` e `/edit`:
```
1abc123XYZ456
```

---

## 5️⃣ Configuração do HTML

No arquivo `beer-calculator-sheets.html`, localize a seção CONFIG e preencha:

```javascript
const CONFIG = {
    apiKey: 'AIzaSyB...SUA_CHAVE_AQUI',  // Chave da API do Google
    spreadsheetId: '1abc123XYZ456',      // ID da planilha
    range: 'Cervejas!A:J'                // NÃO MUDE ISSO
};
```

**E TAMBÉM** localize a função `saveToSheets` e atualize:

```javascript
const saveToSheets = async (beer) => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/ABC123.../exec';  // URL do Apps Script
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',  // IMPORTANTE: Adicione esta linha
            body: JSON.stringify({
                addedBy: beer.addedBy,
                name: beer.name,
                store: beer.store,
                price: beer.price,
                quantity: beer.quantity,
                mlPerUnit: beer.mlPerUnit,
                type: beer.type,
                isPack: beer.isPack,
                packInfo: beer.packInfo,
                timestamp: beer.timestamp
            })
        });
        
        // Com mode: 'no-cors', não conseguimos ler a resposta
        // Então vamos apenas assumir sucesso e recarregar
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        await loadFromSheets();
        alert('✅ Cerveja adicionada!');
        
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('❌ Erro ao salvar. Tente novamente.');
    }
};
```

---

## 🧪 Teste Passo a Passo

### Teste 1: Verificar se a API Key funciona

1. Abra o arquivo HTML no navegador
2. Abra o Console do navegador (F12)
3. Digite e execute:

```javascript
fetch(`https://sheets.googleapis.com/v4/spreadsheets/SEU_ID_AQUI/values/Cervejas!A:J?key=SUA_API_KEY_AQUI`)
  .then(r => r.json())
  .then(console.log)
```

4. Você deve ver os dados da planilha no console
5. Se der erro, verifique:
   - ID da planilha
   - API Key
   - Se a planilha está pública
   - Se a API Sheets está ativada

### Teste 2: Verificar o Apps Script

1. Copie a URL do Apps Script
2. Adicione `?test=1` no final
3. Abra no navegador: `https://script.google.com/.../exec?test=1`
4. Você deve ver uma resposta JSON
5. Se pedir autorização, autorize

### Teste 3: Teste completo

1. Abra o arquivo HTML
2. Preencha os dados de uma cerveja
3. Clique em "Adicionar Cerveja"
4. Espere 1-2 segundos
5. Clique no botão "🔄 Atualizar"
6. Verifique se a cerveja apareceu
7. Abra a planilha do Google Sheets para confirmar

---

## ❌ Erros Comuns e Soluções

### Erro: "Erro ao carregar dados"
**Causas possíveis:**
- API Key incorreta ou não configurada
- ID da planilha incorreto
- Planilha não está pública
- Google Sheets API não está ativada

**Solução:**
1. Verifique se a planilha está compartilhada como "Qualquer pessoa com o link"
2. Confirme que a API Key está correta
3. Verifique se ativou a Google Sheets API no Google Cloud Console

### Erro: "Aba 'Cervejas' não encontrada"
**Causas possíveis:**
- Nome da aba está diferente de "Cervejas"
- Existe espaço ou acento no nome

**Solução:**
1. Renomeie a aba para exatamente "Cervejas"
2. Sem acentos, sem espaços extras

### Erro: Cerveja não é salva
**Causas possíveis:**
- Apps Script não foi implantado corretamente
- URL do Apps Script está incorreta
- Apps Script não tem permissão "Qualquer pessoa"

**Solução:**
1. Reimplante o Apps Script
2. Certifique-se de selecionar "Qualquer pessoa" em "Quem tem acesso"
3. Verifique se copiou a URL corretamente (deve terminar com `/exec`)

### Dados não atualizam automaticamente
**Solução:**
1. Clique no botão "🔄 Atualizar"
2. Verifique o console do navegador (F12) para erros
3. Certifique-se de que a API Key está funcionando

---

## 🆘 Ainda não funciona?

Se depois de seguir todos os passos ainda não funcionar:

### Debug Completo:

1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Tente adicionar uma cerveja
4. Copie TODAS as mensagens de erro que aparecerem
5. Me envie essas mensagens

### Informações que eu preciso:

1. Qual erro específico aparece?
2. Aparece alguma mensagem de erro no console?
3. A planilha está pública?
4. Você conseguiu testar a API Key separadamente?
5. O Apps Script foi implantado com "Qualquer pessoa"?

---

## 💡 Dica: Teste Simples Inicial

Se quiser fazer um teste mais simples primeiro, você pode:

1. Usar apenas a **leitura** (não precisa do Apps Script ainda)
2. Adicionar cervejas **manualmente na planilha**
3. Verificar se elas aparecem no app quando você clica em "🔄 Atualizar"

Isso já confirma que a API Key e a leitura estão funcionando!
