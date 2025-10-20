const express = require('express');
const router = express.Router();

router.get('/set-cookie', (req, res) => {
    res.cookie('test_cookie', 'hello_world', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        domain: 'localhost',
        path: '/',
        maxAge: 3600000
    });
    
    res.json({ message: 'Cookie set successfully' });
});

router.get('/check-cookie', (req, res) => {
    console.log('🍪 Cookies reçus:', req.cookies);
    res.json({ cookies: req.cookies });
});

module.exports = router;