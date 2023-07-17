const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
import { NextFunction, Request, Response } from 'express';
const {
  removeQuotesFromLegacySearchParams,
} = require('../controllers/configController');

router.get(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    if (req.query.getData === 'true' || req.query.rawJSON === 'true') {
      const { status, body } = await searchController(req, res, next);
      return res.status(status).json(body);
    }

    const redirectUrl =
      '/search-results?' +
      removeQuotesFromLegacySearchParams(req.originalUrl.split('?')[1]);

    res.redirect(redirectUrl);
  }
);

module.exports = router;
