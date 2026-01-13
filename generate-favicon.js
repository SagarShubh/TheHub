const fs = require('fs');
const sharp = require('sharp');

const svgBuffer = fs.readFileSync('public/logo.svg');

sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('public/favicon.ico')
    .then(() => console.log('Generated favicon.ico'))
    .catch(err => console.error(err));
