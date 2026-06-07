const rateLimit =
require("express-rate-limit");



const authLimiter =
rateLimit({


windowMs:
15*60*1000,


limit:5,


message:{

success:false,

message:
"Too many attempts, try later"

}


});



module.exports =
{
authLimiter
};