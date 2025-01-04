import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';
import { formatJSONResponse } from '@libs/api-gateway';

import { APIGatewayProxyEvent } from 'aws-lambda';
import resolve from './event.resolver';

export const connect = async (_event: APIGatewayProxyEvent) => {
  return formatJSONResponse({});
};

export const onConnect = async (event: APIGatewayProxyEvent) => {
  try {
    const { body } = event;
    const resolved = await resolve(body, event.requestContext.connectionId);
    if (typeof resolved.pushTarget === 'string') {
      await endPoint(event).postToConnection({
        Data: JSON.stringify(resolved),
        ConnectionId: resolved.pushTarget,
      });
    } else {
      await Promise.all(
        resolved.pushTarget.map(async (targetId) => {
          await endPoint(event).postToConnection({
            Data: JSON.stringify(resolved),
            ConnectionId: targetId,
          });
        })
      );
    }
    return formatJSONResponse({});
  } catch (error) {
    console.error('error has occurred: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString(),
      }),
    };
  }
};

const endPoint = (event: APIGatewayProxyEvent) => {
  return new ApiGatewayManagementApi({
    // The key apiVersion is no longer supported in v3, and can be removed.
    // @deprecated The client uses the "latest" apiVersion.
    apiVersion: '2018-11-29',

    endpoint: process.env.IS_OFFLINE
      ? 'http://localhost:3001'
      : `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  });
};
