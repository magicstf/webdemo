/**
 * Created by tengfeisu on 2016/1/11.
 */
    import gulp from 'gulp';//基础库
    import imagemin from 'gulp-imagemin'; //图片压缩
    import pngquant from 'imagemin-pngquant';//深度压缩png图片
    import cache from 'gulp-cache'; //图片缓存，只有图片替换了才压缩
    import clean from 'gulp-clean'; //清空文件夹
    import jshint from 'gulp-jshint';//js语法检测
    import uglify from 'gulp-uglify';//js压缩
    import rename from 'gulp-rename';//重命名
    import concat from 'gulp-concat';//文件合并
    import htmlmin from 'gulp-htmlmin';//html文件压缩
    import autoprefixer from 'gulp-autoprefixer';//css自动添加前缀
    import cssmin from 'gulp-minify-css';//css压缩
    import less from 'gulp-less';//less
    import notify from 'gulp-notify';//显示报错信息和报错后不终止当前gulp任务
    import plumber from 'gulp-plumber'; //出现异常并不终止watch事件
    import rev from 'gulp-rev'; // 为文件添加MD5码
    import revCollector from 'gulp-rev-collector'; // 将文件替换为MD5版本的文件
    import processhtml from 'gulp-processhtml';
    import livereload from 'gulp-livereload'; //自动刷新
    import babel from 'gulp-babel';
    //import sass from 'gulp-ruby-sass';//sass
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
    gulp.task('cleanHtml',() => {
        return gulp.src(destPath.html)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanCss',() => {
        return gulp.src(destPath.css)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanFonts',() => {
        return gulp.src(destPath.fonts)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanImage',() => {
        return gulp.src(destPath.images)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanJs',() => {
        return gulp.src(destPath.js)
            .pipe(clean({force:true}))
    });
    gulp.task('cleanMusic',() => {
        return gulp.src(destPath.music)
            .pipe(clean({force:true}))
    });
    //图片处理
    gulp.task('image',['cleanImage'],() => {
        return gulp.src(srcPath.images)
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(cache(imagemin({
                progressive:true,//类型：Boolean 默认：false 无损压缩jpg图片
                svgoPlugins:[{removeViewBox:false}],//不要移除svg的viewbox属性
                use:[pngquant()] //使用pngquant深度压缩png图片的imagemin插件
            })))
            .pipe(gulp.dest(destPath.images))
            .pipe(livereload())
    });
    //线上脚本处理
    gulp.task('jsProd',['cleanJs'],() => {
        return gulp.src(srcPath.js)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(jshint({'expr':true}))
            .pipe(jshint.reporter('default')) // 对代码进行报错提示
            .pipe(uglify({
                mangle:false, //类型：Boolean 默认：true 是否修改变量名
                compress:false //类型：Boolean 默认：true 是否完全压缩
            }))
            .pipe(concat('main.js')) //合并后的文件名
            .pipe(rename({
                //prefix: 'stf-',
                suffix: '.min'
            }))
            .pipe(rev()) //生成MD5版本文件
            .pipe(gulp.dest(destPath.js))
            .pipe(rev.manifest('manifest-js.json',{merge:true})) // 生成原文件与MD5版本文件的映射文件
            .pipe(gulp.dest(destPath.html+'rev/')) //将生成的映射文件添加到rev文件夹下
            .pipe(livereload())
    });
    //开发脚本处理
    gulp.task('jsDev',['cleanJs'],() => {
        return gulp.src(srcPath.js)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(jshint({'expr':true}))
            .pipe(jshint.reporter('default')) // 对代码进行报错提示
            .pipe(rev())
            .pipe(gulp.dest(destPath.js))
            .pipe(rev.manifest('manifest-js.json',{merge:true}))
            .pipe(gulp.dest(destPath.html+'rev/'))
            .pipe(livereload())
    });
    //线上HTML处理
    gulp.task('htmlProd',['cleanHtml'],() => {
        var options = {
            removeComments: false,//清除HTML注释
            collapseWhitespace: false,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/less"
            minifyJS: false,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        };
        return gulp.src(srcPath.html)
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(processhtml())
            .pipe(htmlmin(options))
            .pipe(gulp.dest(destPath.html))
            .pipe(livereload())
    });
    //开发HTML处理
    gulp.task('htmlDev',['cleanHtml'],() => {
        var options = {
            removeComments: false,//清除HTML注释
            collapseWhitespace: false,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/less"
            minifyJS: false,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        };
        return gulp.src(srcPath.html)
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(htmlmin(options))
            .pipe(gulp.dest(destPath.html))
            .pipe(livereload())
    });
    //线上CSS处理
    gulp.task('cssProd',['cleanCss'],() => {
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
            .pipe(concat('main.css')) //合并后的文件名
            .pipe(rename({
                suffix:'.min'
            }))
            .pipe(rev())
            .pipe(gulp.dest(destPath.css))
            .pipe(rev.manifest('manifest-css.json',{merge:true}))
            .pipe(gulp.dest(destPath.html+'rev/'))
            .pipe(livereload())
    });
    //开发CSS处理
    gulp.task('cssDev',['cleanCss'],() => {
        return gulp.src(srcPath.css)
            .pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))
            .pipe(less())
            .pipe(autoprefixer({
                browsers:['> 5%','last 2 versions','Android >= 4.0','IOS >=6'],
                cascade:true, //是否美化属性值 默认：true
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(rev())
            .pipe(gulp.dest(destPath.css))
            .pipe(rev.manifest('manifest-css.json',{merge:true}))
            .pipe(gulp.dest(destPath.html+'rev/'))
            .pipe(livereload())
    });
    //字体处理
    gulp.task('font',['cleanFonts'],() => {
        return gulp.src(srcPath.fonts)
            .pipe(gulp.dest(destPath.fonts))
            .pipe(livereload())
    });
    //音频处理
    gulp.task('music',['cleanMusic'],() => {
        return gulp.src(srcPath.music)
            .pipe(gulp.dest(destPath.music))
            .pipe(livereload())
    });
    //将html中引入的js,css文件替换为MD5版本的文件(线上)
    gulp.task('revHTMLProd',['jsProd','cssProd'],() => {
        return gulp.src([destPath.html+'rev/*.json',destPath.html+'*.html'])
            .pipe(revCollector()) // 将HTML中不带MD5码的文件按照rev生成的映射关系替换为MD5版本的文件
            .pipe(gulp.dest(destPath.html))
    })
    //将html中引入的js,css文件替换为MD5版本的文件(开发)
    gulp.task('revHTMLDev',['jsDev','cssDev'],() => {
        return gulp.src([destPath.html+'rev/*.json',destPath.html+'*.html'])
            .pipe(revCollector())
            .pipe(gulp.dest(destPath.html))
    })
    //文件统一清理
    gulp.task('cleanAll',() => {
        return gulp.src([destPath.html,destPath.css,destPath.fonts,destPath.images,destPath.js,destPath.music])
            .pipe(clean({force:true}))
    });
    //上线任务统一编译
    gulp.task('demoProd',['cleanAll'],() => {
        gulp.start('htmlProd','jsProd','cssProd','image','font','music','revHTMLProd');
    });
    //开发任务统一编译
    gulp.task('demoDev',['cleanAll'],() => {
        gulp.start('htmlDev','jsDev','cssDev','image','font','music','revHTMLDev');
    });
    //变动统一监听
    gulp.task('demoWatch',() => {
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
