import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { BASE_URL } from "./config";
=======
import {BASE_URL} from './config';
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7

function Room_Reservation() {
  const [activeSection, setActiveSection] = useState("General");
  const [occupiedBeds, setOccupiedBeds] = useState([]); // Beds occupied by check-in
  const [reservationData, setReservationData] = useState([]);
  const [assignBed, setAssignBed] = useState([]); // Package assigned beds
  const [packageBeds, setPackageBeds] = useState([]); // Package beds with "package" status
  const [allOccupiedBeds, setAllOccupiedBeds] = useState(new Set());
  const Floor1 = 8;
  const Floor3 = 8;
  const Floor4 = 4;
  const Floor5 = 4;

  // Fetch reservation check-in data
  const getdata = async () => {
    try {
      const reservationdata = await fetch(
<<<<<<< HEAD
        `${BASE_URL}/reservation_charges`
=======
        `${BASE_URL}reservation_charges`
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
      );
      const data = await reservationdata.json();
      const occupiedBeds = data
        .filter(
          (item) =>
            item.checkStatus === "Check In" || item.checkStatus === undefined
        )
        .map((item) => item.AssignBedno);
      setReservationData(data);
      setOccupiedBeds(occupiedBeds);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    }
  };

  // Fetch package modification data
  const packagedata = async () => {
    try {
      const packdata = await fetch(
<<<<<<< HEAD
        `${BASE_URL}/Package_modification`
=======
        `${BASE_URL}Package_modification`
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
      );
      const result = await packdata.json();
      const assignedBeds = result.map((item) => item.AssignBedno);
      setAssignBed(assignedBeds);
    } catch (error) {
      console.error("Error fetching package data:", error);
    }
  };

  // Fetch only beds with packageStatus = "package"
  const packgeModify = async () => {
    try {
      const packdata = await fetch(
<<<<<<< HEAD
        `${BASE_URL}/Package_modification`
=======
        `${BASE_URL}Package_modification`
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
      );
      const result = await packdata.json();
      const packageBeds = result
        .filter((item) => item.packageStatus === "package")
        .map((item) => item.AssignBedno);
      setPackageBeds(packageBeds);
    } catch (error) {
      console.error("Error fetching package modification data:", error);
    }
  };

  useEffect(() => {
    getdata();
    packagedata();
    packgeModify();
  }, []);

  // Update occupied beds excluding package beds
  useEffect(() => {
    const occupiedSet = new Set([...occupiedBeds, ...assignBed]);
    packageBeds.forEach((bed) => occupiedSet.delete(bed)); // Remove package beds
    setAllOccupiedBeds(occupiedSet);
  }, [occupiedBeds, assignBed, packageBeds]);

  const isBedOccupied = (bedNumber) => allOccupiedBeds.has(String(bedNumber));

  return (
    <>
      <div className="container-fluid roomreservation">
        <div className="dashboard-section3">
          <div className="col-md-3">
            <div
              className={`contenttitle card4 ${activeSection === "General" ? "active" : ""
                }`}
            >
              <button onClick={() => setActiveSection("General")}>
                <label>General</label>
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`contenttitle card5 ${activeSection === "Semi-Special" ? "active" : ""
                }`}
            >
              <button onClick={() => setActiveSection("Semi-Special")}>
                <label>Semi-Special</label>
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`contenttitle card6 ${activeSection === "Special" ? "active" : ""
                }`}
            >
              <button onClick={() => setActiveSection("Special")}>
                <label>Special</label>
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-roombtn">
          <div className="col-md-12">
            <div
              className={`contenttitle  ${activeSection === "General" ? "active" : ""
                }`}
            >
              <button onClick={() => setActiveSection("General")}>
                <label>General</label>
              </button>
            </div>
          </div>
          <div className="col-md-12">
            <div
              className={`contenttitle  ${activeSection === "Semi-Special" ? "active" : ""
                }`}
            >
              <button onClick={() => setActiveSection("Semi-Special")}>
                <label>Semi-Special</label>
              </button>
            </div>
          </div>
          <div className="col-md-12">
            <div
              className={`contenttitle  ${activeSection === "Special" ? "active" : ""
                }`}
            >
              <button onClick={() => setActiveSection("Special")}>
                <label>Special</label>
              </button>
            </div>
          </div>
        </div>

        {/* General section */}
        {activeSection === "General" && (
          <div className="row roomsection">
            <div className="col-md-2">
              <h1 className="roomno">
                1<sup>st</sup> Floor
              </h1>
            </div>
            <div className="col-md-10 roomcard-container">
              {Array.from({ length: Floor1 }, (_, i) => {
                const bedNumber = i + 1;
                const isOccupied = isBedOccupied(String(bedNumber));
                return (
                  <div
                    key={i}
                    className={`room-link roomcard ${isOccupied ? "occupied" : "avaliblebed"
                      }`}
                  >
                    {isOccupied ? (
                      <>
                        <h6>Bed No</h6>
                        <h5>{bedNumber}</h5>
                        <h6>RN101</h6>
                        <div className="occupied-message">
                          Bed already occupied
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/reservation_confirmation/${bedNumber}`}
                        className="room-link "
                      >
                        <h6>Bed No</h6>
                        <h5>{bedNumber}</h5>
                        <h6>RN101</h6>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Semi-Special section */}
        {activeSection === "Semi-Special" && (
          <div className="row roomsection">
            <div className="col-md-2">
              <h1 className="roomno">
                3<sup>rd</sup> Floor
              </h1>
            </div>
            <div className="col-md-10 roomcard-container">
              {Array.from({ length: Floor3 }, (_, i) => {
                let roomName = "";
                let roomno = "";
                if (i < 2) {
                  roomName = `301${i === 0 ? "A" : "B"}`;
                  roomno = "RN301";
                } else if (i < 4) {
                  roomName = `302${i === 2 ? "A" : "B"}`;
                  roomno = "RN302";
                } else if (i < 6) {
                  roomName = `303${i === 4 ? "A" : "B"}`;
                  roomno = "RN303";
                } else if (i < 8) {
                  roomName = `304${i === 6 ? "A" : "B"}`;
                  roomno = "RN304";
                } else {
                  roomName = `Room ${i + 1}`;
                }
                const isOccupied = isBedOccupied(roomName);
                return (
                  <div
                    key={i}
                    className={`room-link roomcard ${isOccupied ? "occupied" : "avaliblebed"
                      }`}
                  >
                    {isOccupied ? (
                      <>
                        <h6>Bed No</h6>
                        <h5>{roomName}</h5>
                        <h6>{roomno}</h6>
                        <div className="occupied-message">
                          Bed already occupied
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/reservation_confirmation/${roomName}`}
                        className="room-link"
                      >
                        <h6>Bed No</h6>
                        <h5>{roomName}</h5>
                        <h6>{roomno}</h6>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="col-md-2">
              <h1 className="roomno">
                4<sup>th</sup> Floor
              </h1>
            </div>
            <div className="col-md-10 roomcard-container">
              {Array.from({ length: Floor4 }, (_, i) => {
                let roomName = "";
                let roomno = "";
                if (i < 2) {
                  roomName = `405${i === 0 ? "A" : "B"}`;
                  roomno = "RN405";
                } else if (i < 4) {
                  roomName = `406${i === 2 ? "A" : "B"}`;
                  roomno = "RN406";
                } else {
                  roomName = `Room ${i + 1}`;
                }
                const isOccupied = isBedOccupied(roomName);
                return (
                  <div
                    key={i}
                    className={`room-link roomcard ${isOccupied ? "occupied" : "avaliblebed"
                      }`}
                  >
                    {isOccupied ? (
                      <>
                        <h6>Bed No</h6>
                        <h5>{roomName}</h5>
                        <h6>{roomno}</h6>
                        <div className="occupied-message">
                          Bed already occupied
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/reservation_confirmation/${roomName}`}
                        className="room-link"
                      >
                        <h6>Bed No</h6>
                        <h5>{roomName}</h5>
                        <h6>{roomno}</h6>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="col-md-2">
              <h1 className="roomno">
                5<sup>th</sup> Floor
              </h1>
            </div>
            <div className="col-md-10 roomcard-container">
              {Array.from({ length: Floor5 }, (_, i) => {
                let roomName = "";
                let roomno = "";
                if (i < 2) {
                  roomName = `503${i === 0 ? "A" : "B"}`;
                  roomno = "RN503";
                } else if (i < 4) {
                  roomName = `506${i === 2 ? "A" : "B"}`;
                  roomno = "RN506";
                } else {
                  roomName = `Room ${i + 1}`;
                }
                const isOccupied = isBedOccupied(roomName);
                return (
                  <div
                    key={i}
                    className={`room-link roomcard ${isOccupied ? "occupied" : "avaliblebed"
                      }`}
                  >
                    {isOccupied ? (
                      <>
                        <h6>Bed No</h6>
                        <h5>{roomName}</h5>
                        <h6>{roomno}</h6>
                        <div className="occupied-message">
                          Bed already occupied
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/reservation_confirmation/${roomName}`}
                        className="room-link"
                      >
                        <h6>Bed No</h6>
                        <h5>{roomName}</h5>
                        <h6>{roomno}</h6>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special section */}
        {activeSection === "Special" && (
          <div className="row roomsection">
            <div className="col-md-2">
              <h1 className="roomno">
                4<sup>th</sup> Floor
              </h1>
            </div>
            <div className="col-md-10 roomcard-container">
              {Array.from({ length: Floor4 }, (_, i) => {
                const bedNumber = i + 401;
                const isOccupied = isBedOccupied(String(bedNumber));
                return (
                  <div
                    key={i}
                    className={`room-link roomcard ${isOccupied ? "occupied" : "avaliblebed"
                      } `}
                  >
                    {isOccupied ? (
                      <>
                        <h6>Bed No</h6>
                        <h5>{bedNumber}</h5>
                        <h6>RN{bedNumber}</h6>
                        <div className="occupied-message">
                          Bed already occupied
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/reservation_confirmation/${bedNumber}`}
                        className="room-link"
                      >
                        <h6>Bed No</h6>
                        <h5>{bedNumber}</h5>
                        <h6>RN{bedNumber}</h6>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="col-md-2">
              <h1 className="roomno">
                5<sup>th</sup> Floor
              </h1>
            </div>
            <div className="col-md-10 roomcard-container">
              {Array.from({ length: Floor5 }, (_, i) => {
                const bedNumber = i + 501;
                const isOccupied = isBedOccupied(String(bedNumber));
                return (
                  <div
                    key={i}
                    className={`room-link roomcard ${isOccupied ? "occupied" : ""
                      }`}
                  >
                    {isOccupied ? (
                      <>
                        <h6>Bed No</h6>
                        <h5>{bedNumber}</h5>
                        <h6>RN{bedNumber}</h6>
                        <div className="occupied-message">
                          Bed already occupied
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/reservation_confirmation/${bedNumber}`}
                        className="room-link"
                      >
                        <h6>Bed No</h6>
                        <h5>{bedNumber}</h5>
                        <h6>RN{bedNumber}</h6>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Room_Reservation;
