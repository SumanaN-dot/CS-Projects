function checkAuth(req, res, next) {
    // Check if the user is logged in by checking the session
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return res.status(200).json({ loggedIn: true, userId: req.session.userId, username: req.session.username, admin: req.session.admin });
    } else {
        // User is not authenticated, send a 401 Unauthorized response
        return res.status(401).json({ loggedIn: false, message: 'Unauthorized access. Please log in.' });
    }

}

module.exports = checkAuth;