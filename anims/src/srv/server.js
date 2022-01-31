const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = 8888;

const SPRITESHEETS_DIR = path.resolve(`${__dirname}/../../../res`);

const SPRITESHEETS_SUB_DIRS = ['img'];

const TXT_DIR = path.resolve(`${__dirname}/../../txt`);
const EXPORT_DIR_RES = path.resolve(`${__dirname}/../../../res`);
const ZIP_DIR = path.resolve(`${__dirname}/../../../res`);

const requestLogger = (req, res, next) => {
  const currentDatetime = new Date();
  const formatted_date =
    currentDatetime.getFullYear() +
    '-' +
    (currentDatetime.getMonth() + 1) +
    '-' +
    currentDatetime.getDate() +
    ' ' +
    currentDatetime.getHours() +
    ':' +
    currentDatetime.getMinutes() +
    ':' +
    currentDatetime.getSeconds();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  const log = `[${formatted_date}] ${method}:${url} ${status}`;
  console.log('[Anims SRV]', log);
  next();
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../../public`));
app.use(express.static(`${__dirname}/../../../res`));
app.use(requestLogger);

app.get('/images.zip', (req, res) => {
  console.log(`[Anims SRV] GET/images.zip`, req.body);
  res.sendFile(ZIP_DIR + '/images.zip');
});

app.get('/spritesheets', (req, res) => {
  console.log(`[Anims SRV] GET/spritesheets`, req.body);
  const resp = {
    files: [],
    err: null,
  };

  const filterFiles = files =>
    files.filter(fileName => fileName.indexOf('.png') > -1);

  fs.readdir(SPRITESHEETS_DIR, async (err, files) => {
    if (err) {
      resp.err = err;
    } else {
      resp.files = filterFiles(files);
      for (let i = 0; i < SPRITESHEETS_SUB_DIRS.length; i++) {
        const subPath = SPRITESHEETS_SUB_DIRS[i];
        const fullPath = SPRITESHEETS_DIR + '/' + subPath;
        try {
          const subFiles = fs.readdirSync(fullPath);
          resp.files = resp.files.concat(
            filterFiles(subFiles.map(fileName => subPath + '/' + fileName))
          );
        } catch (e) {
          console.error('Failed to load sub dir: ' + fullPath, e);
          continue;
        }
      }
      resp.files = resp.files.sort();
    }

    res.send(JSON.stringify(resp));
  });
});

app.get('/txt', (req, res) => {
  console.log(`[Anims SRV] GET/txt`, req.body);
  const resp = {
    txt: '',
    err: null,
  };

  fs.readdir(TXT_DIR, async (err, files) => {
    if (err) {
      resp.err = err;
    } else {
      resp.files = await Promise.all(
        files
          .filter(fileName => fileName.indexOf('.txt') > -1)
          .sort()
          .map(fileName => {
            return new Promise((resolve, reject) => {
              fs.readFile(TXT_DIR + '/' + fileName, (err, data) => {
                if (err) {
                  console.err(
                    'Failed to read file',
                    TXT_DIR + '/' + fileName,
                    err
                  );
                  reject(err);
                } else {
                  resolve(data.toString());
                }
              });
            });
          })
      );
    }
    res.send(JSON.stringify(resp));
  });
});

app.post('/txt', (req, res) => {
  console.log(`[Anims SRV] POST/txt`, req.body);
  const resp = {
    success: false,
    err: null,
  };
  let valid = false;

  console.log('BODY', req.body);

  if (!req.body.txt) {
    resp.err = 'No txt json provided.';
  } else {
    valid = true;
  }

  if (valid) {
    fs.writeFile(`${TXT_DIR}/res.txt`, req.body.txt, async err => {
      if (err) {
        resp.err = err;
      } else {
        resp.success = true;
      }
      await fs.promises.writeFile(EXPORT_DIR_RES + '/res.txt', req.body.txt);
      // const result = await execAsync(
      //   `cp -r ${SPRITESHEETS_DIR}/*.png ${EXPORT_DIR_PNG}/`
      // );
      // console.log('RESULT', result);
      res.send(JSON.stringify(resp));
    });
  } else {
    res.send(JSON.stringify(resp));
  }
});

app.listen(PORT, () => {
  console.log(`[Anims SRV] Listening on port ${PORT}`);
});
