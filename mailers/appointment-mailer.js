const nodemailer = require('../config/nodemailer');

exports.appointment = function(patient){

    let htmlString = nodemailer.renderTemplate({patient: patient}, '/appointment.ejs');
    nodemailer.transporter.sendMail({
        from: patient.email,
        to: 'dharmeshkota123@gmail.com',
        subject: 'Appointment Booked!',
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error while sending the Mail! ', err);
            return;
        }

        console.log('Link Sent!');
    });

}