/* eslint-disable import/no-extraneous-dependencies */
const nodemailer=require('nodemailer')

const sendEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        service:"Gmail",
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        secure:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }

    });

    const mailOpts={
        from:process.env.EMAIL_FROM,
        to:options.email,
        subject:options.subject,
        messege:options.message,
        

    };


await transporter.sendMail(mailOpts);

} 


module.exports=sendEmail;