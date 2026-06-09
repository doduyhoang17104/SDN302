const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user:"hoangdo171004@gmail.com",
pass:"kzig rylk kvgo iodt"
}

})

module.exports = transporter