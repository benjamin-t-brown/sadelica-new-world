var http = require('http');
var fs = require('fs');
var exp;

var BASEDIR = false;

var _handlers = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

var parse_url = function (url) {
  var path = url.split(/\/|\\/);
  var ret = {
    extension: '',
    filename: '',
    url: path.join('/'),
  };

  if (path[1].toLowerCase() === 'server') {
    ret.url = '/topkek';
    return ret;
  }

  var match = path.slice(-1)[0].match(/\.(.*?)$/);
  if (match) {
    ret.extension = (match[1] || '').toLowerCase();
  }

  ret.filename = path.slice(-1)[0];

  if (path.length === 2 && path.slice(-1)[0].length <= 1) {
    ret.extension = 'html';
    ret.filename = 'index';
    ret.url = '/index.html';
  }

  var spl = ret.url.split('/');
  ret.event_url = spl[1];
  ret.event_args = spl.slice(2);

  return ret;
};

var REST = {
  GET: function (url_obj, response, request) {
    var new_url = '';
    if (BASEDIR) {
      new_url = BASEDIR + '/' + url_obj.url;
    } else {
      new_url = __dirname + '/../' + url_obj.url;
    }
    new_url = new_url.replace(/\\/g, '/').replace(/\/\//g, '/');
    fs.exists(new_url, function (exists) {
      if (exists) {
        fs.readFile(new_url, function (err, data) {
          if (err) {
            response.statusCode = 500;
            response.end('{}');
            console.error(err);
            return;
          }
          response.statusCode = 200;
          response.setHeader(
            'content-type',
            exp.get_mime_type(url_obj.extension)
          );
          response.end(data);
        });
      } else {
        if (_handlers.GET[url_obj.event_url]) {
          _handlers.GET[url_obj.event_url](url_obj, response, request);
        } else {
          console.info('NOT FOUND', new_url);
          exp.not_found(response);
        }
      }
    });
  },
  POST: function (url_obj, response, data) {
    if (!data.length) {
      data = '{}';
    }
    if (_handlers.POST[url_obj.event_url]) {
      _handlers.POST[url_obj.event_url](url_obj, response, JSON.parse(data));
    } else {
      exp.not_found(response);
    }
  },
  PUT: function (url_obj, response, data) {
    if (!data.length) {
      data = '{}';
    }
    if (_handlers.PUT[url_obj.event_url]) {
      _handlers.PUT[url_obj.event_url](url_obj, response, JSON.parse(data));
    } else {
      exp.not_found(response);
    }
  },
  DELETE: function (url_obj, response, request) {
    if (_handlers.DELETE[url_obj.event_url]) {
      _handlers.DELETE[url_obj.event_url](url_obj, response, request);
    } else {
      exp.not_found(response);
    }
  },
};

exp = {
  start: function (port, basedir) {
    BASEDIR = basedir || false;
    return http
      .createServer(function (request, response) {
        var url_obj = parse_url(request.url);
        var method = request.method.toUpperCase();
        console.info(method, request.url);

        if (REST[method]) {
          var data = '';
          request.on('data', function (d) {
            data += d;
            if (data.length > 1e6) {
              response.statusCode = 413;
              response.end('POST request too large.');
            }
          });
          request.on('end', function () {
            try {
              REST[method](url_obj, response, data);
            } catch (e) {
              console.error(e);
              response.statusCode = 500;
              response.end('Error: ' + e.message);
            }
          });
        } else {
          response.statusCode = 400;
          response.end('Forbidden: ' + url_obj.url);
        }
      })
      .listen(port);
  },
  on: function (method, name, func) {
    console.info('Set handler', method, '"' + name + '"');
    if (_handlers[method][name]) {
      console.trace();
      console.info('[WARNING] Overwriting event', method, name);
    }
    _handlers[method][name] = func;
  },
  get: function (name, func) {
    exp.on('GET', name, func);
  },
  post: function (name, func) {
    exp.on('POST', name, func);
  },
  put: function (name, func) {
    exp.on('PUT', name, func);
  },
  del: function (name, func) {
    exp.on('DELETE', name, func);
  },

  reply: function (response, data) {
    response.statusCode = 200;
    response.setHeader('content-type', 'application/json');
    response.end(typeof data === 'string' ? data : JSON.stringify(data));
  },
  not_found: function (response) {
    response.statusCode = 404;
    response.end(JSON.stringify(['Not found']));
  },
};

exp.get_mime_type = function (extension) {
  var mimes = {
    js: 'text/javascript',
    html: 'text/html',
    css: 'text/css',
    png: 'image/png',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    csv: 'text/csv',
    woff: 'font/woff',
    woff2: 'font/woff2',
  };

  return mimes[extension] || 'text/plain';
};

module.exports = exp;
