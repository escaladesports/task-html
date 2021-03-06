'use strict'
const pug = require('pug')
const notify = require('task-notify')
const error = require('task-error-notify')
const glob = require('glob-all')
const fs = require('fs-extra')
const minify = require('html-minifier').minify
const replaceExt = require('replace-ext')

module.exports = (config, cb) => {
	config = Object.assign({}, config)
	getFiles(config)
		.then(processFiles)
		.then(() => {
			notify('Pug processed')
			if(typeof cb === 'function') cb()
		})
		.catch(error)
}


function getFiles(opt){
	return new Promise((resolve, reject) => {
		glob([
			`${opt.src}/*.pug`,
			`!${opt.src}/_*.pug`
		], (err, files) =>{
			if(err) reject(err)
			else{
				opt.files = files
				resolve(opt)
			}
		})
	})
}
function processFiles(opt){
	return new Promise((resolve, reject) => {
		const promises = []
		const now = (new Date).getTime()
		for(let i = opt.files.length; i--;){
			promises.push(new Promise((resolve, reject) => {
				let html = pug.compileFile(opt.files[i])({
					deployTime: now
				})
				let dest = opt.files[i].replace(opt.src, opt.dist)
				dest = replaceExt(dest, '.html')
				if(opt.minifyHtml){
					html = minify(html, opt.minifyHtmlOptions)
				}
				fs.outputFile(dest, html, err => {
					if(err) reject(err)
					else resolve()
				})
			}))
		}
		Promise.all(promises)
			.then(resolve)
			.catch(reject)
	})
}
