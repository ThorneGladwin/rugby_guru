const { DynamoDbPersistenceAdapter } = require("ask-sdk-dynamodb-persistence-adapter");

const dynamoDb = new DynamoDbPersistenceAdapter({
  tableName: "rugby-guru",
  createTable: true
});

module.exports = {
  dynamoDb
};
