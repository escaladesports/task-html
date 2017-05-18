'use strict'
const html = require('../index')
html({
	src: 'test',
	dist: 'test',
	minifyHtml: true,
	minifyHtmlOptions: {
		removeComments: true,
		removeAttributeQuotes: true,
		removeOptionalTags: true,
		removeEmptyAttributes: true,
		collapseBooleanAttributes: true,
		collapseInlineTagWhitespace: false,
		collapseWhitespace: true,
		decodeEntities: true,
		minifyCSS: true,
		minifyJS: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		sortAttributes: true,
		sortClassName: true
	}
})
