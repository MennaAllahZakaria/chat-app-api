const multer  = require('multer')

const ApiError=require('../utils/ApiError');

const multerOptions=()=>{
    
const multerStorge=multer.memoryStorage();

const multerFilter=function(req, file, cb) {
    if ( file.mimetype.startsWith('image')){
        cb(null,true);;
    }else{
        cb(new ApiError('Only images allowed',400));
    }

}
const upload = multer({ storage:multerStorge,
                        fileFilter:multerFilter,
    })

    return upload;
}
exports.uploadSingleImage=(fieldName)=>multerOptions().single(fieldName)


exports.uploadMixofImages=(arayOfFields)=>multerOptions().fields(arayOfFields)