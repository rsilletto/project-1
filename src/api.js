const fs = require('fs');

const data = JSON.parse(fs.readFileSync(`${__dirname}/books.json`));

const writeResponse = (request, response, statusCode, data) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });

  if (request.method !== 'HEAD' && statusCode !== 204) {
    const responseJson = JSON.stringify(data);
    response.write(responseJson);
  }

  response.end();
};

const getData = (request, response) => { // get Books
    const message = "All data retrieved";

    const responseData = {
        message: message,
        id: 'getData',
        data: data,
    }

    const responseMessage = JSON.stringify(responseData);
    writeResponse(request, response, 200, responseMessage);
}

const notFound = (request, response) => {
  let message = '';

  const responseData = {
    message,
    id: 'notFound',
  };

  const responseMessage = JSON.stringify(responseData);

  message = 'The page you are looking for was not found.';
  writeResponse(request, response, 404, responseMessage);
};

const addBook = (request, response) => {
  const message = 'Book added';
  console.log(message);

  const responseData = {
    message: message,
    id: 'addBook',
  }

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

  if (!data[title]) {
    statusCode = 201;
    // data[title] = { title };
    let newData = {
      author: author,
      title: title,
    };
    data.push(newData);

  }
  // data[title].author = author;

  if (statusCode === 201) {
    const obj = {
      message: 'Created Successfully',
      data: data,
    };
    writeResponse(request, response, statusCode, obj);
    return;
  }
  writeResponse(request, response, statusCode, {});
}

const getTitles = (request, response) => {
  const message = "Titles requested";

  let titlesArr;

  titlesArr = data.map( (item) => item["title"] );

  const responseData = {
    message: message,
    id: "getTitles",
    data: titlesArr,
  }

  const responseMessage = JSON.stringify(responseData);
  writeResponse(request, response, 200, responseMessage);
}

const getAuthors = (request, response) => {
  const message = "Authors requested";

  let authorsArr;

  authorsArr = [...new Set(data.map( (item) => item["author"] ))];

  const responseData = {
    message: message,
    id: "getAuthors",
    data: authorsArr,
  }

  const responseMessage = JSON.stringify(responseData);
  writeResponse(request, response, 200, responseMessage);
}

const getRecents = (request, response) => {
  const message = "Recent titles requested";

  let recentsArr;

  recentsArr = data.filter(x => x.year >= 1900);

  const responseData = {
    message: message,
    id: "getRecents",
    data: recentsArr,
  }

  const responseMessage = JSON.stringify(responseData);
  writeResponse(request, response, 200, responseMessage);
}

module.exports = {
  notFound, getData, addBook, getTitles, getAuthors, getRecents,
};
