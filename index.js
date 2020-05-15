const glob = require('glob');
const fs = require('fs');

const bundle = () => {
  glob('src/*.js', {}, (err, files) => {
    const fileData = [];

    files.forEach(file => {
      const fileString = fs.readFileSync(file, 'utf-8');

      const fileHeader = fileString.split('\n').shift();
      const fileBody = fileString.split('\n').slice(2).join('\n');

      fileData.push({ order: fileHeader, body: fileBody });
    });

    const outputFile = fileData
      .sort((a, b) => a.order - b.order)
      .map(({ body }) => body)
      .join('\n')

    fs.writeFileSync('main.js', outputFile);
  });
};

bundle();
