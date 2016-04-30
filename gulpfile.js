var gulp = require('gulp');
var eslint = require('gulp-eslint');

var FILES = [
  'app/*.js',
  'app/**/*.js',
  '*.js'
];
var options = {
  rulePaths: ['.eslint_rules']
};

gulp.task('eslint', function () {
  return gulp.src(FILES)
    .pipe(eslint(options))
    .pipe(eslint.format());
});
