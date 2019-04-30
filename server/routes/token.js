const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../../config/default');

const router = express.Router()

router.get('/check', (req, res) => {
    const token = req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], config.config.sender_email_pass);
    } catch (e) {
        res.status(400).json({msg: false});
    }
    if(decoded) {
        res.status(200).json({msg: true});
    }
});


module.exports = router;