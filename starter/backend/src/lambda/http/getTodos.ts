import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { getTodos } from '../../businessLogic/todo';
import { getToken } from '../../auth/utils';

const getTodosHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);
  const jwtToken = getToken(event);
  const todos = await getTodos(jwtToken);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      items: todos,
    }),
  };
};

export const handler = middy(getTodosHandler).use(cors({ credentials: true }));
