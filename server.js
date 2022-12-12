const http = require('http');
const url = require('url'); // import url qui est un module qui permet d'utiliser des méthodes de serveur http
const fs = require('fs');
//const logger = require('./logger'); //module pour logger
const dbConfig = require('./dbconfig2.js');
const hostname = 'localhost';
const port = 3010;
const sanitizeHtml = require('sanitize-html');

//logger.log('debug', 'Allo, Winston!');

const server = http.createServer((req, res) => {
	// logger.log(
	// 	'info',
	// 	`Le serveur a reçu une requête de URL : http://${hostname}:${port} requete:req.url`
	// );
	let requeteHTTP = req.url.slice(1); // enleve le / de depart de la requete
	let parametres = requeteHTTP.split('/');

	if (req.method == 'POST') {
		extractBody(req, res, selectRoute);
	} else {
		//Fonction qui va extraire la route des parametres de la requete
		selectRoute(req, res, null);
	}
});

async function selectRoute(req, res, body) {
	let parametres = req.url.slice(1).split('/');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);
	const route = url.parse(req.url, true).pathname;
	const objectParams = url.parse(req.url, true).query;

	if (route[0] == '/' || route[0] == 'index.html' || route[0] == '') {
		// let username = objectParams.username;
		 let username = sanitizeHtml(objectParams.username);
		console.log('username is', username);
		console.log('objectParams is', objectParams.username);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		if (objectParams.username) {
			res.end(`<h1>Bonjour ${username}</h1>`);
		} else {
			res.end('<h1>Bonjour</h1>');
		}
	}
}

server.listen(port, hostname, () => {
	console.log(
		'info',
		`Le serveur roule à l'URL suivant: http://${hostname}:${port}/`
	);
});
