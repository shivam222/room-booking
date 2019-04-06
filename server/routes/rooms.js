const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const Org = require('../../models/orgStructure');
const Room = require('../../models/roomStructure');
const bookingCheck = require('../lib/bookingCheck');

const router = express.Router();

router.post('/new', (req, res) => {
    const token =  req.headers.authorization.split(' ');
    let decoded;
    try {
         decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
    } catch (e) {
         res.status(400).json({msg: 'unauthorized'});
    }
    if(decoded.role === 'admin') {
        const org= req.body.org.toLowerCase().trim();
        const roomName= req.body.name.toLowerCase().trim();
        Org.find({
            'name': org   //check if this org already exists
        }, function (err, orgData) {
            if (err) {
                res.status(500).json({msg: 'error while looking if this org exists'});
            } else {
                if (orgData.length === 0) {
                    res.status(400).json({msg: 'this org does not exist'});
                } else{
                  Room.find({
                      'org': org,
                      'name': roomName
                  },function(err, roomData) {
                    if (err) {
                        res.status(500).json({msg: 'error while looking if this room exists'});
                    } else {
                        if (roomData.length !== 0) {
                            res.status(400).json({msg: 'room with this name already exists'});
                        } else {
                            const newRoom = new Room({
                                org: org,
                                name: roomName,
                                bookings:{}
                            });
                            newRoom.save(function(err) {
                                if(err){
                                    res.status(500).json({msg: "Unable to create room"});
                                } else{
                                    res.status(200).json({msg: "Room created"});
                                }
                            });
                        }
                    }
                  });
                }
            }
        });
    } else {
        return res.status(400).json({msg: 'unauthorized'});
    }
});

router.put('/booking/:id', (req, res) => {
    const token =  req.headers.authorization.split(' ');
    let decoded, validated = true;
    try {
         decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
    } catch (e) {
         res.status(400).json({msg: 'unauthorized'});
    }
    if(decoded.role !== 'looker') {
        const roomId= req.params.id;
        const date = req.body.date.substring(0, 10);
        Room.find({'_id': roomId}, function(err, roomData) {
             let newRoomData = roomData[0];
             const bookingData = [{
                'from': req.body.from,
                'to': req.body.to,
                'description': req.body.des,
                'by': req.body.name
             }];
             if(newRoomData.bookings) {
               if(newRoomData.bookings.hasOwnProperty(date)) {
                  // validation for available slot
                  if(bookingCheck.isAvailable(newRoomData.bookings[date], bookingData[0].from, bookingData[0].to)) {
                    newRoomData.bookings[date].push(bookingData[0]);
                   } else {
                       validated = false;
                   }            
               } else {
                   newRoomData.bookings[date] = bookingData;
               }
             } else{
                 newRoomData.bookings = {
                     [date]: bookingData
                 };
             }
             if(validated) {
                Room.update({'_id': roomId}, newRoomData, function(err) {
                    res.status(200).json({msg: 'updated'});
               });
             } else {
                res.status(400).json({msg: 'Invalid time slot'});
             }
        });
    } else {
        return res.status(400).json({msg: 'unauthorized'});
    }
});

router.get('/all/:org', (req, res) => {
    const org= req.params.org;
    const token =  req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
    } catch (e) {
         res.status(400).json({msg: 'unauthorized'});
    }
    if(decoded.role) {
        Room.find({
            'org': org
        },function(err, roomData) {
          if (err) {
              res.status(500).json({msg: 'error while looking for rooms'});
          } else {
              if (roomData.length === 0) {
                  res.status(400).json({msg: 'there are currently no rooms'});
              } else {
                const resArr = {
                    rooms: []
                }
                let tempArr = [];
                roomData.forEach(function(ele, index){
                   tempArr[index]= {
                         name: ele.name,
                         id: ele._id,
                         bookings: ele.bookings
                   };
                   if(index === roomData.length - 1) {
                    resArr.rooms = tempArr;
                    res.status(200).json({msg: resArr});
                   }
                });
              }
          }
        });
    } else {
         res.status(400).json({msg: 'unauthorized'});
    }
});

module.exports = router;