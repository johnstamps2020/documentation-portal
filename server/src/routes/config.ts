import { Router } from 'express';
import {
  getConfig,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
  getDocId,
  getEnv,
  putConfigInDatabase,
} from '../controllers/configController';
import { render } from 'ejs';
import { readFileSync } from 'fs';
import { winstonLogger } from '../controllers/loggerController';

const router = Router();

router.get('/', async function(req, res, next) {
  try {
    const config = await getConfig(req, res);
    res.send(config);
  } catch (err) {
    winstonLogger.error(
      `[SAFE CONFIG] Problem sending config from ${req.url}: ${JSON.stringify(
        err
      )}`
    );
    next(err);
  }
});

router.get('/breadcrumbs', async function(req, res, next) {
  try {
    const pagePathname = req.query.pagePathname as string;
    if (!pagePathname) {
      return res
        .status(500)
        .send('Provide a pagePathname query parameter to get a breadcrumb');
    }

    const rootBreadcrumb = await getRootBreadcrumb(pagePathname.toString());
    return res.send(rootBreadcrumb);
  } catch (err) {
    winstonLogger.error(
      `[SAFE CONFIG] Problem sending breadcrumbs: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

router.get('/versionSelectors', async function(req, res, next) {
  try {
    const docId = req.query.docId as string;
    if (!docId) {
      return res
        .status(500)
        .send('Provide a docID query parameter to get a version selector');
    }

    const allVersions = await getVersionSelector(docId.toString(), req, res);
    return res.send(allVersions);
  } catch (err) {
    winstonLogger.error(`[SAFE CONFIG] Problem sending version selectors
      ERROR: ${JSON.stringify(err)}
      REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

router.get('/docMetadata/:docId', async function(req, res, next) {
  try {
    const docId = req.params.docId;
    if (!docId) {
      return res.status(500).send('Provide a docId param to get doc metadata');
    }
    const docMetadata = await getDocumentMetadata(docId, req, res);
    return res.send(docMetadata);
  } catch (err) {
    winstonLogger.error(`[SAFE CONFIG]: Problem sending doc metadata
      ERROR: ${JSON.stringify(err)}
      DOC ID: ${req.params?.docId}`);
    next(err);
  }
});

type MetadataReq = {
  query: {
    products: string;
    platforms: string;
    versions: string;
    title: string;
    url: string;
  };
};

router.get('/docId', async function(req: MetadataReq, res, next) {
  try {
    const { platforms, products, versions, title, url } = req.query;
    const docId = await getDocId(products, platforms, versions, title, url);
    res.send(docId);
  } catch (err) {
    winstonLogger.error(`[SAFE CONFIG] Problem sending doc ID
    ERROR: ${JSON.stringify(err)}
    QUERY: ${req.query}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

router.get('/env', function(req, res) {
  const env = getEnv();
  res.send(env);
});

router.get('/putConfigInDatabase', async function(req, res, next) {
  try {
    const result = await putConfigInDatabase();
    if (result.length === 0) {
      return res
        .status(500)
        .send('Could not put the config into the database, unknown error');
    } else {
      return res.send(result);
    }
  } catch (err) {
    winstonLogger.error(
      `[SAFE CONFIG] Could not put the config into the database: ${JSON.stringify(
        err
      )}
      REQ: ${JSON.stringify(req)}`
    );
    next(err);
  }
});

module.exports = router;
