'use strict'
const pug = require('pug')
const notify = require('task-notify')
const error = require('task-error-notify')
const glob = require('glob-all')
const fs = require('fs-extra')

module.exports = (config, cb) => {
	config = Object.assign({}, config)
	getFiles(config)
		.then(processFiles)
		.then(() => {
			console.log('done!')
		})
		.catch(console.error)
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
		for(let i = opt.files.length; i--;){
			promises.push(new Promise((resolve, reject) => {
				const html = pug.compileFile(opt.files[i])()
				const dest = opt.files[i].replace(opt.src, opt.dist)
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
