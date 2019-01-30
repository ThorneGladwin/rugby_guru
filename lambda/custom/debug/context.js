module.exports = function Context() {
  return {
    succeed: result => {
      console.log(result);
    },
    fail: err => {
      console.error(err);
    },
    done: () => {},
    functionName: "local_functionName",
    awsRequestId: "local_awsRequestId",
    logGroupName: "local_logGroupName",
    logStreamName: "local_logStreamName",
    clientContext: "local_clientContext",
    identity: {
      cognitoIdentityId: "local_cognitoIdentityId"
    }
  };
};
