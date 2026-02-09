# Calculadora de Cerveja

Aplicação web para comparar preços de cervejas e encontrar o melhor custo-benefício para viagens em grupo.

## Descrição

Este projeto permite que um grupo de pessoas adicione informações sobre cervejas de diferentes mercados e aplicativos, comparando automaticamente os preços por litro para identificar a melhor oferta.

## Funcionalidades

- Adicionar cervejas informando marca, mercado, preço, quantidade e tipo de embalagem
- Cálculo automático de preço por litro e preço por unidade
- Comparação visual destacando a melhor oferta
- Sincronização em tempo real via Google Sheets
- Registro de quem adicionou cada cerveja e quando
- Suporte para compra por unidade ou por pack
- Interface responsiva para uso em celular e desktop

## Tecnologias Utilizadas

- HTML5
- React 18
- Tailwind CSS
- Google Sheets API
- Google Apps Script

## Configuração

### Requisitos

- Conta Google
- Navegador web moderno
- Acesso à internet

### Passo a Passo

1. Criar uma planilha no Google Sheets com os seguintes cabeçalhos na primeira linha:
   - A1: Adicionado por
   - B1: Nome
   - C1: Mercado/Loja
   - D1: Preço Total
   - E1: Quantidade
   - F1: ML por unidade
   - G1: Tipo
   - H1: É Pack
   - I1: Info Pack
   - J1: Data/Hora

2. Renomear a primeira aba para "Cervejas"

3. Configurar a planilha como pública:
   - Clicar em "Compartilhar"
   - Mudar acesso geral para "Qualquer pessoa com o link"
   - Definir permissão como "Leitor"

4. Criar uma API Key no Google Cloud Console:
   - Acessar console.cloud.google.com
   - Criar ou selecionar um projeto
   - Ativar a Google Sheets API
   - Criar credenciais do tipo "Chave de API"
   - Restringir a chave apenas para Google Sheets API

5. Criar e implantar o Google Apps Script:
   - Na planilha, ir em Extensões > Apps Script
   - Colar o código fornecido no arquivo apps-script-updated.js
   - Clicar em Implantar > Nova implantação
   - Selecionar tipo "Aplicativo da Web"
   - Executar como: Eu
   - Quem tem acesso: Qualquer pessoa
   - Copiar a URL do aplicativo da web

6. Configurar o arquivo index.html:
   - Abrir o arquivo index.html
   - Localizar a seção CONFIG
   - Preencher apiKey, spreadsheetId e appsScriptUrl

7. Formatar a coluna de preço na planilha:
   - Selecionar a coluna D inteira
   - Ir em Formatar > Número > Número
   - Configurar para 2 casas decimais

## Uso

1. Abrir o arquivo index.html no navegador ou acessar a URL do GitHub Pages
2. Inserir seu nome quando solicitado
3. Adicionar informações sobre cervejas encontradas
4. Clicar em "Atualizar" para ver adições de outros usuários
5. Verificar qual cerveja tem o melhor custo-benefício

## Estrutura do Projeto

```
beer-trip-planner/
├── index.html              # Aplicação principal
├── apps-script-updated.js  # Código para o Google Apps Script
├── README.md              # Este arquivo
└── TROUBLESHOOTING.md     # Guia de solução de problemas
```

## Contribuindo

Este projeto foi desenvolvido para uso pessoal entre amigos. Sinta-se livre para fazer fork e adaptar conforme suas necessidades.

## Licença

Este projeto é de uso livre para fins pessoais e educacionais.

## Suporte

Para problemas de configuração, consulte o arquivo TROUBLESHOOTING.md.

## Autores

Desenvolvido para facilitar a escolha de cervejas em viagens de grupo.
