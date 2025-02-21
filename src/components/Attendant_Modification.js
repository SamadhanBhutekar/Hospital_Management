import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom'; 
import $ from 'jquery';
import 'datatables.net';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import {BASE_URL} from './config';
function AttendantModification() 
{
  const [isActive, setIsActive] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [pid, setPid] = useState([]); 
  const [patientid, setPatientid] = useState([]); 
  const[relationdata,setRelationaldata]= useState([]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${BASE_URL}attedentmodification`);
      const data = await response.json();
      setAttendanceData(data);
      const allPids = data.map((item) => item._id);
      setPid(allPids);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    const getattdencedata = async () => {
      try {
        const response = await fetch(`${BASE_URL}get_attdent`);
        const data = await response.json();
        setRelationaldata(data);
        const gepatientData = data.map((item) => ({
          id: item._id,
        }));
        setPatientid(gepatientData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getattdencedata();
  }, []);

  useEffect(() => {
    if (attendanceData.length > 0) {
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
  }, [attendanceData]);

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="container attdence-card-body chckout-card">
        <div className="row">
          <center><h4>Attendant Modification</h4></center>
          </div>
          <Table id="example" className=" Table-striped " cellSpacing="0" width="100%">
            <Thead>
              <Tr>
                <Th className='Th'>Sr.No</Th>
                <Th>Patient Name</Th>
                <Th>Attendant Name</Th>
                <Th className='th1'>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((attdata, index) => (
                  <Tr key={index}>
                    <Td className='Th'>{index + 1}</Td>
                    <Td>{attdata.patientname}</Td>
                    <Td>
                      {relationdata
                        .filter((getdata) => getdata.pid === attdata._id)
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 1).length > 0 ? (
                          relationdata
                            .filter((getdata) => getdata.pid === attdata._id)
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .slice(0, 1)
                            .map((latestData, idx) => (
                              <div key={idx}>{latestData.patientname}</div>
                            ))
                        ) : (
                          <>-</>
                        )
                      }
                    </Td>
                    <Td className='th1'>
                      <Link to={`/attendantinfo/${attdata._id}`}>
                        <button className="btn btn-info">View Profile</button>
                      </Link>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="4" style={{ textAlign: "center", fontWeight: "bold" }}>
                    No records..
                  </Td>
                </Tr>
              )}
            </Tbody>

          </Table>
        </div>
      </div>
    </>
  );
}

export default AttendantModification;
