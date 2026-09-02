const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const specFile = path.join(__dirname, '..', 'docs', 'swagger-documentation.yaml');

const swaggerSpec = yaml.load(fs.readFileSync(specFile, 'utf8'));

module.exports = { swaggerSpec };