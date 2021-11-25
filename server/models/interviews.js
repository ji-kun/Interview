const mongoose = require('mongoose');

const InterviewsSchema = mongoose.Schema({
    interviewerEmail: {
        type: String, required: true,
        validate: {
            validator: function (email) {
                const emailID = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailID.test(email);
            },
            message: 'Invalid Email ID'
        }
    },
    intervieweeEmail: {
        type: String, required: true,
        validate: {
            validator: function (email) {
                const emailID = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailID.test(email);
            },
            message: 'Invalid Email ID'
        }
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    meetLink: {
        type: String,
        required: true
    }
})

// const Interviews = mongoose.model('Interviews', InterviewsSchema);

// module.exports.InterviewsSchema = InterviewsSchema;
// module.exports.Interviews = Interviews;

module.exports = mongoose.model('Interviews', InterviewsSchema);