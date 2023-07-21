import express from 'express';
import searchController from '../controllers/searchController';
import { NextFunction, Request, Response } from 'express';
import { removeQuotesFromLegacySearchParams } from '../controllers/configController';

const router = express.Router();

router.get(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    if (req.query.getData === 'true' || req.query.rawJSON === 'true') {
      const result = await searchController(req, res, next);
      if (result) {
        const { status, body } = result;
        return res.status(status).json(body);
      }

      return next('Nothing retrieved from search controller for: ' + req.query);
    }

    const redirectUrl =
      '/search-results?' +
      removeQuotesFromLegacySearchParams(req.originalUrl.split('?')[1]);

    res.redirect(redirectUrl);
  }
);

module.exports = router;
