const userRoute=require('./userRoute');
const authRoute=require('./authRoute');
const roomRoute=require('./roomRoute');

const mountRoutes=(app)=>{
    app.use('/api/v1/users',userRoute);
    app.use('/api/v1/auth',authRoute);
    app.use('/api/v1/rooms',roomRoute);

};

module.exports=mountRoutes;