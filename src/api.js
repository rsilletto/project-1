const fs = require('fs');
const users = {};

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
    }

    //response.writeHead(200, { 'Content-Type': 'application/json' });

    const responseMessage = JSON.stringify(responseData);
    writeResponse(request, response, 200, responseMessage);
}

const getUsers = (request, response) => {
  const responseData = {
    users,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, { 'Content-Type': 'application/json' });

  if (request.method !== 'HEAD') {
    response.write(responseMessage);
  }
  response.end();
};

const notFound = (request, response) => {
  let message = '';

  const responseData = {
    message,
    id: 'notFound',
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, { 'Content-Type': 'application/json' });

  if (request.method === 'GET') {
    message = 'The page you are looking for was not found.';
    response.write(responseMessage);
  }
};

const addUser = (request, response) => {
  const message = 'User added';
  console.log(message);

  const responseData = {
    message,
    id: 'addUser',
    users,
  };

  const { name, age } = request.body;

  if (!name || !age) {
    const obj = {
      message: 'Both fields are required',
      id: 'missingData',
    };
    writeResponse(request, response, 400, obj);
    return;
  }
  let statusCode = 204;

  if (!users[name]) {
    statusCode = 201;
    users[name] = { name };
  }
  users[name].age = age;

  if (statusCode === 201) {
    const obj = {
      message: 'Created Successfully',
    };
    writeResponse(request, response, statusCode, obj);
    return;
  }
  writeResponse(request, response, statusCode, {});
};

module.exports = {
  getUsers, notFound, addUser, testRequest,
};
