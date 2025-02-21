import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useParams } from "react-router";
import moment from 'moment'
import { Link } from "react-router";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

import { BASE_URL } from "./config";

function CheckOut_AccountHistrory() 
{
  const [isActive, setIsActive] = useState(true);
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [receiptNo, setReceiptNo] = useState(null);
  const [refundNo, setRefundid] = useState(null);
  const [depositerefundNo, setRefunddposite] = useState(null);
  const [createdate, setdate] = useState();
  const [DepositereceiptNo, setDepositeReceiptNo] = useState(null);
  
   const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const checkoutdata = async () => {
      try {

        let allData = await fetch(`${BASE_URL}/checkout_transctiondetails`);
        let allTransactions = await allData.json();

        let singleData = await fetch(`${BASE_URL}/checkout_transctiondetails/${id}`);
        let transactionDetails = await singleData.json();
  
        if (!Array.isArray(allTransactions) || !transactionDetails._id) {
          console.error("Invalid API response");
          return;
        }

        const Indexno = allTransactions.findIndex((item) => item._id === id);

        if (Indexno !== -1) {
          setReceiptNo(100 + (Indexno + 1)); 
          setDepositeReceiptNo(200 + (Indexno + 1));
          setRefundid(300 + (Indexno + 1));
          setRefunddposite(400 + (Indexno + 1));

          setTransaction(transactionDetails);
        } else {
          console.warn("Transaction not found in full list:", id);
        }

        allTransactions.sort((a, b) => a._id.localeCompare(b._id));
        const currentIndex = allTransactions.findIndex((item) => item._id === id);

        if (currentIndex !== -1) {
          setReceiptNo(101 + currentIndex);
          setTransaction(transactionDetails);
        } else {
          console.warn("Transaction not found in full list:", id);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
    checkoutdata();
    
  }, [id]);

  useEffect (() =>
  {
    const paymentsettlement = async () =>
    {

        let geatdata = await fetch(`${BASE_URL}/checkout_paysettelment/${id}`);
        let paymentdata = await geatdata.json();
        const createtedtate =paymentdata.transcatonDate;
        const formattedDate = createtedtate ? moment(createtedtate).format("DD MMM YYYY") : "N/A";
        setdate(formattedDate); 
    }
    paymentsettlement()
  }, [id]);

  return (
   <>
   <Sidebar isActive={isActive} handleToggle={handleToggle} />
   <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
     <div className="acchistory_table">
      <div className="chckout-card">
      <center><h4>Account Information</h4></center>
      <div className="chckout-title">
        <h4> Account Id : {id}</h4>
      </div>
      <div className="chckout-title1">
        <h4> Account Status : Closed</h4>
      </div>
        <Table id="example" className=" Table-striped  mt-3" cellSpacing="0" width="100%">
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
                    <Td className="Th">{receiptNo !== null ? receiptNo : "Loading..."}</Td>
                    <Td>{createdate}</Td>
                    <Td>Payment</Td>
                    <Td  className="th1"><Link to={`/print/${receiptNo}/${transaction.patientid}?flag=chp`}><button className="btn btn-info">Print Receipt</button></Link></Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan="4">No transactions found.</Td>
                  </Tr>
                )}
                 
              </Tbody>
              <Tbody>
                {transaction ? (
                  <Tr key={transaction.patientid}>
                    <Td className="Th">{refundNo !== null ? refundNo : "Loading..."}</Td>
                    <Td>{createdate}</Td>
                    <Td >Refund</Td>
                    <Td  className="th1"><Link to={`/print/${refundNo}/${transaction.patientid}?flag=chr`}><button className="btn btn-info">Print Receipt</button></Link></Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan="4">No transactions found.</Td>
                  </Tr>
                )}
                 
              </Tbody>

              <Tbody>
                {transaction ? (
                  <Tr key={transaction.patientid}>
                    <Td className="Th">{depositerefundNo !== null ? depositerefundNo : "Loading..."}</Td>
                    <Td>{createdate}</Td>
                    <Td >Refund Deposit</Td>
                    <Td className="th1"><Link to={`/print/${depositerefundNo}/${transaction.patientid}?flag=crd`}><button className="btn btn-info">Print Receipt</button></Link></Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan="4">No transactions found.</Td>
                  </Tr>
                )}
                 
              </Tbody>
              
              <Tbody>
                
              {transaction ? (
                  <Tr key={transaction.patientid}>
                    <Td className="Th">{DepositereceiptNo !== null ? DepositereceiptNo : "Loading..."}</Td>
                    <Td>{createdate}</Td>
                    <Td >Deposit</Td>
                    <Td className="th1"><Link to={`/print/${DepositereceiptNo}/${transaction.patientid}?flag=chd`}><button className="btn btn-info">Print Receipt</button></Link></Td>
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

export default CheckOut_AccountHistrory;
