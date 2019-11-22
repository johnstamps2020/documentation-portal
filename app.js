require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    region: 'us-west-2',
});

const sourceBucket = 'tenant-doctools-dev-builds';
const docRootOnBucket = 'compressed-webhelp';

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const port = process.env.PORT || 8081;

const app = express();

// session support is required to use ExpressOIDC
app.use(
    session({
        secret: `${process.env.SESSION_KEY}`,
        resave: true,
        saveUninitialized: false,
    })
);

const oidc = new ExpressOIDC({
    issuer: `${process.env.OKTA_DOMAIN}`,
    client_id: `${process.env.OKTA_CLIENT_ID}`,
    client_secret: `${process.env.OKTA_CLIENT_SECRET}`,
    appBaseUrl: `${process.env.APP_BASE_URL}`,
    scope: 'openid profile',
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);
app.use(oidc.ensureAuthenticated());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: true, // true = .sass and false = .scss
        sourceMap: true,
    })
);
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/:docKey', (req, res, next) => {
    const docKey = req.params.docKey;
    console.log(`Fetching ${docKey} from AWS`);
    const fileStream = s3
        .getObject({
            Bucket: sourceBucket,
            Key: `${docRootOnBucket}/${docKey}`,
        })
        .createReadStream();

    fileStream.on('error', (err) => {
        console.error(err);
    });

    fileStream
        .pipe(res)
        .on('error', (err) => {
            console.error('File Stream:', err);
        })
        .on('close', () => {
            console.log('Done.');
        });

    // .then((result) => {
    //   result.pipe(res);
    // }).catch((err) => {
    //   console.log(err);
    // });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log('Running on PORT: ' + port);
});

module.exports = app;
