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
    if(decoded.role === 'admin' || decoded.role === 'booker') {
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
    if(decoded.role === 'booker' || decoded.role === 'admin') {
        const roomId= req.params.id;
        const date = req.body.date.substring(0, 10);
        Room.find({'_id': roomId}, function(err, roomData) {
             let newRoomData = roomData[0];
             let description = req.body.des ?  req.body.des : '-';
             const bookingData = [{
                'from': req.body.from,
                'to': req.body.to,
                'description': description,
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
                    if(err) {
                        res.status(500).json({msg: 'failed to update'});
                    } else {
                        res.status(200).json({msg: 'updated'});
                    }
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

router.delete('/booking/delete/:roomId/:date', (req, res) => {
const bookingData = req.query;
const roomId = req.params.roomId;
const date = req.params.date;
const token = req.headers.authorization.split(' ');
let decoded;
try {
    decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
} catch (e) {
     res.status(400).json({msg: 'unauthorized'});
}

if(decoded.role === 'booker' || decoded.role === 'admin') {
    Room.find({
        '_id': roomId   //check if this org already exists
    }, function (err, roomData) {
        if (err) {
            res.status(500).json({msg: 'error while looking if this room exists'});
        } else {
            if (roomData.length === 0) {
                res.status(500).json({msg: 'there is no such room'});
            } else {
                const newRoomData = roomData[0];
                if(newRoomData.bookings && newRoomData.bookings[date]) {
                    const len = newRoomData.bookings[date].length;
                    let index = -1;
                    for(let i = 0; i < len; i++) {
                        if(newRoomData.bookings[date][i].from === bookingData.from && 
                            newRoomData.bookings[date][i].to === bookingData.to && 
                            newRoomData.bookings[date][i].by === bookingData.by ) {
                                index = i;
                                break;
                            }
                    }
                    if( index !== -1) {
                        newRoomData.bookings[date].splice(index, 1);
                        Room.update({'_id': roomId}, newRoomData, function(err) {
                            if(err) {
                                res.status(500).json({msg: 'failed to delete'});
                            } else {
                                res.status(200).json({msg: 'deleted'});
                            }
                        });      
                    }
                     //logic to update the booking
                } else {
                    res.status(400).json({msg: 'there are currently no bbokings in this org'});
                }
        }
        }
    });
} else {
    res.status(400).json({msg: 'unauthorized'});
}
});

router.delete('/delete/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const token = req.headers.authorization.split(' ');
    let decoded;
    try {
        decoded = jsonwebtoken.verify(token[1], 'make me secret');//FIXME:
    } catch (e) {
         res.status(400).json({msg: 'unauthorized'});
    }
    
    if(decoded.role === 'booker' || decoded.role === 'admin') {     
        Room.remove({_id: roomId}, function(err){
            if(err){
                res.status(400).json({msg: 'unable to delete room'});
            } else {
                res.status(200).json({msg: 'deleted'});
            }
        });
    } else {
        res.status(400).json({msg: 'unauthorized'});
    }
});


module.exports = router;