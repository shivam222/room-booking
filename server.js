const express= require('express');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const app= express();
const path= require('path');
const cors= require('cors');

const orgRegister= require('./server/routes/orgRegister');
const userRegister= require('./server/routes/userRegister');
const org= require('./server/routes/org');
const email= require('./server/routes/email');
const login= require('./server/routes/login');
const forgotPassword= require('./server/routes/forgotPassword');
const rooms= require('./server/routes/rooms');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'dist/roomBooking')));

mongoose.connect('mongodb://localhost:27017/roomBooking');

app.use('/org-register',orgRegister);
app.use('/sign-up',userRegister);
app.use('/org',org);
app.use('/email',email);
app.use('/log-in',login);
app.use('/forgot-password',forgotPassword);
app.use('/rooms',rooms);

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'dist/roomBooking/index.html'));
});

app.listen(4600,function(req,res){
    console.log('Running');
});