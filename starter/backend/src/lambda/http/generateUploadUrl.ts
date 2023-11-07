import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { generateUploadUrl } from '../../businessLogic/todo';
import { getToken } from '../../auth/utils';
import middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('GenerateUploadUrl');

export const generateUploadUrlHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GenerateUploadUrl event...', event);
  const jwtToken: string = getToken(event);
  const todoId = event.pathParameters.todoId;

  try {
    const signedUrl: string = await generateUploadUrl(jwtToken, todoId);
    logger.info('Successfully created signed url.');
    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl: signedUrl }),
    };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

export const handler = middy(generateUploadUrlHandler).use(
  cors({ credentials: true }),
);
