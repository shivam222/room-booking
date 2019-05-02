const express= require('express');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const app= express();
const path= require('path');
const cors= require('cors');
const config = require('./config/default');

const orgRegister= require('./server/routes/orgRegister');
const userRegister= require('./server/routes/userRegister');
const org= require('./server/routes/org');
const email= require('./server/routes/email');
const login= require('./server/routes/login');
const forgotPassword= require('./server/routes/forgotPassword');
const rooms= require('./server/routes/rooms');
const token= require('./server/routes/token');
const admin= require('./server/routes/admin');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'dist/roomBooking')));
//mongoose.connect('mongodb://localhost:27017/roomBooking');
mongoose.connect(config.config.mongo_connection_string1+process.env.code_atlas_user+config.config.mongo_connection_string2);
app.use('/org-register',orgRegister);
app.use('/sign-up',userRegister);
app.use('/org',org);
app.use('/email',email);
app.use('/log-in',login);
app.use('/forgot-password',forgotPassword);
app.use('/rooms',rooms);
app.use('/token',token);
app.use('/admin',admin);

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'dist/roomBooking/index.html'));
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4600;
}

app.listen(port,function(req,res){
    console.log('Running');
});