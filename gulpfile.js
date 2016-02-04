/**
 * Created by tengfeisu on 2016/1/11.
 */
var gulp = require('gulp'),//基础库
    imagemin = require('gulp-imagemin'),//图片压缩
    pngquant = require('imagemin-pngquant'),//深度压缩png图片
    cache = require('gulp-cache'), //图片缓存，只有图片替换了才压缩
    clean = require('gulp-clean'), //清空文件夹
    jshint = require('gulp-jshint'),//js语法检测
    uglify = require('gulp-uglify'),//js压缩
    rename= require('gulp-rename'),//重命名
    concat = require('gulp-concat'),//文件合并
    htmlmin = require('gulp-htmlmin'),//html文件压缩
    rev = require('gulp-rev-append'),//给页面的引用添加版本号，清除页面引用缓存
    autoprefixer = require('gulp-autoprefixer'),//css自动添加前缀
    cssmin = require('gulp-minify-css'),//css压缩
    less = require('gulp-less'),//less
    notify = require('gulp-notify'),//显示报错信息和报错后不终止当前gulp任务
    plumber = require('gulp-plumber'), //出现异常并不终止watch事件
    livereload = require('gulp-livereload'); //自动刷新
    //sass = require('gulp-ruby-sass'),//sass
    //产出路径
    var destPath = {
        html: 'dest/',
        css: 'dest/css/',
        fonts: 'dest/fonts/',
        images: 'dest/images/',
        js: 'dest/js/',
        music: 'dest/music/'
    };
    //源路径
    var srcPath = {
        html: 'src/*.html',
        css: 'src/less/*.*',
        fonts: 'src/fonts/*.*',
        images: 'src/images/*.*',
        js: 'src/js/*.*',
        music: 'src/music/*.*'
    };
    //单个文件删除
    gulp.task('cleanHtml',function(){
        return gulp.src(destPath.html)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanCss',function(){
        return gulp.src(destPath.css)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanFonts',function(){
        return gulp.src(destPath.fonts)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanImage',function(){
        return gulp.src(destPath.images)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanJs',function(){
        return gulp.src(destPath.js)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanMusic',function(){
        return gulp.src(destPath.music)
            .pipe(clean({force:true}))
    });
    //图片处理
    gulp.task('image',function(){
        return gulp.src(srcPath.images)
            .pipe(cache(imagemin({
                progressive:true,//类型：Boolean 默认：false 无损压缩jpg图片
                svgoPlugins:[{removeViewBox:false}],//不要移除svg的viewbox属性
                use:[pngquant()] //使用pngquant深度压缩png图片的imagemin插件
            })))
            .pipe(gulp.dest(destPath.images))
            .pipe(livereload())
    });
    //脚本处理
    gulp.task('js',function(){
        return gulp.src(srcPath.js)
            .pipe(jshint({'expr':true}))
            .pipe(jshint.reporter('default')) // 对代码进行报错提示
            .pipe(uglify({
                mangle:true, //类型：Boolean 默认：true 是否修改变量名
                compress:true //类型：Boolean 默认：true 是否完全压缩
            }))
            .pipe(concat('main.js')) //合并后的文件名
            .pipe(rename({
                //prefix: 'stf-',
                suffix: '.min'
            }))
            .pipe(gulp.dest(destPath.js))
            .pipe(livereload())
    });
    //HTML处理
    gulp.task('html',function(){
        var options = {
            removeComments: true,//清除HTML注释
            collapseWhitespace: false,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/less"
            minifyJS: false,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        };
        return gulp.src(srcPath.html)
            .pipe(rev()) //给页面的引用添加版本号，清除页面引用缓存。
            .pipe(htmlmin(options))
            .pipe(gulp.dest(destPath.html))
            .pipe(livereload())
    });
    //CSS处理
    gulp.task('css',function(){
        return gulp.src(srcPath.css)
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(less())
            .pipe(autoprefixer({
                browsers:['> 5%','last 2 versions','Android >= 4.0','IOS >=6'],
                cascade:true, //是否美化属性值 默认：true
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(cssmin({
                advanced:false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
                compatibility:'ie8', //类型：String 默认：''or'*' eg: 'ie8'：IE8兼容模式
                keepBreaks:true //类型：Boolean 默认：false [是否保留换行]
            }))
            .pipe(rename({
                suffix:'.min'
            }))
            .pipe(gulp.dest(destPath.css))
            .pipe(livereload())
    });
    //字体处理
    gulp.task('font',function(){
        return gulp.src(srcPath.fonts)
            .pipe(gulp.dest(destPath.fonts))
            .pipe(livereload())
    });
    //音频处理
    gulp.task('music',function(){
        return gulp.src(srcPath.music)
            .pipe(gulp.dest(destPath.music))
            .pipe(livereload())
    });
    //文件统一清理
    gulp.task('cleanAll',function(){
        return gulp.src([destPath.html,destPath.css,destPath.fonts,destPath.images,destPath.js,destPath.music])
            .pipe(clean({force:true}))
    });
    //任务统一编译
    gulp.task('demo',['cleanAll'],function(){
        gulp.start('html','js','css','image','font','music');
    });
    //变动统一监听
    gulp.task('demoWatch',function(){
        livereload.listen();
        //监听HTML
        gulp.watch(srcPath.html,['html']);
        //监听CSS
        gulp.watch(srcPath.css,['css']);
        //监听JS
        gulp.watch(srcPath.js,['js']);
        //监听字体
        gulp.watch(srcPath.fonts,['font']);
        //监听音频
        gulp.watch(srcPath.music,['music']);
        //监听图片
        var img = gulp.watch(srcPath.images,['image']);
        //监听图片删除,删除后重新编译
        img.on('change',function(event){
            if(event.type=='deleted'){
                gulp.start('image');
                console.log(event.type);
            }
        })
    });
