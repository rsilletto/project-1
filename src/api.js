const fs = require('fs');

const data = JSON.parse(fs.readFileSync(`${__dirname}/books.json`));
//console.log(data.filter(x => x.country === 'Italy'));

const writeResponse = (request, response, statusCode, data) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });

  if (request.method !== 'HEAD' && statusCode !== 204) {
    const responseJson = JSON.stringify(data);
    response.write(responseJson);
  }

  response.end();
};

const testRequest = (request, response) => { // get Books
    const message = "Test";

    const responseData = {
        message: message,
        id: 'test',
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

module.exports = {
  notFound, testRequest, addBook,
};
