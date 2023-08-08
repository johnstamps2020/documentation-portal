import { NextFunction, Request, Response } from 'express';
import { getRedirectUrl } from '../controllers/redirectController';
import { RedirectResponse } from '../types/apiResponse';

export async function redirect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const redirectUrlResponse = await getRedirectUrl(res, req.path);
  const { status, body } = redirectUrlResponse;
  if (status === 200) {
    const { redirectStatusCode, redirectUrl } = body;
    if (redirectUrl) {
      return res.redirect(redirectStatusCode, redirectUrl);
    }
  }
  return next();
}
