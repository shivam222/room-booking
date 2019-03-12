const express = require('express');
const crypto = require('crypto');
const User = require('../../models/userStructure');
const jsonwebtoken = require('jsonwebtoken');

const router = express.Router();

function sha512(userPass, salt) {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(userPass.toString());
    const value = hash.digest('hex');
    return value;
}

router.post('/authenticate', (req, res) => {
    const email= req.body.email.toLowerCase();;
    User.find({
        'email': email   
    }, function (err, userData) {
        if (err) {
            res.send("error " + err);
        } else {
            if (userData.length == 0) {
              console.log("hi");
                res.send("this email is not registered yet");
            }
            else {
                const passHash= userData[0].password.passwordHash;
                const passSalt= userData[0].password.salt;
                const password= req.body.password;
                const passHashObtained= sha512(password, passSalt);
                if(passHashObtained === passHash) {
                    const role= userData[0].role;
                    const payload = {
                        role: role,
                        email: email 
                    };
                    var token = jsonwebtoken.sign(payload, 'make me secret', {//FIXME: change the secret key
                        expiresIn: '1d' // expires in 24 hours
                    });
                    res.send({ auth: true, token: token });
                    
                } else {
                    res.send('incorrect password');
                }
            }
        }
    });
});


module.exports = router;