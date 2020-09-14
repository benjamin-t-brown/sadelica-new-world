const fs = require('fs');
const { exec } = require('child_process');
const { PNG } = require('pngjs');
const map = require('../scratch/map.js');

const execAsync = async command => {
  return new Promise((resolve, reject) => {
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err + ' ' + stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

const colors = {
  0: [50, 115, 69], // grass
  1: [63, 40, 50], // dirt
  2: [255, 255, 255], // snow
  3: [255, 231, 98], // sand
  4: [25, 61, 63], // tree
  5: [35, 71, 93], // tree snow
  6: [0, 0, 0], // wall
  7: [79, 103, 129], // floor
  8: [60, 60, 60], // open gate
  9: [80, 30, 30], // closed gate
  10: [184, 111, 80], // chest
  11: [4, 132, 209], // water
  12: [229, 59, 68], // lava
  13: [44, 232, 244], // ice
  14: [251, 146, 43], // sandstorm
  15: [175, 191, 210], // something
};
const mapArray = map.layers[0].data;
const actorsArray = map.layers[1].objects;

fs.writeFileSync(
  __dirname + '/../src/lib/actors.js',
  actorsArray.reduce((file, { name, x, y }) => {
    const xGlobal = Math.floor(x / 16);
    const yGlobal = Math.floor(y / 16);
    const xWorld = Math.floor(xGlobal / 16);
    const yWorld = Math.floor(yGlobal / 16);
    const xLocal = xGlobal % 16;
    const yLocal = yGlobal % 16;
    return `${file}\n  G_ACTORS_MAP['${[xWorld, yWorld, xLocal, yLocal].join(
      ','
    )}'] = ${name};`;
  }, 'const G_ACTORS_MAP = {};\nconst G_initActors = () => {') + '\n};\n'
);

console.log('wrote', __dirname + '/../lib/actors.js');

const path = __dirname + '/map-template.png';
fs.createReadStream(path)
  .pipe(
    new PNG({
      // filterType: 4,
      colorType: 6,
      bgColor: {
        red: 255,
        green: 255,
        blue: 255,
      },
    })
  )
  .on('parsed', async function () {
    const png = this;
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        let i = y * png.width + x;
        let mapIndex = mapArray[i];
        let idx = (png.width * y + x) << 2;

        if (!colors[mapIndex - 1]) {
          console.log(
            'UNKNOWN INDEX',
            mapIndex,
            i,
            png.width,
            png.height,
            x,
            y,
            mapArray.length,
            mapArray.slice(-3)
          );
          continue;
        }

        const [r, g, b] = colors[mapIndex - 1];
        // console.log(mapIndex, i, r, g, b);
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255;
      }
    }
    const path = __dirname + '/map-encoded.png';
    png.pack().pipe(fs.createWriteStream(path));
    console.log('wrote ' + path);
    await execAsync(
      `convert -depth 24 -composite -geometry -0+64 ${__dirname}/../res/packed.png ${__dirname}/map-encoded.png ${__dirname}/../res/packed.png`
    );
    await execAsync(`advpng -z -4 -f -i 3 ${__dirname}/../res/packed.png `);
    await execAsync(`rm -rf ${__dirname}/map-encoded.png`);
  });
