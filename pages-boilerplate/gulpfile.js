// 实现这个项目的构建任务
const gulp = require('gulp')

gulp.task('img', function() {
  return gulp.src('assets/images/**')
})