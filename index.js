const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressjwt = require('express-jwt');

const app = express();
const PORT = process.env.API_PORT || 8888;

const API_URL='http://localhost:8888';
const AUTH_URL='http://localhost:3000';

const users = [
	{id: 1, username: 'admin', password: 'admin'},
	{id: 2, username: 'guest', password: 'guest'}

];


app.use(bodyParser.json());
app.use(cors());

// jwt middleware to check if the signature matches the one from the authentication server to validate server
const jwtCheck = expressjwt({
	secret: 'mysupersecretkey'
})

// public route
app.get('/resource', (req, res) => {
	res.status(200).send('Public resource, you can see this');
});

// secured route requiring authentication
// secure private route by passing jwtCheck as second argument
app.get('/resource/secret', jwtCheck, (req, res) => {
	res.status(200).send('Secret resource, you should be logged in to see this');
})

app.post('/login', (req, res) => {
	if(!req.body.username || !req.body.password){
		res.status(400).send('You need a username and password');
		return;
	}

	const user = users.find((u) => {
		return u.username === req.body.username && u.password === req.body.password
	});

	if(!user) {
		res.status(401).send('User not found');
		return;
	}

	// create a sign in token if user is found
	// attach payload from user
	// add secret key string
	// pass options like token expiration
	const token = jwt.sign({
		sub: user.id,
		username: user.username
	}, 'mysupersecretkey', {expiresIn: "3 hours"});

	// then send back a success status with the token you've just constructed
	// each user will have their own access token specific to them
	res.status(200).send({access_token: token});
})

app.get('*', (req, res) => {
	res.sendStatus(404);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});