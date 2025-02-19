import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Room_Reservation from "./Room_Reservation";
import Dashboard_card from './Dashbord_Card'
import notfoundimage from '../logo/notfound.svg'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

function Dashboard() {
  const [isActive, setIsActive] = useState(true);
  const [reservationdata, setReservationData] = useState([]);
  const [Resrvedpatient, setReservedPatient] = useState(false);
  const [Booking, setBooking] = useState(true);
  const [chckedpatient, setCheckedPatient] = useState(false);
  const [chcekpatiendata, setCheckedPatientData] = useState([]); 
  const [getid, setGetid] = useState([]);
  const [attdentData, setAttdentData] = useState([]);
  const [matchedData, setMatchedData] = useState(null);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Booking"); 
  const [showModal, setModel] = useState(false);

  const handleButtonClick = (buttonName, action) => 
  {
    setActiveButton(buttonName); 
    action(); 
  };
  useEffect(() => 
  {
    if (!localStorage.getItem("user")) 
    {
      navigate("/");
    }
  }, []);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const Bookingroom = () => {
    setReservedPatient(false);
    setBooking(true);
    setCheckedPatient(false);
  };

  const CheckedPatients = async () => {
    try {
      const [reservationRes, patientRes] = await Promise.all([
        fetch("http://localhost:4000/reservation_charges"),
        fetch("http://localhost:4000/registration_reserved_patient"),
      ]);
  
      if (!reservationRes.ok || !patientRes.ok) {
        setModel(true)
        return;
      }
      const reservationData = await reservationRes.json();
      const patientData = await patientRes.json();
      const formattedReservationData = reservationData.map((item) => {
      return {
        ...item, 
        id: item._id,
        fromDate: new Date(item.fromDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        toDate: new Date(item.toDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        prinumber: patientData.find((patient) => patient._id === item.patientid)
          ?.prinumber || "N/A",
      };
    });
  
      const checkedInPatients = formattedReservationData.filter(
        (item) => item.checkStatus === "Check In"
      );
  
      setCheckedPatientData(checkedInPatients);
      setCheckedPatient(true);
      setReservedPatient(false);
      setBooking(false);
    } catch (error) {
      setModel(true)
    }
  };
  
  const ReserverPatient = async () => {
    try {
      const [reservationRes, patientRes] = await Promise.all([
        fetch("http://localhost:4000/reservation_charges"),
        fetch("http://localhost:4000/registration_reserved_patient"),
      ]);
  
      if (!reservationRes.ok || !patientRes.ok) {
        setModel(true)
        return;
      }
      const reservationData = await reservationRes.json();
      const patientData = await patientRes.json();
      const formattedReservationData = reservationData.map((item) => ({
        ...item,
        fromDate: new Date(item.fromDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        toDate: new Date(item.toDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        prinumber:
          patientData.find((patient) => patient._id === item.patientid)
            ?.prinumber || "N/A",
      }));

      const reservedPatients = formattedReservationData.filter(
        (item) => item.checkStatus !== "Check In" && item.checkStatus !== "Check Out"
      );
      
      setReservationData(reservedPatients);
      setReservedPatient(true);
      setCheckedPatient(false);
      setBooking(false);
    } catch (error) {
      setModel(true)
    }
  };
  
  useEffect(() => {
    const patientdata = async () => {
      try {
        let response = await fetch('http://localhost:4000/patient_registration_api');
        if (!response.ok) {
          throw new Error("Error Api");
        }
        let data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Expected an array but got: " + typeof data);
        }
        const patid = data.map((item) => item._id);         
        setGetid(patid);
      } catch (error) {
        console.error("Error fetching patient data:", error.message);
      }
    };
  
    patientdata();
  }, []);
 

  useEffect(() => {
    const getattdentdata = async () => {
      try {
        let response = await fetch('http://localhost:4000/chckedattdent');
        if (response.status === 404) {
          console.warn('No Record');
          setAttdentData([]); 
          return;
        }
        if (!response.ok) {
          throw new Error("error upi");
        }
        let data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setAttdentData(data);
        } else {
          console.warn('No attendance data found.');
          setAttdentData([]);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error.message);
      }
    };
  
    getattdentdata();
  }, []);
  
  
  useEffect(() => {
    if (getid.length > 0 && attdentData.length > 0) {
      const match = attdentData.find((item) => getid.includes(item.pid));
      if (match) {
        setMatchedData(match);
      }
    }
  }, [getid, attdentData]);
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
       <Dashboard_card/>
    <div className="container dashboard-section2">
      <div className="col-md-3">
        <div className={`contenttitle card1 ${activeButton === "Booking" ? "active" : ""}`}>
          <button onClick={() => handleButtonClick("Booking", Bookingroom)} className="full-button">
            Booking
          </button>
        </div>
      </div>
        <div className="col-md-3">
          <div className={`contenttitle card2 ${activeButton === "Checked-In Patients" ? "active" : ""}`}>
            <button onClick={() => handleButtonClick("Checked-In Patients", CheckedPatients)} className="full-button">
              Checked-In Patients
            </button>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`contenttitle card3 ${activeButton === "Reserved Patients" ? "active" : ""}`}>
            <button onClick={() => handleButtonClick("Reserved Patients", ReserverPatient)} className="full-button">
              Reserved Patients
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-button">
      <div className="col-md-12">
        <div className={`contenttitle card1 ${activeButton === "Booking" ? "active" : ""}`}>
          <button onClick={() => handleButtonClick("Booking", Bookingroom)} className="full-button">
            Booking
          </button>
        </div>
      </div>
        <div className="col-md-12">
          <div className={`contenttitle card2 ${activeButton === "Checked-In Patients" ? "active" : ""}`}>
            <button onClick={() => handleButtonClick("Checked-In Patients", CheckedPatients)} className="full-button">
              Checked-In Patients
            </button>
          </div>
        </div>
        <div className="col-md-12">
          <div className={`contenttitle card3 ${activeButton === "Reserved Patients" ? "active" : ""}`}>
            <button onClick={() => handleButtonClick("Reserved Patients", ReserverPatient)} className="full-button">
              Reserved Patients
            </button>
          </div>
        </div>
      </div>
        {/* Conditionally Render Booking */}
        {Booking && <Room_Reservation />}

        <div className="mt-4">
          {/* Reserved Patients Table */}
          {Resrvedpatient && (
            <div className="chckout-card">
              <Table className="Table-striped">
                <Thead>
                  <Tr>
                    <Th>Sr.No</Th>
                    <Th>Patient Name</Th>
                    <Th>Mobile Number</Th>
                    <Th>Bed Number</Th>
                    <Th>From Date</Th>
                    <Th>To Date</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reservationdata.length > 0 ? (
                    reservationdata.map((resdata, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{resdata.patientname}</Td>
                        <Td>{resdata.prinumber}</Td>
                        <Td>{resdata.AssignBedno}</Td>
                        <Td>{resdata.fromDate}</Td>
                        <Td>{resdata.toDate}</Td> 
                        <Td>
                          <Link to={`/checkin/${resdata._id}`}>
                            <button className="btn btn-info">Check In</button>
                          </Link>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="7">No records..</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Checked-In Patients Table */}
        <div className="container mt-4">
          {chckedpatient && (
            <div className="container chckout-card">
              <Table className="Table-striped">
                <Thead>
                  <Tr>
                    <Th>Sr.No</Th>
                    <Th>Patient Name</Th>
                    <Th>Attendant Name</Th>
                    <Th>Mobile Number</Th>
                    <Th>Bed Number</Th>
                    <Th>From Date</Th>
                    <Th>To Date</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {chcekpatiendata.length > 0 ? (
                    chcekpatiendata.map((chckingdata, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{chckingdata.patientname}</Td>
                        <Td>{matchedData?.patientname || "-"}</Td>
                        <Td>{chckingdata.prinumber}</Td>
                        <Td>{chckingdata.AssignBedno}</Td>
                        <Td>{chckingdata.fromDate}</Td>
                        <Td>{chckingdata.toDate}</Td> 
                        <Td>
                          <Link to={`/paymentsettlement/${chckingdata._id}`}>
                            <button className="btn btn-info">Check Out</button>
                          </Link>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="8">No record..</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Close Button */}
            <button style={styles.closeButton} onClick={() => setModel(false)}>×</button>

            <div style={styles.icon}>
              <img src={notfoundimage} height={120} width={120} alt="Check Icon" />
            </div>
            <h4 style={styles.title}>No Record...</h4>
          </div>
        </div>
      )}

    </>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#94a3b8",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    position: "relative",
    width: "300px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "25px",
    cursor: "pointer",
    color: "black",
  },
  icon: {
    marginBottom: "10px",
  },
  title: {
    fontSize: "18px",
    color: "black",
  },
};

export default Dashboard;
