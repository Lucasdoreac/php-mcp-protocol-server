# PHP MCP Protocol Server

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Servidor MCP (Model Context Protocol) para PHP, que permite integrar o PHP com o Claude AI da Anthropic. Utiliza o SDK MCP oficial para fornecer uma solução robusta e compatível com o protocolo.

## Recursos

- Execução de código PHP direto do Claude
- Implementação baseada no SDK MCP oficial da Anthropic
- Tratamento adequado de erros e exceções
- Limpeza automática de arquivos temporários
- Suporte a verificação do ambiente PHP

## Requisitos

- Node.js (v14 ou superior)
- PHP (v7.0 ou superior)
- npm ou yarn

## Instalação

### Global (recomendado)

```bash
npm install -g php-mcp-protocol-server
```

Após a instalação global, você pode iniciar o servidor com:

```bash
php-mcp-server
```

### Local via npm

```bash
npm install php-mcp-protocol-server
```

### Via GitHub

```bash
git clone https://github.com/Lucasdoreac/php-mcp-protocol-server.git
cd php-mcp-protocol-server
npm install
```

## Uso

### Verificar o ambiente PHP

Antes de começar, verifique se o PHP está corretamente instalado:

```bash
npm run verify
```

### Iniciar o servidor

```bash
npm start
```

Por padrão, o servidor escutará na porta 7654. Você pode alterar isso definindo a variável de ambiente `MCP_PORT`.

### Integração com o Claude AI

1. Inicie o servidor PHP MCP
2. No aplicativo Claude Desktop, configure para usar uma ferramenta MCP local em `localhost:7654`
3. Você pode agora executar código PHP diretamente do Claude!

## API MCP

O servidor expõe duas ferramentas MCP:

### executePhp

Executa código PHP e retorna a saída.

**Parâmetros:**
- `code` (string): O código PHP a ser executado

**Retorno:**
- `output` (string): A saída do código PHP
- `error` (string, opcional): Mensagens de erro, se houver
- `exitCode` (number, opcional): Código de saída do processo PHP

### phpInfo

Retorna informações detalhadas sobre o ambiente PHP.

**Parâmetros:** Nenhum

**Retorno:**
- `info` (string): Informações sobre o ambiente PHP, incluindo versão, extensões e configurações

## Exemplo de uso no Claude

Para usar o PHP no Claude, basta pedir para executar código PHP. Por exemplo:

```
Pode executar este código PHP para mim?

<?php
$data = [
  'nome' => 'Exemplo',
  'valor' => 42,
  'timestamp' => time()
];

echo "Dados em JSON:\n";
echo json_encode($data, JSON_PRETTY_PRINT);
?>
```

## Solução de Problemas

Se o servidor não iniciar ou ocorrerem erros:

1. Verifique se o PHP está instalado e no PATH do sistema
2. Confirme que a porta 7654 (ou a configurada) está disponível
3. Verifique os logs do servidor para mensagens de erro detalhadas

## Licença

MIT