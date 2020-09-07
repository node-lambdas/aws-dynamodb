import { lambda } from '@node-lambdas/core';

const configutation = {
  version: 2,
  actions: {
    echo: {
      default: true,
      handler: (input, output) => input.pipe(output),
    }
  }
};

lambda(configutation);
