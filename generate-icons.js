const fs = require('fs');
const sharp = require('sharp');

const svgBuffer = fs.readFileSync('public/logo.svg');

sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/icons/icon-192x192.png')
    .then(() => console.log('Generated 192x192'))
    .catch(err => console.error(err));

sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/icons/icon-512x512.png')
    .then(() => console.log('Generated 512x512'))
    .catch(err => console.error(err));
