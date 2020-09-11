import { lambda, Format } from '@node-lambdas/core';
import aws from 'aws-sdk';

function getDynamo(input) {
  const accessKeyId = input.credentials['access-key-id'];
  const secretAccessKey = input.credentials['access-key-secret'];
  return new aws.DynamoDB({ credentials: { accessKeyId, secretAccessKey } });
}

const credentials = ['access-key-id', 'access-key-secret'];
const configutation = {
  version: 2,
  actions: {
    delete: {
      credentials,
      input: Format.Json,
      handler: (input, output) => {
        const dynamo = getDynamo(input);
        dynamo.deleteItem(input.body, () => output.send(202));
      },
    },
    get: {
      default: true,
      credentials,
      input: Format.Json,
      handler: (input, output) => {
        const dynamo = getDynamo(input);
        dynamo.scan(input.body, (data) => output.send(200, data));
      },
    },
    create: {
      credentials,
      input: Format.Json,
      handler: (input, output) => {
        const dynamo = getDynamo(input);
        dynamo.putItem(input.body, () => output.send(201));
      },
    },
    update: {
      credentials,
      input: Format.Json,
      handler: (input, output) => {
        const dynamo = getDynamo(input);
        dynamo.updateItem(input.body, () => output.send(200));
      },
    },
  },
};

lambda(configutation);
