import { NextFunction, Request, Response } from 'express';
import { getRedirectUrl } from '../controllers/redirectController';

export async function redirect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pathNameWithoutSlash = req.path.replace(/^\//, '');
  const redirectUrlResponse = await getRedirectUrl(res, pathNameWithoutSlash);
  const { status, body } = redirectUrlResponse;
  if (status === 200) {
    return res.redirect(body.redirectStatusCode, body.redirectUrl);
  }
  return next();
}
