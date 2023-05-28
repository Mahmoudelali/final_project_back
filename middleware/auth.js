import jwt from 'jsonwebtoken';

// verify if the token of the user is valid
export function verifyUser(req, res, next) {
	// let token = req.cookies["auth_token"];

	try {
		let token = req.headers['auth_token'];

		if (!token) {
			return res.status(403).send('Login Please!');
		} else {
			const decoded = jwt.verify(token, process.env.TOKEN_KEY);
			req.user = decoded;
			return next();
		}
	} catch (err) {
		return res.status(401).send('Cannot verify Token !');
	}
}
