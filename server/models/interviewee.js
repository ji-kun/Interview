const mongoose = require('mongoose');

const IntervieweeSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, unique: true, required: true,
        validate: {
            validator: function (email) {
                const emailID = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailID.test(email);
            },
            message: 'Invalid Email ID'
        }
    },
    phone: {
        type: String,
        validate: {
            validator: function (phone) {
                return (phone && phone.length === 10 && phone[0] != '0')
            }
        }
    },
    resume: {
        data: Buffer,
        contentType: String
    }
})

// const Interviewee = mongoose.model('Interviewee', IntervieweeSchema);

// module.exports.IntervieweeSchema = IntervieweeSchema;
// module.exports.Interviewee = Interviewee;

module.exports = mongoose.model('Interviewee', IntervieweeSchema);
