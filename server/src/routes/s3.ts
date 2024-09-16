import express from 'express';
import { NextFunction, Request, Response } from 'express';
import { winstonLogger } from '../controllers/loggerController';

const router = express.Router();
import { listItems, addItems, deleteItems } from '../controllers/s3Controller';

const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { path } = req.query;

      if (!path) {
        return res.status(500).send({
          message: 'Error! Path is required',
        });
      }

      const result = await listItems(path as string);
      return res.status(200).send({
        ...result,
      });
    } catch (err) {
      winstonLogger.error(
        `[S3 controller] Problem listing items: ${JSON.stringify(err)}`
      );
      next(err);
    }
  }
);

router.post(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { path } = req.query;
      if (!path) {
        return res.status(500).send({
          message: 'Error! Path is required',
        });
      }

      // @ts-ignore
      const { filesFromClient } = req.files;

      if (!filesFromClient) {
        return res.status(500).send({
          message: 'Error! No files attached',
        });
      }

      const result = await addItems(filesFromClient, path as string);
      return res.status(200).send(result);
    } catch (err) {
      winstonLogger.error(
        `[S3 controller] Problem adding an item: ${JSON.stringify(err)}`
      );
      next(err);
    }
  }
);

router.delete(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { keys } = req.query;
      if (!keys) {
        return res.status(500).send({
          message: 'Error! Keys are required',
        });
      }

      const result = await deleteItems(keys as string);
      return res.status(200).send(result);
    } catch (err) {
      winstonLogger.error(
        `[S3 controller] Problem deleting item(s): ${JSON.stringify(err)}`
      );
      next(err);
    }
  }
);

module.exports = router;
