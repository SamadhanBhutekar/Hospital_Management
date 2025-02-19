import './App.css';
import { Routes,Route } from 'react-router-dom';
import Register from './components/Registration'
import Dashboard from './components/Dashboard';
import Transcation from './components/Transcation';
import ResaccountDeatils from './components/Res_AccountDetails';
import Reservation_Confirmation from './components/Reservation_Confirmation'
import Reservation_Charges from './components/Reservatin_Charges';
import Attedence_Modification from './components/Attendant_Modification';
import Attendantinfo from './components/AttendantModification_info'
import Add_attendant from './components/Registration';
import Update_Attedence from './components/Update_Attendant';
import Package_Modification from './components/Package_modification';
import Package_info from './components/Package_Modification_info';
import Package_charges from './components/Package_Reservation_Charges';
import Reports from './components/Reports';
import CheckIn from './components/Check_In';
import PaymentSettlement from  './components/Payment_Settlement_Details';
import CheckinSearch from './components/Checkin_Search';
import AccountHistory from './components/CheckInOut_AccountHistrory';
import PrintAccountHistory from './components/Print_AccountHistory';
import CheckOutaccHistory from './components/CheckOut_AccHistory';
import Reportlist from './components/Report_List';
import Monthwisereport from './components/Monthwise_Report'
import Login from './components/login'
import PrivateComponent from './components/PrivateComponent';
import { BrowserRouter } from "react-router-dom";
function App() 
{
  return (
  <>
   <BrowserRouter>
    <Routes>
    <Route element={<PrivateComponent />}>
      <Route path="/" element={<Dashboard/>} />
      <Route path='/registartion' element={<Register/>}></Route>
      <Route path='/transction' element={<Transcation/>}></Route>
      <Route path="/transactionHistory/:id" element={<ResaccountDeatils />}></Route>
      <Route path="/reservation_confirmation/:roomId"  element={<Reservation_Confirmation />} />
      <Route path="/reservation_charges/:roomId/:id"  element={<Reservation_Charges />}  />
      <Route path='/attedence_modification' element={<Attedence_Modification/>}></Route>
      <Route path="/attendantinfo/:id" element={<Attendantinfo/>}></Route>
      <Route path="/addAttendant/:id" element={<Add_attendant/>}></Route>
      <Route path="/update_attdence/:id" element={<Update_Attedence/>}></Route>
      <Route path="/package_modification" element={<Package_Modification/>} />
      <Route path="/packagemodificationinfo/:id" element={<Package_info/>}/>
      <Route path="/package_charges/:id" element={<Package_charges/>}/>
      <Route path="/reports" element={<Reports/>}/>
      <Route path="/checkin/:resid" element={<CheckIn/>}/>
      <Route path="/paymentsettlement/:id" element={<PaymentSettlement/>}/>
      <Route path="/checkinsearch" element={<CheckinSearch/>}/>
      <Route path="/accountHistory/:id" element={<AccountHistory/>}/>
      <Route path="/print/:receipt/:id" element={<PrintAccountHistory/>}/>
      <Route path="/CheckOutHistory/:id" element={<CheckOutaccHistory/>}/>
      <Route path="/reportlist" element={<Reportlist/>}/>
      <Route path="/monthwisereport" element={<Monthwisereport/>}/>
      
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;

