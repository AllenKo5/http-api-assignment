// helper functions
const createXml = (responseMessage) => {
  let xmlString = '<response>';
  xmlString += `<message>${responseMessage.message}</message>`;
  if (responseMessage.id) {
    xmlString += `<id>${responseMessage.id}</id>`;
  }
  xmlString += '</response>';

  return xmlString;
};

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  if (type === 'application/json') {
    response.write(JSON.stringify(content));
  } else if (type === 'text/xml') {
    response.write(createXml(content));
  }
  response.end();
};

// handler functions
const success = (request, response, type) => {
  const responseMessage = {
    message: 'This is a successful response.',
  };

  return respond(request, response, 200, responseMessage, type);
};

const badRequest = (request, response, type, params) => {
  const responseMessage = {
    message: 'This request has the required parameters.',
  };

  if (!params.valid || params.valid !== 'true') {
    responseMessage.message = 'Missing valid query parameter set to true.';
    responseMessage.id = 'badRequest';

    return respond(request, response, 400, responseMessage, type);
  }
  return respond(request, response, 200, responseMessage, type);
};

const unauthorized = (request, response, type, params) => {
  const responseMessage = {
    message: 'You have successfully viewed the content.',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseMessage.message = 'Missing loggedIn query parameter set to yes.';
    responseMessage.id = 'unauthorized';

    return respond(request, response, 401, responseMessage, type);
  }
  return respond(request, response, 200, responseMessage, type);
};

const forbidden = (request, response, type) => {
  const responseMessage = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  return respond(request, response, 403, responseMessage, type);
};

const internal = (request, response, type) => {
  const responseMessage = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  return respond(request, response, 500, responseMessage, type);
};

const notImplemented = (request, response, type) => {
  const responseMessage = {
    message: 'A get request for this  page has not been implemented yet. Check again for updated content.',
    id: 'notImplemented',
  };

  return respond(request, response, 501, responseMessage, type);
};

const notFound = (request, response, type) => {
  const responseMessage = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(request, response, 404, responseMessage, type);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
