import express from 'express';
import searchController from '../controllers/searchController';
import { NextFunction, Request, Response } from 'express';
import { removeQuotesFromLegacySearchParams } from '../controllers/configController';

const router = express.Router();

router.get(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    if (req.query.getData === 'true' || req.query.rawJSON === 'true') {
      const result = await searchController(req, res);
      if (result) {
        const { status, body } = result;
        return res.status(status).json(body);
      }

      return next('Nothing retrieved from search controller for: ' + req.query);
    }

    const searchResultsPagePath = '/search-results';
    const searchParams = req.originalUrl.split('?')[1];
    if (!searchParams) {
      return res.redirect(searchResultsPagePath);
    }
    const redirectUrl = `${searchResultsPagePath}?${removeQuotesFromLegacySearchParams(
      searchParams
    )}`;
    return res.redirect(redirectUrl);
  }
);

router.get(
  '/availableProducts',
  async function (req: Request, res: Response, next: NextFunction) {}
);

module.exports = router;
