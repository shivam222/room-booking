const express = require('express');
const Joi = require('joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../../models/userStructure');
const pendingUser = require('../../models/pendingUserStructure');
const Org = require('../../models/orgStructure');
const  config =   require('../../config/default');

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

function sendMail(transporter, mailOptions, lmt, callback){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          if(lmt <= 5){
          setTimeout(function(){
          sendMail(transporter, mailOptions, lmt+1, callback);
          },
          5000);
          }
           else{
              callback(error, info);
           }
        } else {
          callback(error, info);
        }
      });
}

function mailFunc(adminMail, userMail, userId){
    const verificationUrl= config.config.url1 + `sign-up/verify/${userId}`;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        auth: {
            user: config.config.sender_email,
            pass: process.env.emailP
        },
        secureConnection: 'false',
        tls: {
            ciphers: 'SSLv3'
        }
        });
        const mailOptions = {
        from: config.config.sender_email,
        to: adminMail,
        subject: 'Verify User in your room booking system',
        text: `user ${userMail} wants to join. verify by clicking- ${verificationUrl}`
        };
        let lmt= 0;//This is number of times we will try to send email on failure
        sendMail(transporter, mailOptions, lmt,function(err, info) {
        if (err) {
            res.status(500).json({msg: 'Failed to send mail.Please try again'});
            } else {
            res.status(200).json({msg: 'Success.Verification email is sent to all admins of this org'});
            }
        });
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
            res.status(400).json({msg: err.details[0].message});
        }
        else {
            let newDate = new Date();
            let randomNum = Math.floor(Math.random() * 1000000000);
            let newUser = new pendingUser({
                _id: randomNum,
                org: req.body.org,
                name: req.body.name,
                email: req.body.email,
                role: 'booker',
                password: {salt:'', passwordHash:''},
                storeTime: newDate
            });
            newUser.org = newUser.org.toLowerCase().trim();
            newUser.email = newUser.email.toLowerCase().trim();
            Org.find({
                'name': newUser.org   //check if this org already exists
            }, function (err, orgData) {
                if (err) {
                    res.status(500).json({msg: 'error while looking if this org exists'});
                } else {
                    if (orgData.length != 0) {
                        User.find({   ////check if this emailId already exists
                            'email': newUser.email
                        }, function (err, emailData) {
                            if (err) {
                                res.status(500).json({msg: 'error while searching if this email already exists'});
                            }
                            else {
                                if (emailData.length === 0) {
                                    //Salt Hash The Password
                                    const password = createSaltHashedPassword(req.body.password);
                                    newUser.password = password;
                                    //save to db
                                    newUser.save(function(err) {
                                        if(err){
                                            res.status(500).json({msg: 'Unable to save data'});
                                        }
                                        else{
                                            User.find({
                                                'org': newUser.org,
                                                'role': 'admin'
                                            },function(err, adminData){
                                                if(err){
                                                    res.status(500).json({msg: 'error while looking for admins to send mail'});
                                                }
                                                else{
                                                    adminData.forEach(function(admin){
                                                      mailFunc(admin.email, newUser.email, newUser._id);
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                                else {//this user already exists
                                   const userDetails= emailData[0];
                                    res.status(400).json({msg: `Hi there! Your email id is already registered with us in the org ${userDetails.org}.
                                    You can delete your account by logging in and then try to register again`});
                                }
                            }
                        });
                    }
                    else {
                        res.status(400).json({msg: 'this org does not exists'});
                    }
                }
            });
        }
    });
});

router.get('/verify/:randNum', (req, res) => {
    const randomNum= req.params.randNum;
    let userEmail,userOrg,userName,userPassword;
    pendingUser.find({
        '_id': randomNum
    }, function(err, userData){
       if(err) {
           res.send("Something Wrong:( Please open the link again1");
       }
       else{
          if(userData.length == 0) {
             res.send("oops.the link is not valid");
          }
          else {
             userOrg= userData[0].org;
             userEmail= userData[0].email;
             userName= userData[0].name;
             userPassword= userData[0].password;
             Org.find({
                 'name': userOrg
             },function(err, orgData){
                if(err){
                    res.send("Something Wrong:( Please open the link again2");
                }
                else{
                    if(orgData.length == 0) {
                        res.send("oops.your org does not exist");
                     }
                     else{
                        User.find({
                            'email': userEmail
                        }, function(err, userEmailInfo){
                             if(err) {
                                res.send("Something Wrong:( Please open the link again3");
                             }
                             else {
                              if(userEmailInfo.length != 0){
                                  res.send(`oops this email is already registered in org ${userEmailInfo[0].org}`);
                              }
                              else{
                                let newUser = new User({
                                    org: userOrg,
                                    name: userName,
                                    email: userEmail,
                                    role: 'booker',
                                    password: userPassword
                                });
                                newUser.save(function(err){
                                    if(err){
                                        res.send("Something Wrong:( Please open the link again4");
                                    }
                                    else{
                                        pendingUser.remove({_id: randomNum}, function(err){
                                            if(err){
                                               res.send("unable to delete user from pending user but continuing anyway");
                                            }
                                            else {
                                                //success
                                                //send mail to user that he is registered
                                                const transporter = nodemailer.createTransport({
                                                    host: 'smtp.gmail.com',
                                                    port: '587',
                                                    auth: {
                                                        user: config.config.sender_email,
                                                        pass: process.env.emailP
                                                    },
                                                    secureConnection: 'false',
                                                    tls: {
                                                        ciphers: 'SSLv3'
                                                    }
                                                    });
                                                    const mailOptions = {
                                                    from: config.config.sender_email,
                                                    to: userEmail,
                                                    subject: 'Regsitered with us successfully',
                                                    text: `Hi you are now a part of ${userOrg} booking system`
                                                    };
                                                    let lmt= 0;//This is number of times we will try to send email on failure
                                                    sendMail(transporter, mailOptions, lmt,function(err, info) {
                                                    if (err) {
                                                        res.send(err);
                                                        } else {
                                                        res.send('Email sent: ' + info.response);
                                                        }
                                                    });                                              
                                            }
                                         });
                                    }
                                })
                              }
                             }
                        })
                     }
                }
             })   
          }
       }
    });
});

module.exports = router;