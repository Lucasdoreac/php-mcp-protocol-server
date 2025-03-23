<?php
/**
 * Arquivo de teste para o servidor PHP MCP
 */

echo "============================================\n";
echo "   Teste do Servidor PHP MCP Protocol       \n";
echo "============================================\n\n";

// Informações básicas
echo "Informações do ambiente:\n";
echo "- Versão do PHP: " . PHP_VERSION . "\n";
echo "- Sistema Operacional: " . PHP_OS . "\n";
echo "- Data e hora: " . date('Y-m-d H:i:s') . "\n";
echo "- Timezone: " . date_default_timezone_get() . "\n\n";

// Verificar extensões essenciais
$requiredExtensions = ['json', 'mbstring'];
$recommendedExtensions = ['openssl', 'xml', 'curl'];

echo "Verificando extensões necessárias:\n";
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "✓ {$ext} (carregada)\n";
    } else {
        echo "✗ {$ext} (não carregada - pode causar problemas)\n";
    }
}

echo "\nVerificando extensões recomendadas:\n";
foreach ($recommendedExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "✓ {$ext} (carregada)\n";
    } else {
        echo "○ {$ext} (não carregada - opcional)\n";
    }
}

// Teste de codificação de caracteres
echo "\nTeste de codificação UTF-8:\n";
$utf8String = "Olá, 你好, こんにちは, Привет!";
echo $utf8String . "\n";

// Teste de recursos de entrada/saída
echo "\nTeste de recursos de entrada/saída:\n";
try {
    $tempDir = sys_get_temp_dir();
    echo "- Diretório temporário: {$tempDir}\n";
    
    // Verifique permissões de escrita
    if (is_writable($tempDir)) {
        echo "✓ Permissão de escrita em diretório temporário\n";
    } else {
        echo "✗ Sem permissão de escrita em diretório temporário\n";
    }
} catch (Exception $e) {
    echo "✗ Erro ao verificar recursos de IO: " . $e->getMessage() . "\n";
}

// Teste JSON
echo "\nTeste de codificação/decodificação JSON:\n";
$data = [
    'status' => 'ok',
    'message' => 'Servidor PHP MCP está funcionando corretamente',
    'timestamp' => time(),
    'feature_test' => [
        'arrays' => [1, 2, 3, 4, 5],
        'objects' => (object)['a' => 1, 'b' => 2],
        'nested' => [
            'level1' => [
                'level2' => [
                    'level3' => 'valor aninhado'
                ]
            ]
        ]
    ]
];

$json = json_encode($data, JSON_PRETTY_PRINT);
echo $json . "\n";

// Teste de decodificação
$decoded = json_decode($json, true);
if (json_last_error() === JSON_ERROR_NONE) {
    echo "✓ Decodificação JSON funcionando corretamente\n";
} else {
    echo "✗ Erro na decodificação JSON: " . json_last_error_msg() . "\n";
}

// Resumo final
echo "\n============================================\n";
echo "Teste concluído!\n";
echo "O PHP está " . (extension_loaded('json') && extension_loaded('mbstring') ? "pronto" : "parcialmente pronto") . " para uso com o servidor MCP.\n";
echo "============================================\n";
