import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom'; 
import $ from 'jquery';
import 'datatables.net';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import {BASE_URL} from './config';
function Reports() {
  const [isActive, setIsActive] = useState(true);
  const [regdata,setResponse]=useState([]);
  const handleToggle = () => {
    setIsActive(!isActive);
  };
useEffect (() =>
{
  const registrationdata =  async () =>
  {
    let data = await fetch(`${BASE_URL}patient_registration`);
    let response = await data.json();
    setResponse(response);
  }
  registrationdata()
},[])
  // Initialize DataTable
  useEffect(() => {
    if (regdata.length > 0) {
      if ($.fn.DataTable.isDataTable('#example')) {
        $('#example').DataTable().destroy();
      }
      $('#example').DataTable({
        dom: '<"dt-buttons"Bf><"clear">lirtp',
        paging: true,
        autoWidth: true,
        buttons: [],
      });
    }
  }, [regdata]);

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="reportcard">
        <div className="row">
          <div className="col-md-6">
            <div className="revenue-card">
              <div className="rep-btn">
                <Link to="/reportlist"><button className='btn btn-info'>View Details</button></Link>
                <h4>Revenue Details</h4>
                <h5>Report Details </h5>
              </div>
            </div> 
          </div>
          <div className="col-md-6">
            <div className="revenue-card">
              <div className="rep-btn">
                <Link to="/monthwisereport"><button className='btn btn-info'>View Details</button></Link>
                <h4>Billing Details </h4>
                <h5>Monthwise billing report </h5>
              </div>
            </div>
          </div>
          </div>
          <div className="container chckout-card mt-3">
            <center><h4>Patient Registration List</h4></center>
            <Table id="example" className=" table-striped" cellSpacing="0" width="100%">         
              <Thead>
                <Tr>
                  <Th>Sr.No</Th>
                  <Th>Patient Name</Th>
                  <Th>Mobile No</Th>
                  <Th>Alternative No</Th>
                  <Th>Document</Th>
                  <Th>Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {regdata.length > 0 ? (
                  regdata.map((attdata, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{attdata.patientname}</Td>
                      <Td>{attdata.prinumber}</Td>
                      <Td>{attdata.secnumber || '-'}</Td>
                      <Td> Name: {attdata.idproof} <br />No: {attdata.idnumber}</Td>
                      <Td>{attdata.address || '-'}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                      No record..
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
          </div>
        </div>
    </>
  );
}

export default Reports;
