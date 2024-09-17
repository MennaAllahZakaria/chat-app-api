const userRoute=require('./userRoute');
const authRoute=require('./authRoute');
const roomRoute=require('./roomRoute');
const messageRoute=require('./messageRoute');
const privateMessageRoute=require('./privateMessageRoute');
const chatRoute= require('./chatRoute')

const mountRoutes=(app)=>{
    app.use('/api/v1/users',userRoute);
    app.use('/api/v1/auth',authRoute);
    app.use('/api/v1/rooms',roomRoute);
    app.use('/api/v1/messages',messageRoute);
    app.use('/api/v1/messages/private',privateMessageRoute);
    app.use('/api/v1/chats',chatRoute);

};

module.exports=mountRoutes;