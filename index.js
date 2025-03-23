#!/usr/bin/env node

const { createServer } = require('@anthropic-ai/sdk-mcp');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Gerar um diretório temporário para arquivos PHP
const TMP_DIR = path.join(os.tmpdir(), 'php-mcp-server');
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Função para log
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.error(`${timestamp} [php-mcp-server] [${level}] ${message}`);
}

// Verificar se PHP está instalado
try {
  const { status } = spawn('php', ['--version']);
  if (status !== 0) {
    log('PHP não encontrado. Por favor, instale o PHP.', 'error');
    process.exit(1);
  }
} catch (e) {
  // Se não lançou exceção, o PHP está disponível
}

// Função principal para executar código PHP
async function executePhp(code) {
  return new Promise((resolve, reject) => {
    try {
      // Criar arquivo temporário com o código PHP
      const tempFile = path.join(TMP_DIR, `php_${Date.now()}_${Math.random().toString(36).substring(2)}.php`);
      fs.writeFileSync(tempFile, code);
      
      // Executar o código PHP
      const process = spawn('php', [tempFile]);
      
      let output = '';
      let errorOutput = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      process.on('close', (code) => {
        // Limpar arquivo temporário
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {
          // Ignorar erros ao excluir arquivo temporário
        }
        
        // Retornar resultado
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ 
            success: false, 
            output, 
            error: errorOutput, 
            exitCode: code 
          });
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Criar servidor MCP
const server = createServer({
  tools: {
    // Definir a ferramenta de execução de PHP
    executePhp: {
      description: 'Executa código PHP e retorna a saída',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Código PHP a ser executado'
          }
        },
        required: ['code']
      },
      async handler({ code }) {
        log(`Executando código PHP: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
        try {
          const result = await executePhp(code);
          if (result.success) {
            return { output: result.output };
          } else {
            return { 
              output: result.output,
              error: result.error,
              exitCode: result.exitCode
            };
          }
        } catch (error) {
          log(`Erro ao executar PHP: ${error.message}`, 'error');
          throw new Error(`Erro ao executar PHP: ${error.message}`);
        }
      }
    },
    
    // Ferramenta para verificar o ambiente PHP
    phpInfo: {
      description: 'Retorna informações sobre o ambiente PHP',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      },
      async handler() {
        try {
          const infoCode = `<?php
            echo "PHP Version: " . PHP_VERSION . "\\n";
            echo "PHP OS: " . PHP_OS . "\\n";
            echo "Extensions: " . implode(", ", get_loaded_extensions()) . "\\n";
            echo "Loaded INI files: " . php_ini_loaded_file() . "\\n";
            echo "Server API: " . php_sapi_name() . "\\n";
            
            $config = [];
            $config['max_execution_time'] = ini_get('max_execution_time');
            $config['memory_limit'] = ini_get('memory_limit');
            $config['display_errors'] = ini_get('display_errors');
            $config['log_errors'] = ini_get('log_errors');
            $config['error_log'] = ini_get('error_log');
            
            echo "\\nConfiguração:\\n";
            foreach ($config as $key => $value) {
              echo "$key: $value\\n";
            }
          `;
          
          const result = await executePhp(infoCode);
          return { info: result.output };
        } catch (error) {
          log(`Erro ao obter informações do PHP: ${error.message}`, 'error');
          throw new Error(`Erro ao obter informações do PHP: ${error.message}`);
        }
      }
    }
  }
});

// Porta padrão: 7654 (pode ser alterada pela variável de ambiente MCP_PORT)
const PORT = process.env.MCP_PORT || 7654;

// Iniciar o servidor
server.listen(PORT, () => {
  log(`Servidor MCP para PHP iniciado na porta ${PORT}`);
  log(`Para conectar usando Claude, configure para usar este servidor em localhost:${PORT}`);
});

// Tratamento de erros e encerramento
process.on('SIGINT', () => {
  log('Encerrando servidor...');
  server.close();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  log(`Exceção não tratada: ${err.stack}`, 'error');
});
