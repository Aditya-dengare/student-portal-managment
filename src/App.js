import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Form from './Pages/Form';
import StudentList from './Pages/StudentList'
import { StudentProvider } from './StudentContext';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';

function App() {
  return (
    <Router>
      <StudentProvider>
      <Routes>
        <Route path='*' Component={Login}></Route>
        <Route path='/Form' element={<Form />} />
        <Route path='/studentlist' element={<StudentList />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/SignUp' element={<SignUp />} />
      </Routes>
      </StudentProvider>
    </Router>
  );
}

export default App;