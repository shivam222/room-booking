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
                role: 'admin',
                password: {salt:'', passwordHash:''},
                storeTime: newDate
            });
            newUser.org = newUser.org.toLowerCase().trim();
            newUser.email = newUser.email.toLowerCase().trim();
            Org.find({
                'name': newUser.org   //check if this org already exists
            }, function (err, orgData) {
                if (err) {
                    res.status(500).json({msg: "Error while looking if org already exist"});
                } else {
                    if (orgData.length == 0) {
                        User.find({   ////check if this emailId already exists
                            'email': newUser.email
                        }, function (err, emailData) {
                            if (err) {
                                res.status(500).json({msg: "Error while looking if email already exist"});
                            }
                            else {
                                if (emailData.length == 0) {
                                    //Salt Hash The Password
                                    const password = createSaltHashedPassword(req.body.password);
                                    newUser.password = password;
                                    //save to db
                                    newUser.save(function(err) {
                                        if(err){
                                            res.status(500).json({msg: "Unable to save data"});
                                        }
                                        else{
                                            //logic create link and send the email
                                            const verificationUrl= config.config.url1 + `org-register/verify/${newUser._id}`;
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
                                                to: newUser.email,
                                                subject: 'Verify Account For Room Booking System',
                                                text: `click on link- ${verificationUrl}`
                                              };
                                              let lmt= 0;//This is number of times we will try to send email on failure
                                              sendMail(transporter, mailOptions, lmt,function(err, info) {
                                                if (err) {
                                                    res.status(500).json({msg: "Error while sending email for verification.Try again!"});
                                                  } else {
                                                    res.status(200).json({msg: 'Registered.A verification mail is sent to your emailid'});
                                                  }
                                              });
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
                        res.status(400).json({msg: "org already exists, either register your org with different name or join this org"});
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
             res.send("oops.you would have to register again.the link is no more valid");
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
                    if(orgData.length != 0) {
                        res.send("oops.this org is now taken.try again with diff org name");
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
                                  res.send(`oops your email is already registered in org ${userEmailInfo[0].org}`);
                              }
                              else{
                                let newUser = new User({
                                    org: userOrg,
                                    name: userName,
                                    email: userEmail,
                                    role: 'admin',
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
                                            } else {
                                            let newOrg = new Org({
                                                name: userOrg,
                                                user_count: 1,
                                                room_count: 0,
                                                room_names: []
                                            });
                                            newOrg.save(function(err){//save the org in org db
                                               if(err){   //delete the admin as well
                                                User.remove({email: userEmail}, function(err){
                                                   if(err){
                                                      res.send("unable to delete the admin(in this situation there is admin but no org)");
                                                   }
                                                   else{
                                                       res.send("You would have to register again.Sorry:(");
                                                   }
                                                });                                              
                                               }
                                               else{
                                                res.send("org registered successfully");                                         
                                               }
                                           })
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