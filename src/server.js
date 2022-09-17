const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const queryParams = query.parse(parsedUrl.query);

  let firstType = acceptedTypes[0];
  if (firstType !== 'application/json' && firstType !== 'text/xml') {
    firstType = 'application/json';
  }

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, firstType, queryParams);
  } else {
    urlStruct.notFound(request, response, firstType);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
