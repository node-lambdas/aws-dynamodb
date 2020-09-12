import { Format, lambda } from '@node-lambdas/core';
import aws from 'aws-sdk';

function getDynamo(input) {
  const accessKeyId = input.credentials['access-key-id'];
  const secretAccessKey = input.credentials['access-key-secret'];
  const region = input.credentials['region'];

  return new aws.DynamoDB({
    region,
    credentials: new aws.Credentials(accessKeyId, secretAccessKey),
  });
}

function executeAction(action, input, output, statusCode) {
  getDynamo(input)[action](input.body, (error, data) => {
    if (error) {
      return output.reject(error);
    }

    output.send(statusCode, data);
  });
}

const credentials = ['access-key-id', 'access-key-secret', 'region'];

lambda({
  version: 2,
  actions: {
    delete: {
      credentials,
      input: Format.Json,
      output: Format.Json,
      handler: (input, output) => executeAction('deleteItem', input, output, 202),
    },
    get: {
      default: true,
      credentials,
      input: Format.Json,
      output: Format.Json,
      handler: (input, output) => executeAction('scan', input, output, 200),
    },
    create: {
      credentials,
      input: Format.Json,
      output: Format.Json,
      handler: (input, output) => executeAction('putItem', input, output, 201),
    },
    update: {
      credentials,
      input: Format.Json,
      output: Format.Json,
      handler: (input, output) => executeAction('updateItem', input, output, 200),
    },
  },
});
