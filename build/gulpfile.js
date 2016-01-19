
var gulp = require('gulp');
var path = require('path');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

var config = {
    dist:'../client'
    , vendor : [
        , "./scripts/angular/angular.min.js"
        , "./scripts/angular/angular-animate.min.js"
        , "./scripts/angular/angular-aria.min.js"
        , "./scripts/angular/angular-sanitize.min.js"
        , "./scripts/angular-material-0.11.4.min.js"
        , "./scripts/angular-material-icons.min.js"
        , "./scripts/angular-cache.min.js"
        , "./scripts/angular-ui-router.js"
        , "./scripts/ng-file-upload.js"  
        , "./scripts/underscore-min.js"
    ]
    ,directives:[
        , "./scripts/ngStorage.min.js"
        , "./scripts/ez-directives/ezTree.directive.js"
        , "./scripts/ez-directives/ezImageUpload.directive.js"
        , "./scripts/ez-directives/ezInitials.directive.js"
    ]
    , app : [
        , "./app/cp.js"
        , "./app/storage.service.js"
        , "./app/data.service.js"
        , "./app/auth.service.js"
        , "./app/httpInterceptor.js"
        , "./app/config.js"
        , "./app/main.controller.js"
        , "./app/home.controller.js"
        , "./app/init.controller.js"
        , "./app/intro.controller.js"
        , "./app/account/login.controller.js"
        , "./app/account/register.controller.js"
        , "./app/account/resendpin.controller.js"
        , "./app/userSelector.controller.js"
        , "./app/index.controller.js"
        , "./app/assets/dashboard.controller.js"  
        , "./app/groups/groups.controller.js"
        , "./app/groups/addEditGroup.controller.js"
        , "./app/groups/groupDetail.controller.js"
    ]
    , css : [
        , "./content/angular.material-1.0.0.min.css"
        , "./content/robotodraft.css"
        , "./content/icon.css"
        , "./content/eztree.css"
        , "./content/style.css"
    ]
    ,dependencies: []
}

gulp.task('clean', function () {
	return gulp.src(config.dist)
		.pipe(clean({force: true}))

});
gulp.task('vendor', function () {
	return gulp.src(config.vendor)
        .pipe(concat(path.join(config.dist + 'all.js')))
		.pipe(gulp.dest('dist'));
});

gulp.task('directives', function () {
	return gulp.src(config.directives)
        .pipe(concat(path.join(config.dist + 'directives.js')))
		.pipe(gulp.dest('dist'));
});

gulp.task('app', function () {
	return gulp.src(config.app)
        .pipe(concat(path.join(config.dist + 'app.js')))
		.pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
	return gulp.src(config.app)
        .pipe(concat(path.join(config.dist + 'styles.css')))
		.pipe(gulp.dest('dist'));
});

gulp.task('dependencies', function () {
	return gulp.src(config.dependencies)
          
		.pipe(gulp.dest('dist'));
});

gulp.task('default',['clean','vendor','directives','app','dependencies'], function () {
	return gulp.src('app/tmp/index.js')
		.pipe(gulp.dest('dist'));
});