const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../models/userStructure');
const config = require('../../config/default');

const router = express.Router()

router.get('/users/:org', (req, res) => {
    const org = req.params.org;
    const token = req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], config.config.sender_email_pass);
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
                        emailArr[index]= {'email': ele.email, 'role': ele.role};
                        if(index === usersData.length - 1) {
                         res.status(200).json({msg: emailArr});
                        }
                     });   
                }
            }
         });
    }
});

router.delete('/user/delete/:email', (req,res) => {
    const email = req.params.email;
    const token = req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], config.config.sender_email_pass);
    } catch (e) {
        res.status(400).json({msg: 'unauthorized'});
    }
    if(decoded.role === 'admin') {
        User.find({'email': email}, function(err, usersData){
            if (err) {
                res.status(400).json({msg: 'error while looking for user'});
            } else {
                if (usersData.length === 0) {
                    res.status(400).json({msg: 'No users:(Strange'});
                } else {
                    const userData = usersData[0];
                    if (userData.role === 'admin') {
                        res.status(400).json({msg: 'Admin can not be deleted'});
                    } else {
                        User.remove({'email': email}, function(err) {
                            if(err) {
                                res.status(500).json({msg: 'unable to delete the user'});
                            } else {
                                res.status(200).json({msg: 'deleted the user'});
                            }
                        });
                    }
                }
            }
         });    
    }
});

router.put('/user/role/update/:email', (req, res) => {
    const email= req.params.email;
    const newRole = req.body.newRole;
    console.log(email+' '+newRole);
    const token =  req.headers.authorization.split(' ');
    let decoded;
    try {
         decoded = jsonwebtoken.verify(token[1], config.config.sender_email_pass);
    } catch (e) {
         res.status(400).json({msg: 'unauthorized'});
    }
    if(decoded.role === 'admin') {
      User.find({email: email}, function(err, userData) {
         if(err) {
            res.status(500).json({msg: 'failed to find the user'});
         } else {
             if(userData.length === 0) {
                res.status(400).json({msg: 'No such user:(Strange'});
             } else {
                 if(newRole=== 'admin' || newRole=== 'looker' || newRole=== 'booker') {
                     var newUserData = userData[0];
                     newUserData.role = newRole;
                     User.update({email: email}, newUserData, function(err) {
                        if(err) {
                            res.status(500).json({msg: 'failed to update'});
                        } else {
                            res.status(200).json({msg: 'updated'});
                        }
                     });                     
                 }
             }
         }
      });
    } else {
        return res.status(400).json({msg: 'unauthorized'});
    }
});

module.exports = router;