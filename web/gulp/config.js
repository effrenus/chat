module.exports = {
	path: {
		build: {
			html: 'build/',
			js: 'build/js/',
			css: 'build/css/',
			img: 'build/img/',
			fonts: 'build/fonts/'
		},
		src: {
			html: 'src/templates/*.jade',
			js: 'src/js/index.js',
			css: 'src/style/*.{scss,sass,css}',
			img: 'src/img/**/*.*',
			fonts: 'src/fonts/**/*.*'
		},
		watch: {
			html: 'src/**/*.jade',
			js: 'src/js/**/*.{js,sass,jsx}',
			css: 'src/style/**/*.{scss,sass,css}',
			img: 'src/img/**/*.*',
			fonts: 'src/fonts/**/*.*'
		},
		clean: 'build'
	},
	server: {
		host: 'localhost',
		port: '8888'
	}
};
