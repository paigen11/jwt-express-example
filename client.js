// api server
const API_URL = "http://localhost:8888";

// authentication server
const AUTH_URL = "http://localhost:3000";

// this will be stored in memory
let ACCESS_TOKEN = undefined;

const headlineBtn = document.querySelector("#headlineBtn");
const secretBtn = document.querySelector("#secretBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");

// this works with no authorization
headlineBtn.addEventListener('click', () => {
	fetch(`${API_URL}/resource`).then(resp => {
		return resp.text()
	}).then(data => {
		UIUpdate.alertBox(data);
	});
})

// this doesn't work without authorization
secretBtn.addEventListener('click', () => {
	// set headers to hold the generated access token
	let headers = {};
	if(ACCESS_TOKEN) {
		headers = {
			"Authorization": `Bearer ${ACCESS_TOKEN}`;
		};
	}
	// pass the token as a header in the fetch
	fetch(`${API_URL}/resource/secret`, { headers }).then(resp => {
		UIUpdate.updateCat(resp.status);
		return resp.text()
	}).then(data => {
		UIUpdate.alertBox(data);
	});
})

// the token must be passed after fetching from the backend
loginBtn.addEventListener('click', () => {
	fetch(`${AUTH_URL}/login`, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
			"accept": "application/json"
		},
		body: JSON.stringify(UIUpdate.getUsernamePassword())
	}).then(resp => {
		UIUpdate.updateCat(resp.status);
		if(resp.status === 200){
			return resp.json();
		} else {
			return resp.json();
		}
	}).then(data => {
		if(data.access_token){	
			ACCESS_TOKEN = data.access_token;
			data = `Access Token: ${ACCESS_TOKEN}`;
			UIUpdate.loggedIn();
		}
		UIUpdate.alertBox(data);
	})
})

// all that's needed to log out and reset the access token
logoutBtn.addEventListener('click', () => {
	ACCESS_TOKEN = undefined;
	UIUpdate.loggedOut();
})
