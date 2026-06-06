const express=require("express");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const authRoutes=require("./routes/auth.routes");
const userRoutes =require("./routes/user.routes");

const app=express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//health check route
app.use("/api/v1/auth",
    authRoutes
);

app.use(
"/api/v1/users",
userRoutes
);

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"AuthX API running"
    });
});

module.exports=app;