import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import maleimg from '../logo/malelogo.svg';
import femalimg from '../logo/femalelogo.svg';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Link } from 'react-router';
import moment from 'moment';
<<<<<<< HEAD
import { BASE_URL } from "./config";
=======
import {BASE_URL} from './config';
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7

function Res_AccountDetails() {
  const [isActive, setIsActive] = useState(true);
  const [TransactionData, setTransactionData] = useState([]);
  const [trsctabledata, setTransData] = useState([]);
  const { id } = useParams();
  const [pid,setPatiebtid]=useState()
  const [patientid,setpatientid]=useState()
  const [paymentSettlementdata,setPaySettdata]=useState([])
  const [formdate,setFormdate]=useState()
  const [patientname,setpatientname]=useState()
  const [toDate,setgettoDate]=useState()
  const [trctodate,settranscatonDate]=useState()
  
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => 
  {
    const fetchHistory = async () => 
    {
<<<<<<< HEAD
      const response = await fetch(`${BASE_URL}/transactionHistory/${id}`);
=======
      const response = await fetch(`${BASE_URL}transactionHistory/${id}`);
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
      const data = await response.json();
      setTransactionData(data);
    } 
      fetchHistory();
  },[id])

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch(`${BASE_URL}/checkin_transctiondetails/${id}`);
=======
        const response = await fetch(`${BASE_URL}checkin_transctiondetails/${id}`);
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
        const result = await response.json();
        setTransData(Array.isArray(result) ? result : [result]);
        setPatiebtid(result._id);
        setpatientid(result.patientid);
       
        const formattedDates = moment(result.fromDate, "YYYY-MM-DD").format("DD MMM YYYY");
        setFormdate(formattedDates);

        const gettoDate = moment(result.toDate, "YYYY-MM-DD").format("DD MMM YYYY");
        setgettoDate(gettoDate);
        
        setpatientname(result.patientname);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
  
    fetchData();
  }, [id]);
  
  const [stopFetching, setStopFetching] = useState(false);
  
  useEffect(() => {
    const paymentSettlementdata = async () => {
      if (stopFetching) return; 

      try {
<<<<<<< HEAD
        const response = await fetch(`${BASE_URL}/checkout_settelment/${pid}`);
=======
        const response = await fetch(`${BASE_URL}checkout_settelment/${pid}`);
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
        if (!response.ok) {
          if (response.status === 404) {
            setPaySettdata([]); 
            setStopFetching(true); 
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return;
        }
        const result = await response.json();
        const transcatonDate = moment(result.transcatonDate, "YYYY-MM-DD").format("DD MMM YYYY");
        settranscatonDate(transcatonDate)
        setPaySettdata(Array.isArray(result) ? result : [result]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (pid && !stopFetching) {
      paymentSettlementdata();
    }
  }, [pid, stopFetching]);
  
  return (
    <>
       <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? "sidebar-open" : "sidebar-closed"}>
        <h1>Account Details</h1>
        <section className="section-card4 " >
            <div className="card1" >
            {TransactionData && (
              <>
                <div className="profile-card1" style={{height:"300px"}}>
                    <div className="card-continer1" >
                    {TransactionData.gender === 'Male' ? (
                        <img src={maleimg} alt="Male" className='resimg1'/>
                      ) : (
                        <img src={femalimg} alt="Female" className='resimg1' />
                      )}
                    </div>
                    <div className="rightcard-container">
                      <h3 className="card-titles" style={{marginTop:"0px"}}>Patient Details</h3>
                      <div className="profile-details">
                    <div className="detail-row1">
                        <span className="label">Patient Name </span>
                        <span className="value"> {TransactionData.patientname}</span>
                    </div>
                    <div className="detail-row1">
                        <span className="label">Mobile No</span>
                        <span className="value"> {TransactionData.prinumber}</span>
                    </div>
                    <div className="detail-row1">
                        <span className="label">Alternative Mo. No.</span>
                        <span className="value">{TransactionData.secnumber || '-'}</span>
                    </div>
                    <div className="detail-row1">
                        <span className="label">{TransactionData.idproof} No.</span>
                        <span className="value">{TransactionData.idnumber}</span>
                    </div>
                    <div className="detail-row1">
                        <span className="label">Address</span>
                        <span className="value"> {TransactionData.address}</span>
                    </div>
                </div>  
                </div>
              </div>
              </>
            )}
            </div>
        </section>
        { patientid === id && (
          <div className="container chckout-card mt-4">
            <Table id="example" className="Table-striped  regtable" cellSpacing="0" width="100%" >  
              <Thead>
                <Tr>
                  <Th className='Th'>Reservation No</Th>
                  <Th>Patient Name</Th>
                  <Th>From Date</Th>
                  <Th>To Date</Th>
                  <Th>Account Report</Th>
                  <th className='action' >Action</th>
                </Tr>
              </Thead>
              <Tbody>
                 {trsctabledata?.map((trsdata, index) => (
                   <Tr key={trsdata._id}>
                    <Td>{index + 1}</Td>
                    <Td>{trsdata.patientname}</Td>
                    <Td>{formdate}</Td>
                    <Td>{toDate}</Td>
                    <Td>Open</Td>
                    <Td>
                      <Link to={`/accountHistory/${patientid}`}>
                        <button className="btn btn-info accountinfo-btn">View AccountInfo</button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tbody>
              {paymentSettlementdata?.map((data, index) => (
              <Tr key={data._id}>
                <Td>{index + 10}</Td>
                <Td>{patientname}</Td>
                <Td>{formdate}</Td>
                <Td>{trctodate}</Td>
                <Td>Closed</Td>
                <Td>
                  <Link to={`/CheckOutHistory/${pid}`}>
                    <button className="btn btn-info">View AccountInfo</button>
                  </Link>
                </Td>
              </Tr>
            ))}
              </Tbody>
            </Table>
           
            </div>
            )} 
             
          </div>  
    </>   
  );
}

export default Res_AccountDetails;
