#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Verifica preparazione per deploy su Render...\n');

const checks = [];

// Verifica file essenziali
const requiredFiles = [
    'render.yaml',
    '.env.example',
    'package.json',
    'backend/package.json',
    'frontend/package.json',
    'backend/src/index.js',
    'frontend/vite.config.ts',
    'DEPLOY.md'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        checks.push(`✅ ${file} - presente`);
    } else {
        checks.push(`❌ ${file} - mancante`);
    }
});

// Verifica configurazione backend
try {
    const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    if (backendPackage.scripts.build && backendPackage.scripts.start) {
        checks.push('✅ Backend - script build e start configurati');
    } else {
        checks.push('❌ Backend - script build o start mancanti');
    }
} catch (error) {
    checks.push('❌ Backend - package.json non valido');
}

// Verifica configurazione frontend
try {
    const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
    if (frontendPackage.scripts.build && frontendPackage.devDependencies.terser) {
        checks.push('✅ Frontend - script build e terser configurati');
    } else {
        checks.push('❌ Frontend - script build o terser mancanti');
    }
} catch (error) {
    checks.push('❌ Frontend - package.json non valido');
}

// Verifica Vite config
try {
    const viteConfig = fs.readFileSync('frontend/vite.config.ts', 'utf8');
    if (viteConfig.includes('build:') && viteConfig.includes('minify: "terser"')) {
        checks.push('✅ Frontend - Vite config ottimizzato per produzione');
    } else {
        checks.push('⚠️  Frontend - Vite config potrebbe non essere ottimizzato');
    }
} catch (error) {
    checks.push('❌ Frontend - vite.config.ts non leggibile');
}

// Verifica render.yaml
try {
    const renderYaml = fs.readFileSync('render.yaml', 'utf8');
    if (renderYaml.includes('type: web') && renderYaml.includes('type: static')) {
        checks.push('✅ Render - configurazione servizi completa');
    } else {
        checks.push('❌ Render - configurazione incompleta');
    }
} catch (error) {
    checks.push('❌ Render - render.yaml non leggibile');
}

// Output risultati
console.log('Risultati verifica:\n');
checks.forEach(check => console.log(check));

const errors = checks.filter(check => check.startsWith('❌'));
const warnings = checks.filter(check => check.startsWith('⚠️'));

console.log(`\n📊 Riepilogo:`);
console.log(`✅ Successi: ${checks.length - errors.length - warnings.length}`);
console.log(`⚠️  Avvertimenti: ${warnings.length}`);
console.log(`❌ Errori: ${errors.length}`);

if (errors.length === 0) {
    console.log('\n🎉 Il progetto è pronto per il deploy su Render!');
    console.log('📖 Leggi DEPLOY.md per le istruzioni complete');
} else {
    console.log('\n⛔ Risolvi gli errori prima di procedere con il deploy');
}

console.log('\n🚀 Prossimi passi:');
console.log('1. Configura le variabili d\'ambiente (vedi .env.example)');
console.log('2. Push del codice su GitHub');
console.log('3. Crea Blueprint su Render');
console.log('4. Inserisci le variabili d\'ambiente su Render');
