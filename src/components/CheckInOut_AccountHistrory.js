import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useParams } from "react-router";
import moment from 'moment'
import { Link } from "react-router";
import { useLocation } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { BASE_URL } from "../components/config";

function CheckIn_AccountHistrory() 
{
  const [isActive, setIsActive] = useState(true);
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [receiptNo, setReceiptNo] = useState(null);
  const [currentdate, setCurrendate] = useState();
  const [DepositereceiptNo, setDepositeReceiptNo] = useState(null);
  const [ModifyRecNo, setModifyRecNo] = useState(null);
  const [status, setStatus] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flag = queryParams.get("flag");

   const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => 
  {
    const checkindata = async () => 
    {
      const currentDate = moment().format("DD MMM YYYY"); 
      setCurrendate(currentDate);
      try {
        let checkialldata = await fetch(`${BASE_URL}/checkin_transctiondetails`);
        let chckindalldata = await checkialldata.json();

        let chcksingleData = await fetch(`${BASE_URL}/checkin_transctiondetails/${id}`);
        let chcecktransactionDetails = await chcksingleData.json();
  
        if (!Array.isArray(chckindalldata) || !chcecktransactionDetails.patientid) {
          console.error("Invalid API response");
          return;
        }
        const Indexno = chckindalldata.findIndex((item) => item.patientid === id);
        if (Indexno !== -1) {
          setReceiptNo(100 + (Indexno + 1)); 
          setDepositeReceiptNo(200 + (Indexno + 1)); 
          setModifyRecNo(500 + (Indexno + 1)); 
          setTransaction(chcecktransactionDetails);
        } else {
          console.warn("Transaction not found in full list:", id);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
      checkindata();
    
  }, [id]);

  useEffect(() => {
    const fetchModificationData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Package_modificationData/${id}`);
        const data = await response.json();
        setStatus(data.status || ""); // Ensure status is always defined
      } catch (error) {
        console.error("Error fetching modification data:", error);
      }
    };

    fetchModificationData();
  }, [id]);


  return (
   <>
   <Sidebar isActive={isActive} handleToggle={handleToggle} />
   <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
     <div className="chcekin_table">
      <div className="chckout-card">
      <center><h4>Account Information</h4></center>
      <div className="chckout-title">
        <h4> Account Id : {id}</h4>
      </div>
      <div className="chckout-title1">
        <h4> Account Status : Closed</h4>
      </div>
        <Table id="example" className=" Table-striped Table-borderedmt-3" cellSpacing="0" width="100%" >
              <Thead>
                <Tr>
                  <Th className="Th">Recipt No</Th>
                  <Th>Create Date</Th>
                  <Th>Purpose</Th>
                  <Th className="th1">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transaction ? (
                  <Tr key={transaction.patientid}>
                    <Td>{receiptNo !== null ? receiptNo : "Loading..."}</Td>
                    <Td>{currentdate}</Td>
                    <Td>Payment</Td>
                    <Td><Link to={`/print/${receiptNo}/${id}?flag=payment`}><button className="btn btn-info"><span>Print Receipt</span></button></Link>
                    </Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan="4">No transactions found.</Td>
                  </Tr>
                )}
              </Tbody>
              <Tbody>
              {transaction && status?.includes('modify') && (  
                  <Tr key={transaction.patientid}>
                    <Td>{ModifyRecNo !== null ? ModifyRecNo : "Loading..."}</Td>
                    <Td>{currentdate}</Td>
                    <Td>Modification</Td>
                    <Td>
                      <Link to={`/print/${ModifyRecNo}/${id}?flag=modify`}>
                        <button className="btn btn-info">
                          <span>Print Receipt</span>
                        </button>
                      </Link>
                    </Td>
                  </Tr>
                )}
              </Tbody>
              <Tbody>
              {transaction ? (
                  <Tr key={transaction.patientid}>
                    <Td>{DepositereceiptNo !== null ? DepositereceiptNo : "Loading..."}</Td>
                    <Td>{currentdate}</Td>
                    <Td>Deposit</Td>
                    <Td><Link to={`/print/${DepositereceiptNo}/${id}?flag=Deposit`}><button className="btn btn-info">Print Receipt</button></Link></Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan="4">No transactions found.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
      </div>
      </div>
   </>
  )
}

export default CheckIn_AccountHistrory;
