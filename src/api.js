const fs = require('fs');
// const users = {};

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

const testRequest = (request, response) => {
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

  if (!users[title]) {
    statusCode = 201;
    users[title] = { title };
  }
  users[title].author = author;

  if (statusCode === 201) {
    const obj = {
      message: 'Created Successfully',
    };
    writeResponse(request, response, statusCode, obj);
    return;
  }
  writeResponse(request, response, statusCode, {});
}

// const addUser = (request, response) => {
//   const message = 'User added';
//   console.log(message);

//   const responseData = {
//     message,
//     id: 'addUser',
//     users,
//   };

//   const { name, age } = request.body;

//   if (!name || !age) {
//     const obj = {
//       message: 'Both fields are required',
//       id: 'missingData',
//     };
//     writeResponse(request, response, 400, obj);
//     return;
//   }
//   let statusCode = 204;

//   if (!users[name]) {
//     statusCode = 201;
//     users[name] = { name };
//   }
//   users[name].age = age;

//   if (statusCode === 201) {
//     const obj = {
//       message: 'Created Successfully',
//     };
//     writeResponse(request, response, statusCode, obj);
//     return;
//   }
//   writeResponse(request, response, statusCode, {});
// };

module.exports = {
  notFound, testRequest, addBook,
};
