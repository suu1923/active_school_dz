module.exports = {
    path: {
        base: 'src/',
        html: '',
        sass: 'static/scss',
        css: 'static/css/',
        js: 'static/js/',
        scss: 'static/scss/',
        img: 'static/imgs/',
        ejs: 'ejs/',
        pages: 'pages/',
        dist: 'dist'
    },
    isDev: process.env.isDev === '0',//是否是开发环境
}
