const ApiError = require("../utils/ApiError");

const sendErrorForDev=(err,res)=>res.status(err.statusCode).json({
        status: err.status,
        error:err,
        msg:err.message,
        stack: err.stack,
    });

const sendErrorForProd=(err,res)=>res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
    });

const handelJwtInvalidSignature=()=>new ApiError("Invalid token ,please login again ...",401);

const handelJwtExpiredSignature=()=>new ApiError("Expired token ,please login again ...",401)

const globalError=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status|| 'error';

    if ( process.env.NODE_ENV==="development"){
        sendErrorForDev(err,res);
    }else {
        if ( err.name==="JsonWebTokenError"){
            err=handelJwtInvalidSignature();
        }
        if ( err.name==="TokenExpiredError"){
            err=handelJwtExpiredSignature();
        }
        sendErrorForProd(err,res)
    }
};

module.exports=globalError;

