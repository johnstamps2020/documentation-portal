const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {
    return new Promise((resolve, reject) => {
        nodemon({
            script: 'app.js',
            ext: 'js',
            env: {
                PORT: 8081
            },
            ignore: ['./node_modules/**']
        })
            .on('restart', () => {
                console.log('Restarting');
            })
            .on('error', console.error.bind(console));
        resolve();
    });

});