// @desc  this class is responsible about operation errors ( errors that i can predict)

class ApiError extends Error{

    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode
        this.status=`${statusCode}`.startsWith(4)?'fail':'error'; 
        this.msg=message;
        this.isOperational=true;
        
        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports=ApiError;