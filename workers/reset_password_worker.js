const queue = require('../config/kue');

const resetMailer = require('../mailers/reset_password_mailer');

queue.process('resetpassword',function(job,done){
    console.log('emails worker is processing a job',job.data);

    resetMailer.newToken(job.data);
    done();
});