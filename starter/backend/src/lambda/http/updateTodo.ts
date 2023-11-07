import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { getToken } from '../../auth/utils';
import { TodoUpdate } from '../../models/todo';
import { updateTodo } from '../../businessLogic/todo';

const updateTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo: TodoUpdate = JSON.parse(event.body);
  const jwtToken = getToken(event);

  await updateTodo(jwtToken, todoId, updatedTodo);

  return {
    statusCode: 200,
    body: '',
  };
};

export const handler = middy(updateTodoHandler).use(
  cors({ credentials: true }),
);
