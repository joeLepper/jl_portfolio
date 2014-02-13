var gulp     = require('gulp')
  , jshint   = require('gulp-jshint')
  , csslint  = require('gulp-csslint')
  , sass     = require('gulp-sass')
  , gconcat  = require('gulp-concat')
  , uglify   = require('gulp-uglify')
  , rename   = require('gulp-rename')
  , ngmin    = require('gulp-ngmin')
  , gzip     = require('gulp-gzip')
  , jade     = require('gulp-jade')
  , refresh  = require('gulp-livereload')
  , opener     = require('gulp-open')
  , lr       = require('tiny-lr')
  , html2js  = require('gulp-ng-html2js')
  , stylish  = require('jshint-stylish')
  , htmlmin  = require('gulp-minify-html')
  , flatten  = require('gulp-flatten')
  , plumber  = require('gulp-plumber')
  , spawn    = require('child_process').spawn
  , lrServer = lr()
  , node

  // ------------------------- //
  // ---- location arrays ---- //
  // ------------------------- //

  , jsLocations     = ['src/js/index.js', 'src/js/**/*.js', 'src/js/directives/**/js/*.js']
  , cssLocations    = ['public/css/*.css']
  , sassLocations   = ['src/sass/*.scss', 'src/sass/**/*.scss']
  , jadeLocations   = ['src/js/directives/**/jade/*.jade', 'src/jade/views/*.jade']
  , indexLocation   = ['src/jade/index.jade']
  , viewLocations   = ['src/html/*.html']
  , serverLocations = ['index.js', 'server/*.js'];

// -------------------------- //
// ---- individual tasks ---- //
// -------------------------- //

gulp.task('jsLint', function(){
  gulp.src(jsLocations)
    .pipe(plumber())
    .pipe(jshint({laxcomma:true}))
    .pipe(jshint.reporter(stylish));
});

gulp.task('karma', function(){
  spawn('karma',
    ['start', 'karma.config.js']/* ,
    { stdio : 'inherit' } */);
});

gulp.task('cssLint', function(){
  gulp.src(cssLocations)
    .pipe(plumber())
    .pipe(csslint())
    .pipe(csslint.reporter());
});

gulp.task('sass', function(){
  gulp.src(sassLocations)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(refresh(lrServer));
});

gulp.task('build', function(){
  gulp.src(jsLocations)
    .pipe(plumber())
    .pipe(gconcat('app.js'))
    .pipe(ngmin())
    .pipe(rename({suffix: '.noted'}))
    .pipe(gulp.dest('./public/js'))
    .pipe(uglify())
    .pipe(rename(function(dir,base,ext){
      var trunc = base.split('.')[0];
      return trunc + '.min' + ext;
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(gzip())
    .pipe(gulp.dest('public/js'))
    .pipe(refresh(lrServer));
});

gulp.task('jade', function(){
  gulp.src(jadeLocations)
    .pipe(plumber())
    .pipe(jade({ pretty : true }))
    .pipe(rename(function(dir,base,ext){
      var result = base + ext;
      console.log(dir);
      console.log(result);
      return result;
    }))
    .pipe(flatten())
    .pipe(gulp.dest('./src/html'));
});

gulp.task('index', function(){
  gulp.src(indexLocation)
    .pipe(plumber())
    .pipe(jade({ pretty : true }))
    .pipe(gulp.dest('public'));
});

gulp.task('cacheTemplates', function(){
  gulp.src(viewLocations)
    .pipe(plumber())
    .pipe(html2js({
      moduleName : 'templates',
      prefix     : 'templates/'
    }))
    .pipe(gulp.dest('src/js/templates'));
});

gulp.task('stepSync', function(){
  gulp.src('stepSync/js/*.js')
    .pipe(gulp.dest('public/js'));
  gulp.src('stepSync/css/*.css')
    .pipe(gulp.dest('public/css'));
  gulp.src('stepSync/audio/*.wav')
    .pipe(gulp.dest('public/audio'));
  gulp.src('stepSync/index.html')
    .pipe(rename('step_sync.html'))
    .pipe(gulp.dest('public'));
});

gulp.task('server', function() {
  if (node){
    node.kill();
    console.log('[server] Restarting the server...');
  }
  else {
    console.log('[server] Starting the server...');
  }
  console.log('Restarting');
  node = spawn('node', ['index.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('open', function(){
  var options = {
      url: 'http://localhost:8888'
    };
    // a source file MUST be named for gulp to not ignore a task
    gulp.src('./public/index.html')
      .pipe(opener('', options));
});

// -------------------------- //
// ---- watch statements ---- //
// -------------------------- //


gulp.task('default', function(){
  gulp.run( 'karma'
          , 'jsLint'
          , 'sass'
          , 'cssLint'
          , 'jade'
          , 'index'
          , 'build'
          , 'server'
          , 'open');

  gulp.watch(jsLocations, function(){
    gulp.run('jsLint', 'build');
  });

  gulp.watch(cssLocations, function(){
    gulp.run('cssLint');
  });

  gulp.watch(sassLocations, function(){
    gulp.run('sass');
  });

  gulp.watch(jadeLocations, function(){
    gulp.run('jade');
  });

  gulp.watch(indexLocation, function(){
    gulp.run('index');
  });

  gulp.watch(viewLocations, function(){
    gulp.run('cacheTemplates');
  });

  gulp.watch(serverLocations, function(){
    gulp.run('server');
  });

  lrServer.listen(35729, function (err) {
    if (err) return console.log(err);
  });
});