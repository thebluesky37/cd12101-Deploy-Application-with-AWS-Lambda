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

// Import AWS X-Ray
import * as AWSXRay from 'aws-xray-sdk';
AWSXRay.captureAWS(require('aws-sdk'));

const createTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Create an X-Ray segment
  const segment = AWSXRay.getSegment();
  const subsegment = segment.addNewSubsegment('createTodoHandler');
  subsegment.addAnnotation('HTTPMethod', "POST");
  console.log('Processing event: ', event);

  try {
    const jwtToken = getToken(event);
    const newTodo: TodoCreate = JSON.parse(event.body);
    if (!newTodo.name || newTodo.name.trim() === '') {
      throw new Error('Todo name cannot be empty.');
    }
    const item = await createTodo(jwtToken, newTodo);
    console.log(item);

    // Close the X-Ray subsegment
    subsegment.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: item,
      }),
    };
  } catch (error) {
    // Add error to X-Ray subsegment
    subsegment.addError(error);
    // Close the X-Ray subsegment
    subsegment.close();
    throw error;
  }
};

export const handler = middy(createTodoHandler).use(cors({ credentials: true }));
