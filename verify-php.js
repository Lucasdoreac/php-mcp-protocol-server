#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const readline = require('readline');

console.log('Verificando ambiente PHP...\n');

// Verificar se o PHP está instalado
function checkPHP() {
  return new Promise((resolve, reject) => {
    exec('php --version', (error, stdout, stderr) => {
      if (error) {
        console.error('\x1b[31m✗ PHP não encontrado!\x1b[0m');
        console.error('Por favor, instale o PHP e certifique-se de que está no PATH do sistema.');
        console.error(`Erro: ${error.message}`);
        return reject(error);
      }
      
      const versionMatch = stdout.match(/PHP (\d+\.\d+\.\d+)/);
      const version = versionMatch ? versionMatch[1] : 'desconhecida';
      
      console.log(`\x1b[32m✓ PHP encontrado (versão ${version})\x1b[0m`);
      resolve(version);
    });
  });
}

// Verificar extensões do PHP
function checkExtensions() {
  return new Promise((resolve) => {
    exec('php -m', (error, stdout) => {
      if (error) {
        console.error('\x1b[31m✗ Não foi possível listar as extensões do PHP\x1b[0m');
        return resolve([]);
      }
      
      const extensions = stdout.split('\n')
        .map(ext => ext.trim())
        .filter(Boolean);
      
      const requiredExtensions = ['json', 'mbstring'];
      const recommendedExtensions = ['openssl', 'xml', 'curl'];
      
      console.log('\nVerificando extensões necessárias:');
      
      let allRequired = true;
      requiredExtensions.forEach(ext => {
        if (extensions.includes(ext)) {
          console.log(`\x1b[32m✓ ${ext}\x1b[0m (necessária)`);
        } else {
          console.log(`\x1b[31m✗ ${ext}\x1b[0m (necessária, mas não encontrada)`);
          allRequired = false;
        }
      });
      
      console.log('\nVerificando extensões recomendadas:');
      recommendedExtensions.forEach(ext => {
        if (extensions.includes(ext)) {
          console.log(`\x1b[32m✓ ${ext}\x1b[0m`);
        } else {
          console.log(`\x1b[33m○ ${ext}\x1b[0m (recomendada, mas não encontrada)`);
        }
      });
      
      resolve({ allRequired, extensions });
    });
  });
}

// Verificar configurações do PHP
function checkPHPConfig() {
  return new Promise((resolve) => {
    const phpCode = `<?php
      $config = [];
      $config['max_execution_time'] = ini_get('max_execution_time');
      $config['memory_limit'] = ini_get('memory_limit');
      $config['display_errors'] = ini_get('display_errors');
      
      echo json_encode($config);
    `;
    
    const process = spawn('php', ['-r', phpCode]);
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.on('close', () => {
      try {
        const config = JSON.parse(output);
        console.log('\nConfigurações do PHP:');
        Object.keys(config).forEach(key => {
          console.log(`- ${key}: ${config[key]}`);
        });
        resolve(config);
      } catch (e) {
        console.error('\x1b[31m✗ Não foi possível obter configurações do PHP\x1b[0m');
        resolve({});
      }
    });
  });
}

// Testar execução básica de PHP
function testPHPExecution() {
  return new Promise((resolve) => {
    const testCode = `<?php
      $data = [
        "status" => "ok",
        "timestamp" => time(),
        "php_version" => PHP_VERSION,
        "server_test" => true
      ];
      
      echo json_encode($data);
    `;
    
    const process = spawn('php', ['-r', testCode]);
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      console.error(`\x1b[31mErro: ${data.toString()}\x1b[0m`);
    });
    
    process.on('close', (code) => {
      try {
        const result = JSON.parse(output);
        if (result.status === 'ok') {
          console.log('\n\x1b[32m✓ Teste de execução do PHP bem-sucedido\x1b[0m');
        } else {
          console.log('\n\x1b[31m✗ Teste de execução do PHP falhou\x1b[0m');
        }
        resolve(result);
      } catch (e) {
        console.error('\n\x1b[31m✗ Teste de execução do PHP falhou (saída não é JSON válido)\x1b[0m');
        console.error(`Saída: ${output}`);
        resolve(null);
      }
    });
  });
}

// Executar todas as verificações
async function runAllChecks() {
  try {
    // Checar versão do PHP
    await checkPHP();
    
    // Verificar extensões
    const { allRequired } = await checkExtensions();
    
    // Verificar configurações
    await checkPHPConfig();
    
    // Testar execução
    await testPHPExecution();
    
    console.log('\n---------------------------------------');
    
    if (allRequired) {
      console.log('\n\x1b[32m✓ Ambiente PHP verificado e pronto para uso!\x1b[0m');
      console.log('\nVocê pode iniciar o servidor MCP para PHP com:');
      console.log('npm start');
    } else {
      console.log('\n\x1b[33m⚠ Ambiente PHP parcialmente compatível.\x1b[0m');
      console.log('Algumas extensões necessárias estão faltando.');
      console.log('O servidor pode funcionar, mas com limitações.');
    }
    
  } catch (error) {
    console.log('\n---------------------------------------');
    console.log('\n\x1b[31m✗ Verificação falhou\x1b[0m');
    console.log('Por favor, instale o PHP e tente novamente.');
    process.exit(1);
  }
}

// Iniciar verificações
runAllChecks();
