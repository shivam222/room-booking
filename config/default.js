config = {
    "url1": "https://intense-harbor-23704.herokuapp.com/", // http://localhost:4600
    "sender_email": "shivamez234@gmail.com",
    "mongo_connection_string": "mongodb+srv://shivamb61:"+process.env.code_atlas_user+"@booking-0xv7w.mongodb.net/roomBooking", // mongodb://localhost:27017/roomBooking
    "web_token_secret": process.env.secret_token,
    "sender_email_pass": process.env.emailP
}
module.exports.config = config;