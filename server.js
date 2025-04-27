const path=require('path');

const express=require("express");
const cors=require('cors');
const compression=require('compression');

const http = require('http');
const socketIo = require('socket.io');
const socketHandlers = require('./socket/socket');

const dotenv=require("dotenv");
const morgan=require("morgan");

// Load environment variables
dotenv.config({path:"config.env"});

const dbConnection=require('./config/database');
const ApiError=require("./utils/ApiError");
const globalError=require('./middelwares/errorMiddleware');

const mountRoutes=require('./routes/index')

//exress app
const app=express();

//cors -> other domains can access our app
app.use(cors());
app.options('*',cors());

//compression -> compress all responses
app.use(compression());

const server = http.createServer(app);
const io = socketIo(server);
// connect to DB
dbConnection();

app.use(express.json());

app.use(express.urlencoded({extended:true})); // form-data
const Verification = require("./models/codeModel");

const deleteExpiredVerifications = async () => {
    const now = new Date();

    try {
        // Find all expired records
        const expiredVerifications = await Verification.find({
        expiresAt: { $lt: now },
        });

        // Delete all expired records
        await Verification.deleteMany({
        _id: { $in: expiredVerifications.map((v) => v._id) },
        });

        console.log(
        `${expiredVerifications.length} expired verifications deleted.`
        );
    } catch (err) {
        console.error("Error deleting expired verifications:", err);
    }
};

// Call the function
deleteExpiredVerifications();
// HTTP request logger for development
app.use(morgan('dev'));

//Mount route

mountRoutes(app);

// Initialize socket handlers
socketHandlers(io);

app.all('*',(req,res,next)=>{
    // create error and send it to error handling middleware
        next(new ApiError(`cannot find this route : ${req.originalUrl}`,400))
    });

    // global error handling middleware
    app.use(globalError);

    const PORT=process.env.PORT|| 5000;

    server.listen(PORT,()=>{
        console.log(`App Running on port ${PORT}`);
    });

    process.on("unhandledRejection",(err)=>{
        console.log(`UnhandledRejection Errors: ${err}`);
        server.close(()=>{
            console.error('Shutting Down...');
            process.exit(1);
        })
        
    });