const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/userStructure');

const router = express.Router()

router.get('/users/:org', (req, res) => {
    const org = req.params.org;
    const token = req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
    } catch (e) {
        res.status(400).json({msg: 'unauthorized'});
    }
    if(decoded.role === 'admin') {
         User.find({'org': org}, function(err, usersData){
            if (err) {
                res.status(400).json({msg: 'error while looking for org'});
            } else {
                if (usersData.length === 0) {
                    res.status(400).json({msg: 'No users:(Strange'});
                } else {
                    let emailArr = [];
                    usersData.forEach(function(ele, index){
                        emailArr[index]= ele.email;
                        if(index === usersData.length - 1) {
                         res.status(200).json({msg: emailArr});
                        }
                     });   
                }
            }
         });
    }
});


module.exports = router;