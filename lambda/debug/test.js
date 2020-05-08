const mockEvent = require("./intentRequest.json");
const lambda = require("../index.js");
const Context = require("./context.js");
const mockContext = new Context();

function callback(error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

lambda.handler(mockEvent, mockContext, callback);