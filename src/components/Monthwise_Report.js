import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import $ from 'jquery';
import 'datatables.net';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
function MonthReport_List() 
{
  const [isActive, setIsActive] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const Navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState('fromDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("all");

  const handleToggle = () => {
    setIsActive(!isActive);
  };


  useEffect(() => {
    const ReportList = async () => {
      try {
        const response = await fetch("http://localhost:4000/report_list");
        const data = await response.json();
        if (data.length > 0) {
          const updatedData = data.map((item, index) => ({
            ...item,
            reservationID: 101 + index,
          }));
          setAttendanceData(updatedData);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    ReportList();
  }, []);
  
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await fetch('http://localhost:4000/report_transction');
        const transactionData = await response.json();
        const updatedTransactions = transactionData.map((item, index) => ({
          ...item,
        }));

        setTransactionData(updatedTransactions);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    fetchTransactionData();
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


  //----------------- Export to PDF----------------------

  const exportToPDF = () => 
  {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('Reservation  Details Report', pageWidth / 2, 10, { align: 'center' });

    const tableColumn = [
      "Sr.No", 
      "Reservation Id", 
      "Patient Name", 
      "From Date", 
      "To Date", 
      "Room Type", 
      "Bed Number", 
      "Charges"
    ];
  
    // Prepare Table data
    const calculateDiscount = (roomType) => {
      switch (roomType) {
        case "General":
          return 30;
        case "Semi-Special":
          return 60;
        case "Special":
          return 100;
        default:
          return 0;
      }
    };
  
    // Prepare Table data
    const tableRows = mergedData.map((attdata, index) => [
      index + 1,
      attdata.reservationID || "N/A",
      attdata.patientname || "N/A",
      attdata.fromDate ? moment(attdata.fromDate).format("DD-MM-YYYY") : "N/A",
      attdata.toDate ? moment(attdata.toDate).format("DD-MM-YYYY") : "N/A",
      attdata.RoomCategory || "N/A",
      attdata.AssignBedno || "N/A",
      calculateDiscount(attdata.RoomCategory) 
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { halign: "center" }, 
    });
    doc.save('Reservation_Report.pdf');
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

  
const calculateDiscount = (roomType) => {
  switch (roomType) {
    case "General":
      return 30;
    case "Semi-Special":
      return 60;
    case "Special":
      return 100;
    default:
      return 0;
  }
};

// -----------------Fiter Data-----------------------------

const filteredData = attendanceData.filter(att => {
  const attYear = moment(att.fromDate).year();
  const attMonth = moment(att.fromDate).month() + 1;
  return attYear === selectedYear && (selectedMonth === 'all' || attMonth === parseInt(selectedMonth));
});
const mergedData = filteredData.map(att => {
  const transaction = transactionData.find(tran => tran.resid === att._id);
  return {
    ...att,
    transactionDate: transaction?.transactionDate 
      ? moment(transaction.transactionDate).format("DD MMM YYYY") 
      : "N/A",
  };
})
.sort((a, b) => {
  if (sortOrder === 'asc') {
    return a[sortColumn] > b[sortColumn] ? 1 : -1;
  } else {
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  }
})
.filter(att => {
  let isValid = true;
  if (filterType === "reservationID" && filterValue !== "all") {
    isValid = att.reservationID?.toString().includes(filterValue);
  } 
  else if (filterType === "patientname" && filterValue !== "all") {
    isValid = att.patientname?.toLowerCase().includes(filterValue.toLowerCase());
  } 
  else if (filterType === "fromDate" && filterValue !== "all") {
    isValid = moment(att.fromDate).isSame(moment(filterValue), 'day');
  } 
  else if (filterType === "RoomCategory" && filterValue !== "all") {
    isValid = att.RoomCategory === filterValue;
  }
  return isValid;
});
const reports = () => {
  Navigate('/reports');
};

const Dashbord = () => {
  Navigate('/');
};
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="attdence-card-body">
        <div className="report-card">
        <h1>Reservation Details</h1>
         <div className="button-group fiter-databtn">
            <TooltipButton iconClass="fa fa-arrow-left" onClick={reports} text="Go to Account" />
            <select onChange={(e) => setSelectedYear(parseInt(e.target.value))} className='select-filter1'>
              {[...Array(6)].map((_, i) => {
                const year = 2025 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>

            <select onChange={(e) => setSelectedMonth(e.target.value)} className='select-filter1'>
              <option value="all">All Months</option>
              {[...Array(12)].map((_, i) => {
                const month = i + 1;
                return <option key={month} value={month}>{moment().month(i).format("MMMM")}</option>;
              })}
            </select>

            <select onChange={(e) => setSortOrder(e.target.value)} className='select-filter1'>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <select onChange={(e) => setSortColumn(e.target.value)} className='select-filter1'>
              <option value="all" >All</option>
              <option value="reservationID">Reservation ID</option>
              <option value="patientname">Patient Name</option>
              <option value="fromDate">From Date</option>
              <option value="RoomCategory">Room Category</option>
            </select>
            <TooltipButton iconClass="fa fa-home" onClick={Dashbord} text="Home" />
            <TooltipButton iconClass="fa fa-download" text="Download as PDF" onClick={exportToPDF} />
        </div>
          </div>
          <div className='btnbackground'>
          <div className="button-group fiterbtn" >
            <select onChange={(e) => setSelectedYear(parseInt(e.target.value))} className='select-filter1'>
              {[...Array(6)].map((_, i) => {
                const year = 2025 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>

            <select onChange={(e) => setSelectedMonth(e.target.value)} className='select-filter1'>
              <option value="all">All Months</option>
              {[...Array(12)].map((_, i) => {
                const month = i + 1;
                return <option key={month} value={month}>{moment().month(i).format("MMMM")}</option>;
              })}
            </select>

            <select onChange={(e) => setSortOrder(e.target.value)} className='select-filter1'>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <select onChange={(e) => setSortColumn(e.target.value)} className='select-filter1'>
              <option value="all">All</option>
              <option value="reservationID">Reservation ID</option>
              <option value="patientname">Patient Name</option>
              <option value="fromDate">From Date</option>
              <option value="RoomCategory">Room Category</option>
            </select>
          </div>
          </div>
          <div className='btnbackground'>
          <div className="button-group fiterbtn"  >
            <TooltipButton iconClass="fa fa-arrow-left" onClick={reports} text="Go to Account" />
            <TooltipButton iconClass="fa fa-home" onClick={Dashbord} text="Home" />
            <TooltipButton iconClass="fa fa-download" text="Download as PDF" onClick={exportToPDF} />
        </div>
        </div>
       
          <div className='chckout-card monthwise-card'>
          <Table id="example" className=" Table-striped " cellSpacing="0" width="100%">         
            <Thead>
              <Tr>
                <Th className='Th'>Sr.No</Th>
                <Th>Reservation Id</Th>
                <Th>Patient Name</Th>
                <Th>From Date</Th>
                <Th>To Date</Th>
                <Th>Room Type</Th>
                <Th>Bed Number</Th>
                <Th className='th1'>Charges(₹)</Th>
              </Tr>
            </Thead>
            <Tbody>
            {mergedData.length > 0 ? (
              mergedData.map((attdata, index) => (
                <Tr key={index}>
                  <Td className='Th'>{index + 1}</Td>
                  <Td>{attdata.reservationID}</Td>
                  <Td>{attdata.patientname}</Td>
                  <Td>{moment(attdata.fromDate).format("DD MMM YYYY")}</Td>
                  <Td>{moment(attdata.toDate).format("DD MMM YYYY")}</Td>
                  <Td>{attdata.RoomCategory}</Td>
                  <Td>{attdata.AssignBedno}</Td>
                  <Td className='th1'>{calculateDiscount(attdata.RoomCategory)}</Td>
                </Tr>
              ))
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

export default MonthReport_List;
