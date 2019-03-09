const express = require('express');
const Org = require('../../models/orgStructure');

const router = express.Router();

router.get('/details/:org', (req, res) => {
  const org= req.params.org;
  Org.find({
    'name': org   //check if this org already exists
}, function (err, orgData) {
    if (err) {
        res.send("error " + err);
    } else {
        if (orgData.length == 0) {
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