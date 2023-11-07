import { decode } from 'jsonwebtoken';
import { createLogger } from '../utils/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';

const logger = createLogger('utils');
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken);
  logger.info('parse user Id', {UserId: decodedJwt.sub})
  return decodedJwt.sub as string;
}

export function getUserId(jwtToken): string {
  return parseUserId(jwtToken);
}

export function getToken(event: APIGatewayProxyEvent) {
  const authorization = event.headers.authorization;
  logger.info('Get token from headers', {...event.headers});

  const split = authorization.split(' ');
  const jwtToken = split[1];
  logger.info('Get token successfully');
  return jwtToken;
}
