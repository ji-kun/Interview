import React, { useState, useEffect } from "react";
import Axios from "axios";

import styles from "./Dashboard.module.css";
import Modal from "react-modal";

import dummy from "../assets/calendar.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Dashboard(props) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const [upcoming, setUpcoming] = useState([]);
  const [interviewees, setInterviewees] = useState([]);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal(index) {
    setId(upcoming[index]._id);
    setEmail(upcoming[index].intervieweeEmail);
    setStartTime(upcoming[index].startTime);
    setEndTime(upcoming[index].endTime);
    setDescription(upcoming[index].description);
    setMeetLink(upcoming[index].meetLink);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleClick = () => {
    const config = {
      headers: { Authorization: `Bearer ${props.token}` },
    };

    const bodyParameters = {
      interviewId: id,
      intervieweeEmail: email,
      startTime: startTime,
      endTime: endTime,
      description: description,
      meetLink: meetLink,
    };

    Axios.post("http://localhost:8000/update", bodyParameters, config)
      .then(alert("Interview Created Successfully"))
      .catch((error) => alert(error));

    closeModal();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${props.token}` },
    };

    const bodyParameters = {
      intervieweeEmail: email,
      startTime: startTime,
      endTime: endTime,
      description: description,
      meetLink: meetLink,
    };

    Axios.post("http://localhost:8000/create", bodyParameters, config)
      .then(alert("Interview Created Successfully"))
      .catch((error) => alert(error));
  };

  // console.log("Props", props);

  useEffect(() => {
    console.log("Random");
    Axios.get("http://localhost:8000/interviewee")
      .then((response) => {
        console.log(response.data);
        setInterviewees(response.data);
      })
      .catch((error) => {
        alert(error);
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    // event.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${props.token}` },
    };
    Axios.get("http://localhost:8000/interviews", config)
      .then((response) => {
        setUpcoming(response.data);
      })
      .catch((error) => {
        alert(error);
        console.log("error", error);
      });
  }, [upcoming]);

  return (
    <div className={styles.container}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form className={styles.formInModal} onSubmit={handleClick}>
          <input
            type="email"
            required
            name="interviewee-email"
            value={email}
            placeholder="Enter Interviewee Email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="datetime"
            required
            name="start-time"
            value={startTime}
            placeholder="Enter Start Time"
            onChange={(event) => setStartTime(event.target.value)}
          />
          <input
            type="datetime"
            required
            name="end-time"
            value={endTime}
            placeholder="Enter End Time"
            onChange={(event) => setEndTime(event.target.value)}
          />
          <input
            type="text"
            name="description"
            value={description}
            placeholder="Enter Description"
            onChange={(event) => setDescription(event.target.value)}
          />
          <input
            type="text"
            required
            name="meet-link"
            value={meetLink}
            placeholder="Enter Meet Link"
            onChange={(event) => setMeetLink(event.target.value)}
          />
          <input className={styles.submit} type="submit" value="submit" />
        </form>
      </Modal>
      <div className={styles.left}>
        <h2>Upcoming Interviews</h2>
        <div className={styles.cardDisplay}>
          {upcoming.map((ele, key) => (
            <div className={styles.upcoming__card} key={key}>
              <div>
                <span className={styles.smallHeader}> Description : </span>
                {ele.description}
              </div>
              <div>
                <span className={styles.smallHeader}> Email : </span>
                {ele.intervieweeEmail}
              </div>
              <div>
                <span className={styles.smallHeader}> Start time : </span>
                {ele.startTime}
              </div>
              <div>
                <span className={styles.smallHeader}> End time : </span>
                {ele.endTime}
              </div>
              <div className={styles.action}>
                <a style={{ textDecoration: "none" }} href={ele.meetLink}>
                  <div className={styles.joinButton}>Join Meeting</div>
                </a>
                <div
                  className={styles.submitButton}
                  onClick={() => openModal(key)}
                >
                  Edit
                </div>
              </div>
            </div>
          ))}
        </div>
        <img src={dummy} className={styles.dummy} alt="placeholder" />
      </div>
      <div className={styles.right}>
        <h2>Schedule an Interview</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            name="interviewee-email"
            value={email}
            placeholder="Enter Interviewee Email"
            onChange={(event) => setEmail(event.target.value)}
          />
          {/* <select name="interviewee-email">
            {interviewees.map((ele, key) => {
              <option
                value={ele.email}
                key={key}
              >{`${ele.name} - ${ele.email}`}</option>;
            })}
          </select> */}
          <input
            type="datetime"
            required
            name="start-time"
            value={startTime}
            placeholder="Enter Start Time"
            onChange={(event) => setStartTime(event.target.value)}
          />
          <input
            type="datetime"
            required
            name="end-time"
            value={endTime}
            placeholder="Enter End Time"
            onChange={(event) => setEndTime(event.target.value)}
          />
          <input
            type="text"
            name="description"
            value={description}
            placeholder="Enter Description"
            onChange={(event) => setDescription(event.target.value)}
          />
          <input
            type="text"
            required
            name="meet-link"
            value={meetLink}
            placeholder="Enter Meet Link"
            onChange={(event) => setMeetLink(event.target.value)}
          />
          <input
            className={styles.submit}
            type="submit"
            value="CREATE INTERVIEW"
          />
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
