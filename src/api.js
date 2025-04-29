const fs = require('fs');

const books = JSON.parse(fs.readFileSync(`${__dirname}/books.json`));

const writeResponse = (request, response, statusCode, data) => {
  const responseJson = JSON.stringify(data);

  response.writeHead(
    statusCode,
    {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(responseJson, 'utf8'),
    },
  );

  if (request.method !== 'HEAD' && statusCode !== 204) {
    response.write(responseJson);
  }

  response.end();
};

const getData = (request, response) => { // get Books
  const message = 'All data retrieved';

  const responseData = {
    message,
    id: 'getData',
    data: books,
  };
  writeResponse(request, response, 200, responseData);
};

const notFound = (request, response) => {
  let message = '';

  const responseData = {
    message,
    id: 'notFound',
  };

  message = 'The page you are looking for was not found.';
  writeResponse(request, response, 404, responseData);
};

const addBook = (request, response) => {
  const message = 'Book data added';
  console.log(message);

  const responseData = {
    message,
    id: 'addBook',
  };

  const { title, author } = request.body;

  if (!title || !author) {
    const obj = {
      message: 'Both fields are required',
      id: 'missingData',
    };
    writeResponse(request, response, 400, obj);
    return;
  }
  let statusCode = 204;

  if (!books[title]) {
    statusCode = 201;
    const newData = {
      author,
      title,
    };
    books.push(newData);
  }

  if (statusCode === 201) {
    const obj = {
      message: 'Created Successfully',
      data: books,
    };
    writeResponse(request, response, statusCode, obj);
    return;
  }
  writeResponse(request, response, statusCode, responseData);
};

const getTitles = (request, response) => {
  const message = 'Titles requested';

  const titlesArr = books.map((item) => item.title);

  const responseData = {
    message,
    id: 'getTitles',
    data: titlesArr,
  };

  writeResponse(request, response, 200, responseData);
};

const getAuthors = (request, response) => {
  const message = 'Authors requested';

  const authorsArr = [...new Set(books.map((item) => item.author))];

  const responseData = {
    message,
    id: 'getAuthors',
    data: authorsArr,
  };

  writeResponse(request, response, 200, responseData);
};

const getRecents = (request, response) => {
  const message = 'Recent titles requested';

  const recentsArr = books.filter((x) => x.year >= 1900);

  const responseData = {
    message,
    id: 'getRecents',
    data: recentsArr,
  };

  writeResponse(request, response, 200, responseData);
};

const addFav = (request, response) => {
  const message = 'Favorite book added';
  console.log(message);

  const responseData = {
    message,
    id: 'addBook',
    data: books,
  };
  console.log(request.body);
  // let { favTitle, favAuthor } = request.body;
  const { title } = request.body;
  const { author } = request.body;

  if (!title || !author) {
    const obj = {
      message: 'Both fields are required',
      id: 'missingData',
    };
    writeResponse(request, response, 400, obj);
    return;
  }
  let statusCode = 204;

  if (!books[title]) {
    statusCode = 201;
    const newData = {
      author,
      title,
      favorite: true,
    };
    books.push(newData);
  }
  const fav = books.find((x) => x.title === title);
  fav.favorite = true;

  if (statusCode === 201) {
    const obj = {
      message: 'Created Successfully',
      data: books,
    };
    writeResponse(request, response, statusCode, obj);
    return;
  }
  writeResponse(request, response, statusCode, responseData);
};

module.exports = {
  notFound, getData, addBook, getTitles, getAuthors, getRecents, addFav,
};
