const authService =
require("../services/auth.service");


const signup = async(req,res)=>{


try{


    const user =
    await authService.registerUser(
        req.body
    );



    res.status(201).json({

        success:true,

        message:
        "User created successfully",


        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }


    });


}
catch(error){


    res.status(400).json({

        success:false,
        message:error.message

    });

}


};

const login = async(req,res)=>{


try{

const result =
await authService.loginUser(
req.body
);

res.cookie(

"refreshToken",

result.refreshToken,

{

httpOnly:true,

secure:true,
sameSite:"strict",

maxAge:
7*24*60*60*1000

}

);

res.status(200).json({

success:true,

message:"Login successful",

accessToken:
result.accessToken,


user:{
id:result.user._id,
name:result.user.name,
email:result.user.email
}

});



}
catch(error){

res.status(400).json({
success:false,
message:error.message
});

}

};

const refreshToken = async(req,res)=>{


try{

    console.log(
    "ALL COOKIES:",
    req.cookies
);

const token =
req.cookies.refreshToken;



const result =
await authService.refreshAccessToken(
token
);



res.cookie(

"refreshToken",

result.refreshToken,

{

httpOnly:true,

secure:false,

sameSite:"strict",

maxAge:
7*24*60*60*1000

}

);



res.status(200).json({

success:true,

accessToken:
result.accessToken

});


}
catch(error){


res.status(401).json({

success:false,

message:error.message

});


}


};

const logout = async(req,res)=>{


try{


    const token =
    req.cookies.refreshToken;



    await authService.logoutUser(
        token
    );



    res.clearCookie(
        "refreshToken"
    );



    res.status(200).json({

        success:true,

        message:
        "Logged out successfully"

    });



}
catch(error){


    res.status(400).json({

        success:false,

        message:error.message

    });


}


};

const verifyEmail =async(req,res)=>{


try{


await authService.verifyEmailOTP(
    req.body
);



res.status(200).json({

success:true,

message:
"Email verified successfully"

});



}
catch(error){


res.status(400).json({

success:false,

message:error.message

});


}


};

const resendVerificationOTP =async(req,res)=>{


try{


await authService.resendOTP(
    req.body
);



res.status(200).json({

success:true,

message:
"OTP sent successfully"

});



}
catch(error){


res.status(400).json({

success:false,

message:error.message

});


}


};

const forgotPassword =async(req,res)=>{


try{


await authService.forgotPassword(
req.body
);


res.json({

success:true,

message:"OTP sent"

});


}
catch(error){


res.status(400).json({

success:false,

message:error.message

});


}


};

const verifyResetOTP =async(req,res)=>{


try{


const token =
await authService.verifyResetOTP(
req.body
);



res.json({

success:true,

resetToken:token

});


}
catch(error){

res.status(400).json({

success:false,

message:error.message

});

}

};

const resetPassword =async(req,res)=>{


try{


await authService.resetPassword(
req.body
);



res.json({

success:true,

message:
"Password updated"

});


}
catch(error){


res.status(400).json({

success:false,

message:error.message

});


}

};

module.exports={
    signup,
    login,
    refreshToken,
    logout,
    verifyEmail,
    resendVerificationOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};
