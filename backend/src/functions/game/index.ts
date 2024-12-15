import { handlerPath } from '@libs/handler-resolver';

export default {
  connect: {
    handler: `${handlerPath(__dirname)}/handler.connect`,
    events: [
      {
        websocket: '$connect',
      },
    ],
  },
  onConnect: {
    handler: `${handlerPath(__dirname)}/handler.onConnect`,
    events: [
      {
        websocket: '$default',
      },
    ],
  },
};
