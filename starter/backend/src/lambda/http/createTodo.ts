import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createTodo } from '../../businessLogic/todo';
import { TodoCreate } from '../../models/todo';
import { getToken } from '../../auth/utils';

const createTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);
  const jwtToken = getToken(event);

  const newTodo: TodoCreate = JSON.parse(event.body);
  const item = await createTodo(jwtToken, newTodo);
  console.log(item);
  return {
    statusCode: 200,
    body: JSON.stringify({
      item: item,
    }),
  };
};

export const handler = middy(createTodoHandler).use(
  cors({ credentials: true }),
);
