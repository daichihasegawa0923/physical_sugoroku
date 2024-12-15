import type { AWS } from '@serverless/typescript';

import game from '@functions/game';
import { TABLE_NAME_SUGOROKU } from 'src/shared/table.name';

const serverlessConfiguration: AWS = {
  service: 'physical-sugoroku-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    stage: 'dev',
    region: 'ap-northeast-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource:
          'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/*',
      },
    ],
  },
  // import the function via paths
  functions: { ...game },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      StupidSugoroku: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: TABLE_NAME_SUGOROKU,
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'subId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'subId',
              KeyType: 'RANGE',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
