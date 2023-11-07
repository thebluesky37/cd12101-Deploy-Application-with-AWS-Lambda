import 'source-map-support/register'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todo';
import { getToken } from '../../auth/utils';


const deleteTodoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing deleteTodoHandler event: ', event)
  const todoId = event.pathParameters.todoId
  const jwtToken = getToken(event)
  await deleteTodo(jwtToken, todoId);

  return {
    statusCode: 204,
    body: ''
  };
}

export const handler = middy(deleteTodoHandler).use(cors({ credentials: true }));