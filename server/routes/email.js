const express = require('express');
const User = require('../../models/userStructure');

const router = express.Router();

router.get('/exist/:email', (req, res) => {
  const email= req.params.email;
  User.find({
    'email': email   //check if this email already exists
}, function (err, emailData) {
    if (err) {
        res.send("error " + err);
    } else {
        if (emailData.length == 0) {
          console.log("hi");
            res.send(false);
        }
        else {
          console.log("hi2");
            res.send(true);
        }
    }
});
});


module.exports = router;