const util = require('util')
const path = require('path')
const fs = require('fs')
const glob = util.promisify(require('glob'))
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const cheerio = require('cheerio')

function extractPreloads(html) {
	const $ = cheerio.load(html)
	const links = Array.from($('link[rel="preload"]'))
	return links.map(el =>
		`<${el.attribs.href}>;rel=preload;as=${el.attribs.as}`).join(',')
}

function getHeadersFor(firebase, source) {
	if (firebase.hosting.headers === undefined)
		firebase.hosting.headers = []
	for (const block of firebase.hosting.headers) {
		if (block.source === source)
			return block
	}
	const block = { source, headers: [] }
	firebase.hosting.headers.push(block)
	return block
}

async function main() {
	const firebaseFile = __dirname + '/../firebase.json';
	let firebaseJson = await readFile(firebaseFile, 'utf-8')
	const firebase = JSON.parse(firebaseJson)

	const base = __dirname + "/../dist"
	const pages = await glob('**/*.html', { cwd: base })
	for (const page of pages) {
		console.log('Processing preloads on', page)
		const html = await readFile(path.join(base, page), 'utf-8')
		const header = extractPreloads(html)

		let source = '/' + page
		if (page === 'index.html') source = '/'
		const block = getHeadersFor(firebase, source)
		block.headers = block.headers.filter(x => x.key !== 'Link')
		block.headers.push({ key: 'Link', value: header })
	}

	firebaseJson = JSON.stringify(firebase, null, 2) + '\n'
	await writeFile(firebaseFile, firebaseJson, 'utf-8')
}

main().catch(err => {
	console.error((err && err.stack) || err)
	process.exit(1)
})
