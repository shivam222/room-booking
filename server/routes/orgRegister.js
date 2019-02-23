const express = require('express');
const Joi = require('joi');
const crypto = require('crypto');
const User = require('../../models/userStructure');
const Org = require('../../models/orgStructure');

const router = express.Router();

function genRandomString(lengthOfSalt) {
    return crypto.randomBytes(Math.ceil(lengthOfSalt / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, lengthOfSalt);
}

function sha512(userPass, salt) {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(userPass.toString());
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

function createSaltHashedPassword(userPass) {
    const salt = genRandomString(16);
    return passwordData = sha512(userPass, salt);
}

const schema = Joi.object().keys({//Schema to validate coming request
    org: Joi.string().min(2).max(20).required(),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().alphanum().min(5).max(50).required(),
    cnfrmpass: Joi.string().required().valid(Joi.ref('password'))
});

router.post('/new', (req, res) => {
    Joi.validate(req.body, schema, function (err, val) {//validate the request against defined schema
        if (err) {
            res.send(err.details[0].message);
        }
        else {
            let newUser = new User({
                org: req.body.org,
                name: req.body.name,
                email: req.body.email,
                role: 'admin',
                password: req.body.password
            });
            let newOrg = new Org({
                name: newUser.org,
                user_count: 1,
                room_count: 0,
                room_names: []
            });
            newUser.org = newUser.org.toLowerCase();
            newUser.email = newUser.email.toLowerCase();
            User.find({
                'org': newUser.org   //check if this org already exists
            }, function (err, orgData) {
                if (err) {
                    res.send("error " + err);
                } else {
                    if (orgData.length == 0) {
                        User.find({   ////check if this emailId already exists
                            'email': newUser.email
                        }, function (err, emailData) {
                            if (err) {
                                res.send("error " + err);
                            }
                            else {
                                if (emailData.length == 0) {
                                    //Salt Hash The Password
                                    const password = createSaltHashedPassword(newUser.password);
                                    newUser.password = password;
                                    //save to db
                                    newUser.save(function(err){
                                        if(err){
                                            res.send("Unable to save data(This could be either a technical issue or format of data sent by you was wrong)");
                                        }
                                        else{
                                            res.write("admin user for the new org created successfully ");
                                            newOrg.save(function(err){//save the org in org db
                                               if(err){   //delete the admin as well
                                                User.remove({email: newUser.email}, function(err){
                                                   if(err){
                                                      res.send("unable to delete the admin");
                                                   }
                                                   else{
                                                       res.send("Try Again!");
                                                   }
                                                });                                              
                                               }
                                               else{
                                                res.write("org registered successfully");
                                                res.end();                                          
                                               }
                                           })
                                        }
                                    })
                                }
                                else {
                                    res.send("email already exists");
                                }
                            }
                        });
                    }
                    else {
                        res.send("org already exists");
                    }
                }
            });
        }
    });
});

module.exports = router;