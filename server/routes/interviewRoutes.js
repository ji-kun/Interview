const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const debug = require("debug")("app:interview");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const Interviewer = require("../models/interviewer.js");
const Interviewee = require("../models/interviewee.js");
const Interviews = require("../models/interviews.js");

sgMail.setApiKey(
  "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"
);

const sendEmail = async (to, mailText) => {
  try {
    const msg = {
      to,
      from: "srinivasan.kunji@gmail.com",
      subject: "Your interview has been scheduled",
      text: mailText,
      html: `<strong>${mailText}</strong>`,
    };
    await sgMail.send(msg);
  } catch (error) {
    throw error;
  }
};

const validateInterviewSchedule = (
  interviews,
  isInterviewee,
  startTime,
  endTime
) => {
  interviews.map((interview) => {
    // console.log((interview.endTime < startTime || interview.startTime > endTime))
    // console.log(startTime, endTime, interview.startTime, interview.endTime)
    if (
      !(
        interview.endTime < new Date(startTime) ||
        interview.startTime > new Date(endTime)
      )
    ) {
      throw {
        statusCode: 401,
        message: `${
          isInterviewee ? "INTERVIEWEE" : "INTERVIEWER"
        } ALREADY SCHEDULED FOR ANOTHER INTERVIEW!`,
      };
    }
  });
};

router.get("/interview/:id", async (req, res) => {
  try {
    const interview = await Interviews.findById(req.params.id);
    if (!interview) {
      throw {
        statusCode: 401,
        message: "NO INTERVIEW FOUND",
      };
    }
    return res.status(200).json(interview);
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }
});

router.get("/interviewee", async (req, res) => {
  try {
    const interviewees = await Interviewee.find();
    if (!interviewees) {
      throw {
        statusCode: 401,
        message: "NO INTERVIEWEE FOUND",
      };
    }
    return res.status(200).json(interviewees);
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }
});

router.get("/interviews", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log(req.headers);

    if (!token) throw { status: 401, message: "Unauthorized" };

    const decodedToken = jwt.verify(token, "secretString");

    const { email } = decodedToken;
    const interviews = await Interviews.find({
      interviewerEmail: email,
      startTime: { $gte: new Date() },
    });
    if (!interviews) {
      throw {
        statusCode: 401,
        message: "NO UPCOMING INTERVIEWS FOUND",
      };
    }
    return res.status(200).json(interviews);
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }
});

router.post("/signup", async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  try {
    const dbUser = await Interviewer.findOne({ email });
    if (dbUser) throw { status: 400, message: "Interviewer already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const interviewer = await Interviewer.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = jwt.sign(
      {
        email: interviewer.email,
      },
      "secretString"
    );

    return res.status(200).json({
      token,
      message: "Interviewer created successfully",
    });
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  try {
    const interviewer = await Interviewer.findOne({ email });
    if (!interviewer) {
      throw {
        statusCode: 400,
        message: "USER not found!",
      };
    }

    // password = await bcrypt.hash(password, 10);

    console.log(bcrypt.compareSync(password, interviewer.password));

    if (!bcrypt.compareSync(password, interviewer.password)) {
      throw {
        statusCode: 401,
        message: "CREDENTIALS DO NOT MATCH!",
      };
    }

    const token = jwt.sign(
      {
        email: interviewer.email,
      },
      "secretString"
    );
    return res.status(200).json({ token });
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }

  next();
});

router.post("/create", async (req, res) => {
  const { intervieweeEmail, startTime, endTime, description, meetLink } =
    req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw { status: 401, message: "Unauthorized" };

  const decodedToken = jwt.verify(token, "secretString");
  console.log(decodedToken);

  const { email } = decodedToken;

  try {
    const fetchedIntervieweeInterviews = await Interviews.find({
      intervieweeEmail: req.body.intervieweeEmail,
    });

    // console.log(fetchedIntervieweeInterviews);
    if (fetchedIntervieweeInterviews) {
      validateInterviewSchedule(
        fetchedIntervieweeInterviews,
        true,
        startTime,
        endTime
      );
    }
    const fetchedInterviewerInterviews = await Interviews.find({
      interviewerEmail: email,
    });

    if (fetchedInterviewerInterviews) {
      validateInterviewSchedule(
        fetchedInterviewerInterviews,
        false,
        startTime,
        endTime
      );
    }

    const interview = await Interviews.create({
      interviewerEmail: email,
      intervieweeEmail,
      startTime,
      endTime,
      description,
      meetLink,
    });
    console.log("worked");
    await sendEmail(intervieweeEmail, description);

    return res.status(200).json(interview);
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }
});
router.post("/update", async (req, res) => {
  const {
    interviewId,
    intervieweeEmail,
    startTime,
    endTime,
    description,
    meetLink,
  } = req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw { status: 401, message: "Unauthorized" };

  const decodedToken = jwt.verify(token, "secretString");
  console.log(decodedToken);

  const { email } = decodedToken;

  try {
    const existingInterview = await Interviews.findById(interviewId);
    if (!existingInterview) {
      throw { status: 401, message: "NO SUCH INTERVIEW FOUND" };
    }

    console.log(
      new Date(startTime).toString(),
      new Date(existingInterview.startTime).toString(),
      new Date(endTime).toString(),
      new Date(existingInterview.endTime).toString()
    );

    if (
      !(
        new Date(startTime).toISOString() ==
          new Date(existingInterview.startTime).toISOString() &&
        new Date(endTime).toISOString() ==
          new Date(existingInterview.endTime).toISOString()
      )
    ) {
      const fetchedIntervieweeInterviews = await Interviews.find({
        intervieweeEmail: req.body.intervieweeEmail,
        _id: { $ne: interviewId },
      });

      // console.log(fetchedIntervieweeInterviews);
      if (fetchedIntervieweeInterviews) {
        validateInterviewSchedule(
          fetchedIntervieweeInterviews,
          true,
          startTime,
          endTime
        );
      }
      const fetchedInterviewerInterviews = await Interviews.find({
        interviewerEmail: email,
        _id: { $ne: interviewId },
      });

      if (fetchedInterviewerInterviews) {
        validateInterviewSchedule(
          fetchedInterviewerInterviews,
          false,
          startTime,
          endTime
        );
      }
    }
    const updatedInterview = await Interviews.findByIdAndUpdate(
      interviewId,
      {
        interviewerEmail: email,
        intervieweeEmail,
        startTime,
        endTime,
        description,
        meetLink,
      },
      { new: true }
    );

    return res.status(200).json(updatedInterview);
  } catch (err) {
    debug("Error", err.message);
    console.log("error", err.message);
    return res.status(400).json(err);
  }
});

module.exports = router;
