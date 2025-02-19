import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useParams } from "react-router";
import maleimg from '../logo/malelogo.svg';
import femalimg from '../logo/femalelogo.svg';
import checkicon from '../logo/checkbox-icon.svg'
import { useNavigate } from "react-router";
import "./css/card.css";
import { BASE_URL } from "../components/config";

const CheckIn = () => {
  const [checkdata, setCheckdata] = useState([]); 
  const [isActive, setIsActive] = useState(true);
  const [chckedinDate,setChekindate]= useState();
  const [showModal,setModel]= useState(false);
  const { resid } = useParams();
  const Navigate =useNavigate()
  const [patientname,setPatientname]= useState();
  const [attdencename,setAttdename]= useState();
  const [AssginPackage,setPackage]= useState();
  const [id,setpatientid]= useState();
  const [getgender,setGender]= useState();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/checkin/${resid}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        const patientid =result.map((item)=>item.patientid)[0];
        setpatientid(patientid)
        const formatter = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const updatedData = result.map((item) => {
        const fromDate = new Date(item.fromDate);
        const toDate = new Date(item.toDate);
        const formattedCheckinDate = formatter.format(fromDate);

          setPatientname(item.patientname);
          setChekindate(formattedCheckinDate);

          const packageAssigned = (toDate - fromDate) / (1000 * 60 * 60 * 24);
          setPackage(packageAssigned);
          return { ...item, packageAssigned };
        });

        setCheckdata(updatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [resid]);

  const handleCheckIn = async ()  =>
  {
    const checkStatus = "Check In";
    let addcheckindata = await fetch(`${BASE_URL}/add_checkin/${resid}`,
    {
       method:"PUT",
       body: JSON.stringify({ checkStatus}),
       headers: {
           'Content-Type': 'application/json',
       },
    })
    const chcksubmit = await addcheckindata.json();
    if(chcksubmit)
    {
      setModel(true);
    };
    handleCheckIn();  
  };
  
  const handleCloseModal = () =>
  {
      Navigate('/')
  }

  useEffect(() => {
      const getattdencedata = async () => {
        try {
          const response = await fetch(`${BASE_URL}/get_attdent`);
          const data = await response.json();
          const latestPatientName = data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) 
          .map(item => item.patientname)[0]; 
           setAttdename(latestPatientName);
        
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      getattdencedata();
    }, []);

    useEffect(() => {
      const patientdata = async () => {
        try {
          const response2 = await fetch(`${BASE_URL}/search_registration/${id}`);
          const data = await response2.json();
          const gender = data.map((item) => item.gender)[0];
          console.log(gender)
          setGender(gender);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      };
  
      if (id) {
        patientdata();
      }
    }, [id]);
  
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? "sidebar-open" : "sidebar-closed"}>
        <section className="section-card sectioncard ">
        <div className="card1">
        {checkdata.map((data, index) => (
            <div className="profile-card" key={index}>
                <div className="card-continer">
                {getgender === 'Male' ? (
                 <img src={maleimg} alt="Male" className="imgs" />
               ) : (
                 <img src={femalimg} alt="Female"  className="imgs" />
               )}
                </div>
                <div className="rightcard-container">
                  <h3 className="card-titles titlecard">Patient Details</h3>
                  <div className="profile-details">
                <div className="detail-row">
                    <span className="label">Patient Name </span>
                    <span className="value"> {data.patientname}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Attendant Name </span>
                    <span className="value"> {attdencename}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Room Type </span>
                    <span className="value"> {data.RoomCategory}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Bed Number </span>
                    <span className="value">{data.AssignBedno}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Package Assigned </span>
                    <span className="value">{AssginPackage}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Recommended By </span>
                    <span className="value">{data.doctor}</span>
                </div>
                <div className="detail-row">
                    <span className="label">CheckIn Date </span>
                    <span className="value">{chckedinDate} 5:30:00 AM</span>
                </div>
                 <div className="card-btn">
                 <button className="btn btn-info checkin" onClick={handleCheckIn}>Check In</button>
                </div>
            </div>  
            </div>
          </div>
        ))}
        </div>
    </section>
      </div>
      
      {showModal && (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <div style={styles.icon}>
            <img src={checkicon} height={120} width={120} alt="chekin" /></div>
          <h4 className="mt-3" style={styles.title}>Checked In Succsessfully</h4>
            <h5 style={{fontSize:"18px"}}>Checked Date : {chckedinDate}  5:30:00 AM</h5>
            <h5 style={{fontSize:"18px"}}>Patient Name : {patientname}</h5>
            <div style={styles.buttons}>
            <button className="btn btn-success mt-2" style={{width:"150px"}} onClick={handleCloseModal}>Home</button>
          </div>
        </div>
      </div>
      )} 
    </>
  );
};
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(79, 74, 74, 0.8)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, 
  },
  modal: {
    backgroundColor: "#0c1a32",
    color: '#fff',
    padding: '50px 30px 40px 30px',
    borderRadius: '25px',
    textAlign: 'center',
    width: 'fit-content',
    boxShadow: "rgb(211, 220, 230,0.4) 0px 0px 10px 1px",
    zIndex: 1001, 
    height:"400px",
  },
  icon: {
    fontSize: '50px',
    color: '#a370f0',
    marginBottom: '15px',
  },
  details: {
    fontSize: '14px',
    margin: '15px 0',
  },
 
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  button: {
    border: '10px !important',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
export default CheckIn;
