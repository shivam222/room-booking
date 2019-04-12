const express = require('express');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router()

router.get('/check', (req, res) => {
    const token = req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
    } catch (e) {
        res.status(400).json({msg: false});
    }
    if(decoded) {
        res.status(200).json({msg: true});
    }
});


module.exports = router;