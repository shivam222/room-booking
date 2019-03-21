const express = require('express');
const crypto = require('crypto');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const User = require('../../models/userStructure');
const ForgotPassword = require('../../models/forgotPassword');


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
    email: Joi.string().required(),
    password: Joi.string().alphanum().min(5).max(50).required(),
    cnfrmpass: Joi.string().required().valid(Joi.ref('password'))
});

router.post('/reset', (req, res) => {
    Joi.validate(req.body, schema, function (err, val) {
    if (err) {
        res.status(400).json({msg: err.details[0].message});
    } else {
    const email= req.body.email.toLowerCase();
    User.find({
        'email': email   
    }, function (err, userData) {
        if (err) {
            res.status(500).json({msg: 'Error while checking for email'});
        } else {
            if (userData.length == 0) {
                res.status(400).json({msg: 'this email is not registered with us'});
            }
            else {
                let newDate = new Date();
                let randomNum = Math.floor(Math.random() * 1000000000);
                const password = createSaltHashedPassword(req.body.password);
                let newData = new ForgotPassword({
                    _id: randomNum,
                    email: email,
                    password: password,
                    storeTime: newDate
                });
                newData.save(function(err) {
                    if(err){
                        res.status(500).json({msg: 'Unable to save data'});
                    } else {
                        const verificationUrl= `http://localhost:4600/forgot-password/verify/${newData._id}`;
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
                            to: email,
                            subject: 'Request for password change',
                            text: `If it was you- ${verificationUrl}`
                          };
                          let lmt= 0;//This is number of times we will try to send email on failure
                          sendMail(transporter, mailOptions, lmt,function(err, info) {
                            if (err) {
                                res.status(500).json({msg: "Error while sending email for confirmation.Try again!"});
                              } else {
                                res.status(200).json({msg: 'A confirmation mail is sent to your emailid'});
                              }
                          });
                    }
                })
            }
        }
    });
  }
 });
});

router.get('/verify/:randNum', (req, res) => {
    const randomNum= req.params.randNum;
    ForgotPassword.find({
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
            const userEmail= userData[0].email;
            const userPassword= userData[0].password;
            User.find({   ////check if this emailId already exists
                'email': userEmail
            }, function (err, emailData) {
                if (err) {
                    res.send("Error while looking if email already exist");
                }
                else {
                    if (emailData.length == 0) {
                        res.send("This email is not registered with us");
                    } else {
                        let updatedData= emailData[0];
                        updatedData.password= userPassword; 
                        User.update({'email': userEmail}, updatedData, function(err){
                            if(err) {
                                res.send("Error while updating password.please try again");
                            } else {
                                ForgotPassword.remove({_id: randomNum}, function(err){
                                    if(err){
                                       res.send("unable to delete the data from forgot password table.but the password is updated successfully");
                                    }
                                    else {
                                        res.send("password is updated successfully");   
                                    }
                                })
                            }
                        })
                    }
                }
            })
         }           
       }
    })
});


module.exports = router;