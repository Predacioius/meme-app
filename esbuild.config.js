const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outDir = 'dist_app';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const externals = Object.keys(pkg.dependencies || {}).concat(['electron']);

esbuild.buildSync({
    entryPoints: ['./main.js', './server.js', './preload.js'],
    outdir: outDir,
    platform: 'node',
    bundle: true,
    minify: true,
    external: externals,
});

const frontendDir = fs.existsSync('./public/auth.js') ? './public' : '.';

esbuild.buildSync({
    entryPoints: [`${frontendDir}/auth.js`, `${frontendDir}/meme-creator.js`],
    outdir: outDir,
    platform: 'browser',
    bundle: true,
    minify: true,
});

const staticFiles = [
    { src: `${frontendDir}/index.html`, dest: 'index.html' },
    { src: `./license.html`, dest: 'license.html' },
    { src: `${frontendDir}/meme-creator-styles.css`, dest: 'meme-creator-styles.css' }
];

staticFiles.forEach(file => {
    if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, path.join(outDir, file.dest));
    } else {
        console.warn(`⚠️ Warning: Could not find ${file.src} to copy.`);
    }
});

console.log("✅ esbuild finished: Code is minified and comments removed.");