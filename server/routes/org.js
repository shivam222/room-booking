const express = require('express');
const Org = require('../../models/orgStructure');

const router = express.Router();

router.get('/exist/:org', (req, res) => {
    res.send(true);
//   const org= req.params.org.toLowerCase().trim();
//   Org.find({
//     'name': org   //check if this org already exists
// }, function (err, orgData) {
//     if (err) {
//         res.send("error " + err);
//     } else {
//         if (orgData.length == 0) {
//             res.send(false);
//         }
//         else {
//             res.send(true);
//         }
//     }
// });
});


module.exports = router;