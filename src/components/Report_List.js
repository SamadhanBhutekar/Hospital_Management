import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import $ from 'jquery';
import 'datatables.net';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { BASE_URL } from "../components/config";

function Report_List() 
{
  const [isActive, setIsActive] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [filterType, setFilterType] = useState('Patient Name');
  const Navigate = useNavigate()
  const [sortOrder, setSortOrder] = useState('asc');
  const handleToggle = () => {
    setIsActive(!isActive);
  };

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

  useEffect(() => {
  const ReportList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/report_list`);
      const data = await response.json();
      setAttendanceData(data);
      fetchTransactionData(data.map(({ _id }) => _id)); 
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  }
    ReportList();
  }, []);


  const fetchTransactionData = async (ids) => {
    try {
      const response = await fetch(`${BASE_URL}/report_transction`);
      const transactionData = await response.json();
      const filteredTransactions = transactionData.filter((tran) => ids.includes(tran.resid));
      setTransactionData(filteredTransactions);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  const mergedData = attendanceData.map((att) => {
    const transaction = transactionData.find((tran) => tran.resid === att._id) || {};
    return {
      ...att,
      transactionDate: transaction.transcatonDate ? moment(transaction.transcatonDate).format("DD MMM YYYY") : "-",
    };
  });

  const exportToPDF = () => 
 {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('Revenue Details Report', pageWidth / 2, 10, { align: 'center' });
    const tableColumn = ["Sr.No", "Patient Name", "Room Type", "Transaction Date", "Package", "Receivable", "Discount", "Received"];
    const tableRows = [];
  
    mergedData.forEach((attdata, index) =>
   {
      const daysDifference = Math.ceil((new Date(attdata.toDate) - new Date(attdata.fromDate)) / (1000 * 60 * 60 * 24));
      const rowData = [
        index + 1,
        attdata.patientname,
        attdata.RoomCategory,
        attdata.transactionDate,
        `[${daysDifference}]`,
        attdata.packagePrice,
        attdata.DiscountAmount || "0",
        attdata.ReceivableAmount || "0"
      ];
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save('Revenue_Report.pdf');
  };
  
    const TooltipButton = ({ iconClass, text, onClick }) => {
      const [visible, setVisible] = useState(false);
    
      return (
        <div
          className="tooltip-container"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          onClick={onClick}
        >
          <button className="icon-button">
            <i className={iconClass} aria-hidden="true"></i>
          </button>
          {visible && <div className="tooltip-text">{text}</div>}
        </div>
      );
    };

    const reports =()=>
    {
      Navigate('/reports')
    }
    const Dashbord =()=>
    {
      Navigate('/')
    }


      const handleFilterChange = (e) => {
        setFilterType(e.target.value);
      };
    
      const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
      };
    
      if (filterType === 'Transaction Date') {
        mergedData.sort((a, b) => (new Date(b.transactionDate) - new Date(a.transactionDate)) * (sortOrder === 'asc' ? 1 : -1));
      } else if (filterType === 'Receivable') {
        mergedData.sort((a, b) => ((a.ReceivableAmount || 0) - (b.ReceivableAmount || 0)) * (sortOrder === 'asc' ? 1 : -1));
      } else if (filterType === 'Patient Name') {
        mergedData.sort((a, b) => a.patientname.localeCompare(b.patientname) * (sortOrder === 'asc' ? 1 : -1));
      }
    
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="attdence-card-body">
          <div className="report-card ">
            <h1>Revenue Details</h1>
            <div className="button-group fiter-databtn">
            <TooltipButton iconClass="fa fa-arrow-left" onClick={reports} text="Go to Account" />
            <label style={{color:"#94a3b8",marginTop:"5px"}}>Sort By: </label>
              <select onChange={handleFilterChange} value={filterType} className='select-filter'>
                <option  value="Patient Name">Patient Name</option>
                <option value="Transaction Date">Transaction Date</option>
                <option value="Receivable">Receivable</option>
              </select>
              <label style={{color:"#94a3b8",marginTop:"5px"}}>Order : </label>
              <select onChange={handleSortOrderChange} value={sortOrder} className='select-filter1'>
                <option  value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            <TooltipButton iconClass="fa fa-home" onClick={Dashbord} text="Home" />
            <TooltipButton iconClass="fa fa-download" text="Download as PDF" onClick={exportToPDF} />
            </div>
          </div>
          
        <div className='btnbackground'>
          <div className="button-group fiterbtn">
            <label style={{color:"#94a3b8"}}>Sort By: </label>
              <select onChange={handleFilterChange} value={filterType} className='select-filter1'>
                <option value="Patient Name">Patient Name</option>
                <option value="Transaction Date">Transaction Date</option>
                <option value="Receivable">Receivable</option>
              </select>
              <label style={{color:"#94a3b8"}}>Order : </label>
              <select onChange={handleSortOrderChange} value={sortOrder} className='select-filter1'>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
             
            </div>
            </div>
            <div className='btnbackground'>
            <div className="button-group fiterbtn">
            <TooltipButton iconClass="fa fa-arrow-left" onClick={reports} text="Go to Account" />
            <TooltipButton iconClass="fa fa-home" onClick={Dashbord} text="Home" />
            <TooltipButton iconClass="fa fa-download" text="Download as PDF" onClick={exportToPDF} />
            </div>
            </div>
        
          <div className='chckout-card'>
          <Table id="example" className=" Table-striped " cellSpacing="0" width="100%">         
            <Thead>
              <Tr>
                <Th className='Th'>Sr.No</Th>
                <Th>Patient Name</Th>
                <Th>Room Type</Th>
                <Th>Transaction Date</Th>
                <Th>Package</Th>
                <Th>Receivable</Th>
                <Th>Discount</Th>
                <Th className='th1'>Received</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mergedData.length > 0 ? (
                mergedData.map((attdata, index) => {
                  const daysDifference = Math.ceil(
                    (new Date(attdata.toDate) - new Date(attdata.fromDate)) /
                    (1000 * 60 * 60 * 24)
                  );
                  return (
                    <Tr key={index}>
                      <Td className='Th'>{index + 1}</Td>
                      <Td>{attdata.patientname}</Td>
                      <Td>{attdata.RoomCategory}</Td>
                      <Td>{attdata.transactionDate}</Td>
                      <Td>[{daysDifference}]</Td>
                      <Td>{attdata.packagePrice}</Td>
                      <Td>{attdata.DiscountAmount}</Td>
                      <Td className='th1'>{attdata.ReceivableAmount}</Td> 
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
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

export default Report_List;

