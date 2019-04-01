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
    const email= req.body.email.toLowerCase().toLowerCase().trim();
    User.find({
        'email': email   
    }, function (err, userData) {
        if (err) {
            res.status(500).json({msg: 'Error while checking for email'});
        } else {
            if (userData.length == 0) {
                res.status(400).json({msg: 'this email is not registered yet'});
            }
            else {
                const userRole= userData[0].role;
                const userName= userData[0].name;
                const userOrg= userData[0].org;
                const passHash= userData[0].password.passwordHash;
                const passSalt= userData[0].password.salt;
                const password= req.body.password;
                const passHashObtained= sha512(password, passSalt);
                if(passHashObtained === passHash) {
                    const role= userData[0].role;
                    const payload = {
                        role: role
                    };
                    var token = jsonwebtoken.sign(payload, 'make me secret', {//FIXME: change the secret key
                        expiresIn: '1d' // expires in 24 hours
                    });
                    res.status(200).json({ msg:'success', auth: true, token: token, role:userRole, name:userName, email:email, org:userOrg });
                    
                } else {
                    res.status(400).json({msg: 'incorrect password'});
                }
            }
        }
    });
});


module.exports = router;