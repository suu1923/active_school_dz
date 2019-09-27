const gulp = require('gulp') // gulp插件
const ejs = require('gulp-ejs') //
const clean = require('gulp-clean') // 文件删除
const scss = require('gulp-sass') // sass编译
const cached = require('gulp-cached') // 缓存当前任务中的文件，只让已修改的文件通过管道
const uglify = require('gulp-uglify') // js 压缩
const rename = require('gulp-rename') // 重命名
const concat = require('gulp-concat') // 合并文件
const notify = require('gulp-notify') // 修改提醒
const sourcemaps = require('gulp-sourcemaps') // 资源地图
const cssmin = require('gulp-clean-css') // css 压缩
const cssver = require('gulp-make-css-url-version') // 给css添加版本号
const imagemin = require('gulp-imagemin') // 图片优化
const htmlmin = require('gulp-htmlmin')  //html压缩
const rev = require('gulp-rev-append')  //添加版本号
const browserSync = require('browser-sync')  // 保存自动刷新
const babel = require('gulp-babel') //es6 语法转换
const autoprefixer = require('gulp-autoprefixer')  // 添加 CSS 浏览器前缀
const gulpSequence = require('gulp-sequence')  //任务顺序执行

const config = require('./config')

function getPath(str) {
    return config.path.base + config.path[str]
}

//编译scss--发布到本文件夹下css
gulp.task('scss', function () {
    return gulp.src(
        getPath('scss') + '**/*.scss', {
            base: getPath('scss')
        }
    )
        .pipe(sourcemaps.init())
        // .pipe(cached('scss'))
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer('last 10 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(getPath('css')));
});
//编译scss--发布到本文件夹下pages
gulp.task('ejs', function () {
    return gulp.src([getPath('ejs') + '**/*.{html,ejs}', '!' + getPath('ejs') + '{layer,template}/**/*.*'])
        .pipe(ejs({}, {open: '{{', close: "}}"}, {ext: '.html', open: '{{', close: "}}"}))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(getPath('pages')))
})
// 编译index
gulp.task('ejs-index', function () {
    return gulp.src([config.path.base + '/index.ejs'])
        .pipe(ejs({title: 'gulp-ejs'}, {open: '{{', close: "}}"}, {ext: '.html', open: '{{', close: "}}"}))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(config.path.base))
})
// html处理
gulp.task('html', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(
        [config.path.base + '**/*.html', "!" + getPath('ejs') + '**/*.*']
    )
        .pipe(rev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(config.path.dist));
});
//图片压缩
gulp.task('imgmin', function () {
    return gulp.src(getPath('img') + '**/*.{jpg,jpeg,png,gif}', {base: './src'})
        .pipe(cached('imgmin'))
        // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，
        // 是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })])
        )
        .pipe(gulp.dest(config.path['dist']));
});

//css压缩
gulp.task('cssmin', function () {
    return gulp.src([
        getPath('css') + '**/*.css',
        '!' + getPath('css') + '**/*.min.css',
    ], {base: './src'})
        .pipe(cached('cssmin'))
        .pipe(cssver())
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest(config.path['dist']));
});

//js压缩
gulp.task('jsmin', function () {
    return gulp.src([
        getPath('js') + '**/*.js',
        '!' + getPath('js') + '**/*.min.js'
    ], {base: './src'})
        .pipe(cached('jsmin'))
        .pipe(babel(
            {
                presets: ['env']
            }
        )) //es6 语法转换 es5
        .pipe(uglify({
            ie8: true,
            mangle: {
                toplevel: true,
                // js全局变量 不修改名称
                reserved: ['require', 'exports', 'module', '$', 'jQuery', 'backData']
            },//排除混淆关键字
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest(config.path['dist']));
});
//复制全部文件
gulp.task('copy', function () {
    return gulp.src([
        config.path.base + '**/*.*',
        "!" + getPath('ejs') + '**/*.*',
        "!" + getPath('scss') + '**/*.*',
        '!**/*.{scss,ejs}',
    ]).pipe(gulp.dest(config.path['dist']));
})

//检测文件变化
gulp.task('watch', function () {
    //检测文件变化
    gulp.watch(getPath('scss') + '**/*.scss', ['scss']);
    gulp.watch(getPath('ejs') + '**/*.{html,ejs}', ['ejs', 'ejs-index']);
    gulp.watch(config.path.base + '/index.ejs', ['ejs-index'])
    //检测到文件的任何变化都会重新刷新
    gulp.watch([
        "./src/**/*.*",
        "!" + getPath('scss') + '/**/*.*',
        "!" + getPath('ejs') + '**/*.*',
    ]).on('change', browserSync.reload);

})
//浏览器刷新
gulp.task('bower', function () {
    browserSync.init({
        //指定服务器启动根目录
        server: config.path.base
    });
})

// 清理文件
gulp.task('clean', function () {
    return gulp.src(config.path.dist)
        .pipe(clean())
})
//---------------------- server  tasks-------------------------

gulp.task('default', gulpSequence(['ejs-index', 'ejs', 'scss'], 'watch', 'bower'));
//  编译  gulp build
gulp.task('build', gulpSequence('clean', ['ejs-index', 'ejs', 'scss'], 'copy', ['cssmin', 'jsmin'], 'html'));
gulp.task('mainbuild', gulpSequence('clean', ['ejs-index', 'ejs', 'scss'], 'copy', ['imgmin', 'cssmin', 'jsmin'], 'html'));
