const http = require('http');
const query = require('querystring');
const api = require('./api.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const getGrabbers = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyles,
  // '/docs.html': htmlHandler.getDocs,
  '/notReal': api.notFound,
  '/test': api.getData,
  '/getTitles': api.getTitles,
  '/getAuthors': api.getAuthors,
  '/getRecents': api.getRecents,
};

const postHandlers = {
  '/addBook': api.addBook,
  '/addFav': api.addFav,
};

const handlePost = (request, response, poster) => {
  const body = [];
  request.on('error', (error) => {
    console.dir(error);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);
    poster(request, response);
  });
};

const onRequest = (request, response) => {
  console.log(request.url);
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  request.acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : [];
  request.query = Object.fromEntries(parsedUrl.searchParams);

  if (request.method === 'POST') {
    if (postHandlers[parsedUrl.pathname]) {
      handlePost(request, response, postHandlers[parsedUrl.pathname]);
    } else {
      api.notFound(request, response);
    }
  } else if (getGrabbers[parsedUrl.pathname]) {
    getGrabbers[parsedUrl.pathname](request, response);
  } else {
    api.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.01:${port}`);
});
