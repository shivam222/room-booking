const express = require('express');
const Joi = require('joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../../models/userStructure');
const pendingUser = require('../../models/pendingUserStructure');
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

function sendMail(transporter, mailOptions, lmt, callback){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          if(lmt <= 5){
          console.log("Trying Again");
          setTimeout(function(){
          sendMail(transporter, mailOptions, lmt+1, callback);
          },
          5000);
          }
           else{
              console.log("Unable to send the email");
              callback(error, info);
           }
        } else {
          console.log('Email sent: ' + info.response);
          callback(error, info);
        }
      });
}

function mailFunc(adminMail, userMail, userId){
    const verificationUrl= `http://localhost:4600/sign-up/verify/${userId}`;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        auth: {
            user: 'shivamez234@gmail.com',
            pass: process.env.VERIFICATIONLINKPASS
        },
        secureConnection: 'false',
        tls: {
            ciphers: 'SSLv3'
        }
        });
        const mailOptions = {
        from: 'shivamez234@gmail.com',
        to: adminMail,
        subject: 'Verify User in your room booking system',
        text: `user ${userMail} wants to join. verify by clicking- ${verificationUrl}`
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
            newUser.org = newUser.org.toLowerCase();
            newUser.email = newUser.email.toLowerCase();
            Org.find({
                'name': newUser.org   //check if this org already exists
            }, function (err, orgData) {
                if (err) {
                    res.send("error " + err);
                } else {
                    if (orgData.length != 0) {
                        User.find({   ////check if this emailId already exists
                            'email': newUser.email
                        }, function (err, emailData) {
                            if (err) {
                                res.send("error " + err);
                            }
                            else {
                                if (emailData.length == 0) {
                                    //Salt Hash The Password
                                    const password = createSaltHashedPassword(req.body.password);
                                    newUser.password = password;
                                    //save to db
                                    newUser.save(function(err) {
                                        if(err){
                                            res.send("Unable to save data(This could be either a technical issue or format of data sent by you was wrong)");
                                        }
                                        else{
                                            res.send("Success.We have sent email to all admins of this org once approved you will be able to login");
                                            User.find({
                                                'org': newUser.org,
                                                'role': 'admin'
                                            },function(err, adminData){
                                                if(err){
                                                    res.send("error " + err);
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
                                    res.write(`Hi there! Your email id is already registered with us in the org ${userDetails.org}`);
                                    res.write(`You can delete your account by logging in and then try to register again`);
                                    res.end();
                                }
                            }
                        });
                    }
                    else {
                        res.send("this org does not exist");
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
                                                        user: 'shivamez234@gmail.com',
                                                        pass: process.env.VERIFICATIONLINKPASS
                                                    },
                                                    secureConnection: 'false',
                                                    tls: {
                                                        ciphers: 'SSLv3'
                                                    }
                                                    });
                                                    const mailOptions = {
                                                    from: 'shivamez234@gmail.com',
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