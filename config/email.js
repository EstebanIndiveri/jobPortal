const passport = require("passport");
require('dotenv').config({path:'variables.env'});


module.exports={
    user:`${process.env.USER_MB}`,
    pass:`${process.env.PASS_MB}`,
    host:`${process.env.HOST_MB}`,
    port:`${process.env.PORT_MB}`
}