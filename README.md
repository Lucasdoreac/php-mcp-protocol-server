# PHP MCP Protocol Server

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Servidor MCP (Model Context Protocol) para integração com PHP. Permite a execução de código PHP através de uma interface de comunicação baseada em JSON-RPC 2.0.

## Requisitos

- Node.js (v14 ou superior)
- PHP (v7.0 ou superior)

## Instalação

### Via NPM

```bash
npm install -g php-mcp-protocol-server
```

### Via GitHub

```bash
git clone https://github.com/Lucasdoreac/php-mcp-protocol-server.git
cd php-mcp-protocol-server
npm install
```

## Uso

### Verificar Requisitos

Verifique se o PHP está instalado e configurado corretamente:

```bash
npm run verify
```

### Iniciar o Servidor

```bash
npm start
# ou
php-mcp-server
```

Por padrão, o servidor escutará na porta 7654. Você pode alterar isso definindo a variável de ambiente `MCP_PORT`.

### Testar a Instalação PHP

```bash
npm run test
```

### Testar o Cliente MCP

```bash
npm run test-client
```

## Protocolo

O servidor implementa o protocolo JSON-RPC 2.0 sobre TCP. As principais mensagens suportadas são:

### Inicialização

**Requisição:**
```json
{
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "cliente-exemplo",
      "version": "1.0.0"
    }
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "capabilities": {
      "supportsPhp": true,
      "version": "1.0.0"
    }
  }
}
```

### Execução de Código PHP

**Requisição:**
```json
{
  "method": "executePhp",
  "params": {
    "code": "<?php echo 'Hello, World!';"
  },
  "jsonrpc": "2.0",
  "id": 2
}
```

**Resposta:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "output": "Hello, World!"
  }
}
```

## Integração com Anthropic Claude

Este servidor foi projetado para funcionar com o Anthropic Claude e outros sistemas que utilizam o protocolo MCP para integração com PHP.

## Solução de Problemas

Verifique o arquivo `mcp-server.log` para informações detalhadas sobre a execução do servidor.

## Licença

MIT