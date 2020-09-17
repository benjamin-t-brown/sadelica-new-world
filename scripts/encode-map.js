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

const TILE_SIZE = 16;
const ROOM_SIZE = 64;

fs.writeFileSync(
  __dirname + '/../src/js/actors.js',
  actorsArray.reduce((file, { name, x, y }) => {
    const xGlobal = Math.floor(x / TILE_SIZE);
    const yGlobal = Math.floor(y / TILE_SIZE);
    const xWorld = Math.floor(xGlobal / ROOM_SIZE);
    const yWorld = Math.floor(yGlobal / ROOM_SIZE);
    const xLocal = xGlobal % ROOM_SIZE;
    const yLocal = yGlobal % ROOM_SIZE - 1;
    return `${file}\n  G_ACTORS_MAP['${[xWorld, yWorld, xLocal, yLocal].join(
      ','
    )}'] = ${name};`;
  }, 'const G_ACTORS_MAP = {};\nconst G_initActors = () => {') + '\n};\n'
);

console.log('wrote', __dirname + '/../js/actors.js');

const main = async () => {
  const path = __dirname + '/map-template.png';

  var data = fs.readFileSync(path);
  var png = PNG.sync.read(data);
  var options = { colorType: 6 };
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
  var buffer = PNG.sync.write(png, options);
  const path2 = __dirname + '/map-encoded.png';
  fs.writeFileSync(path2, buffer);
  console.log('wrote ' + path2);
  await execAsync(
    `convert -depth 24 -composite -geometry -0-0 ${__dirname}/../res/map.png ${__dirname}/map-encoded.png ${__dirname}/../res/map.png`
  );
  await execAsync(`advpng -z -4 -f -i 3 ${__dirname}/../res/map.png `);
  await execAsync(`advpng -z -4 -f -i 3 ${__dirname}/../res/packed.png `);
  await execAsync(`rm -rf ${__dirname}/map-encoded.png`);
};
main();

// fs.createReadStream(path)
//   .pipe(
//     new PNG({
//       // filterType: 4,
//       colorType: 6,
//       bgColor: {
//         red: 255,
//         green: 255,
//         blue: 255,
//       },
//     })
//   )
//   .on('parsed', async function () {
//     const png = this;
//     for (let y = 0; y < png.height; y++) {
//       for (let x = 0; x < png.width; x++) {
//         let i = y * png.width + x;
//         let mapIndex = mapArray[i];
//         let idx = (png.width * y + x) << 2;

//         if (!colors[mapIndex - 1]) {
//           console.log(
//             'UNKNOWN INDEX',
//             mapIndex,
//             i,
//             png.width,
//             png.height,
//             x,
//             y,
//             mapArray.length,
//             mapArray.slice(-3)
//           );
//           continue;
//         }

//         const [r, g, b] = colors[mapIndex - 1];
//         // console.log(mapIndex, i, r, g, b);
//         png.data[idx] = r;
//         png.data[idx + 1] = g;
//         png.data[idx + 2] = b;
//         png.data[idx + 3] = 255;
//       }
//     }
//     const path = __dirname + '/map-encoded.png';
//     png
//       .pack()
//       .pipe(fs.createWriteStream(path))
//       .then(async () => {
//         console.log('wrote ' + path);
//         await execAsync(
//           `convert -depth 24 -composite -geometry -0-0 ${__dirname}/../res/map.png ${__dirname}/map-encoded.png ${__dirname}/../res/map.png`
//         );
//         await execAsync(`advpng -z -4 -f -i 3 ${__dirname}/../res/map.png `);
//         await execAsync(`advpng -z -4 -f -i 3 ${__dirname}/../res/packed.png `);
//         await execAsync(`rm -rf ${__dirname}/map-encoded.png`);
//       });
//   });
