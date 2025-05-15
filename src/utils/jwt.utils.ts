import { Request } from 'express';

// [공백이 아닌 문자열] [공백] [공백이 아닌 문자열]
const regex = /(\S+)\s+(\S+)/;

export const extractJwt = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader == null) return null;

  const matches = authHeader.match(regex);
  if (matches == null) return null;

  if (matches[1].toLowerCase() !== 'bearer') return null;

  return matches[2];
};