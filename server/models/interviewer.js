const mongoose = require('mongoose');

const InterviewerSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    }
})

// const Interviewer = mongoose.model('Interviewer', InterviewerSchema);

// module.exports.InterviewerSchema = InterviewerSchema;
// module.exports.Interviewer = Interviewer;

module.exports = mongoose.model('Interviewer', InterviewerSchema);