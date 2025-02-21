
import generalbed from "../logo/generalbed.png";
import semibed from "../logo/semibed.png";
import specialbed from "../logo/specialbed.png";
import React, { useState, useEffect } from 'react';

import { BASE_URL } from "./config";

import {BASE_URL} from './config';

function Dashbord_Card() 
{

  const [assignBed, setAssignBed] = useState([]);
  const [occupiedBedsCount, setOccupiedBeds] = useState([]);
  const [Occuipecount, setOccuipecount] = useState(0);
  const [GeneralRooomOccupied, setGeneralRoom] = useState(0);
  const [SpecialRoomOccupied, setSemSpecialRoom] = useState(0);
  const [SpecRoomOccupied, setSpecialRoom] = useState(0);
  const [packageBeds, setPackageBeds] = useState(0); 
  const[packageGenralRoom,setPackageGeneralRoom]= useState(0);
  const[packageSemiRoom,setPackageSemiSpecialRoom]= useState(0);
  const[packageSpecialRoom,setPackageSpecialRoom]= useState(0);
  
  const getdata = async () => {
  try {

    const response = await fetch(`${BASE_URL}/reservation_charges`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
   
    if (!Array.isArray(data)) {
      console.warn("Invalid data format, converting to an empty array:", data);
      data = []; 
    }

    const occupiedBeds = data
      .filter(item => item.checkStatus === "Check In" || item.checkStatus === undefined)
      .map(item => item.AssignBedno);
    
    setOccupiedBeds(occupiedBeds.length);

    setGeneralRoom(
      data.filter(item => (item.checkStatus === "Check In" || item.checkStatus === undefined) && item.RoomCategory === "General").length
    );

    setSemSpecialRoom(
      data.filter(item => (item.checkStatus === "Check In" || item.checkStatus === undefined) && item.RoomCategory === "Semi-Special").length
    );

    setSpecialRoom(
      data.filter(item => (item.checkStatus === "Check In" || item.checkStatus === undefined) && item.RoomCategory === "Special").length
    );

  } catch (error) {
    console.error("Error fetching reservation data:", error);
  }
};

const packagedata = async () => {
  try {

    const response = await fetch(`${BASE_URL}/Package_modification`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let result = await response.json();
    if (!Array.isArray(result)) {
      console.warn("Invalid data format, converting to an empty array:", result);
      result = [];
    }
    const assignedBeds = result.map(item => item.AssignBedno);
    setOccuipecount(assignedBeds.length);
    setAssignBed(assignedBeds);
  } catch (error) {
    console.error("Error fetching package data:", error);
  }
};

const packgeModify = async () => {
  try {

    const response = await fetch(`${BASE_URL}/Package_modification`);


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let result = await response.json();
    if (!Array.isArray(result)) {
      console.warn("Invalid data format, converting to an empty array:", result);
      result = [];
    }
    const packageBeds = result.filter(item => item.status === "modify").map(item => item.AssignBedno);
    setPackageBeds(packageBeds.length);

    setPackageGeneralRoom(
      result.filter(item => 
        item.status === "modify" && 
        item.NewRoomCategory === "General" && 
        item.packageStatus !== "package" && 
        item.packageStatus === undefined
      ).length
    );

    setPackageSemiSpecialRoom(
      result.filter(item => 
        item.status === "modify" && 
        item.NewRoomCategory === "Semi-Special" && 
        item.packageStatus !== "package" && 
        item.packageStatus === undefined
      ).length
    );

    setPackageSpecialRoom(
      result.filter(item => 
        item.status === "modify" && 
        item.NewRoomCategory === "Special" && 
        item.packageStatus !== "package" && 
        item.packageStatus === undefined
      ).length
    );

  } catch (error) {
    console.error("Error fetching package modification data:", error);
  }
};





  useEffect(() => {
    getdata();
    packagedata();
    packgeModify();
  }, []);

  return (

    <div className='card-container'>
    <div className="d-card">
      <div className="text">
        <div className="row">
        <h2 className="topictitle">Total Beds <span><i className="fa fa-bed cardicon" aria-hidden="true" ></i></span><br/><label className='totalcalculation'>32</label></h2>
        </div>  
        <div className="row">
          <div className='cardlabel'>
            <label className='cardlabel1'>Available<br/>
            <i className="mdi mdi-arrow-top-right  icon-item"></i>
            <label className="count">{32- occupiedBedsCount-Occuipecount}</label></label>
            <label className='cardlabel2'>Occupied<br/>
            <i className="mdi mdi-arrow-bottom-right icon-item"></i>
            <label className="count">{occupiedBedsCount + Occuipecount}</label></label>
          </div>
        </div>
      </div>
    </div>
    <div className="d-card">
      <div className="text">
        <div className="row">
        <h2 className="topictitle">Genral Beds <span><img className='cardicon' src={generalbed} alt="generalbed"  /></span><br/><label className='totalcalculation'>8</label></h2>
        </div>  
        <div className="row">
          <div className='cardlabel'>
            <label className='cardlabel1'>Available<br/>
            <i className="mdi mdi-arrow-top-right  icon-item"></i>
            <label className="count">{8-GeneralRooomOccupied-packageGenralRoom}</label></label>
            <label className='cardlabel2'>Occupied <br/>
            <i className="mdi mdi-arrow-bottom-right icon-item"></i>
            <label className="count">{GeneralRooomOccupied+packageGenralRoom}</label></label>
          </div>
        </div>
      </div>
    </div>
    <div className="d-card">
      <div className="text">
        <div className="row">
        <h2 className="topictitle">Semi-Special Beds<span><img className='cardicon' src={semibed} alt="semigenerlbed"  /></span><br/><label className='totalcalculation'>16</label></h2>
        </div>  
        <div className="row">
          <div className='cardlabel'>
            <label className='cardlabel1'>Available<br/>
             <i className="mdi mdi-arrow-top-right  icon-item"></i> <label className="count">{16-SpecialRoomOccupied-packageSemiRoom}</label></label>
            <label className='cardlabel2'>Occupied<br/>
            <i className="mdi mdi-arrow-bottom-right icon-item"></i>
            <label className="count">{SpecialRoomOccupied+packageSemiRoom}</label></label>
          </div>
        </div>
      </div>
    </div>
    <div className="d-card">
      <div className="text">
        <div className="row">
        <h2 className="topictitle">Special Beds<span><img className='cardicon' src={specialbed} alt="specialbed"  /></span><br/><label className='totalcalculation'>8
          </label></h2>
        </div>  
        <div className="row">
          <div className='cardlabel'>
            <label className='cardlabel1'>Available<br/>
            <i className="mdi mdi-arrow-top-right  icon-item"></i>
            <label className="count">{8-SpecRoomOccupied-packageSpecialRoom}</label></label>
            <label className='cardlabel2'>Occupied<br/>
            <i className="mdi mdi-arrow-bottom-right icon-item"></i>
            <label className="count">{SpecRoomOccupied+packageSpecialRoom}</label></label>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Dashbord_Card