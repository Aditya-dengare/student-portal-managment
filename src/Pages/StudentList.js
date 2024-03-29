import React, { useEffect, useState } from "react";
import './StudentList.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { TableCell } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { database } from "../firebase";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { useStudent } from "../StudentContext";
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import PrintIcon from '@mui/icons-material/Print';

function StudentList() {

  const DBName = "StudentData";
  const value = collection(database, DBName);
  const navigate = useNavigate();
  const [val, setVal] = useState([]);
  const { setStudent, clearStudent } = useStudent();

  const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  });

  const TotalAmount = styled(TableCell)({
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'green',
  });

  const TotalPaidAmount = styled(TableCell)({
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'blue',
  });

  const PendingAmount = styled(TableCell)({
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'red',
  });

  const ActionCell = styled(TableCell)({
    display: 'flex',
    gap: '8px',
  });

  //This is function is used to view data into table
  useEffect(() => {
    const getData = async () => {
      const dbValues = await getDocs(value);
      setVal(dbValues.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    getData();
  }, []);

  //This function is used to delete items from table
  const handleDelete = async (id) => {
    const deleteValues = doc(database, DBName, id);
    await deleteDoc(deleteValues);
    window.location.reload();
  };

  //This function will used to print the student results
  const handlePrint = async (id) => {
    const docRef = doc(database, DBName, id);
    const getValueSnapshot = await getDoc(docRef);
    if (getValueSnapshot.exists()) {
      const getValue = getValueSnapshot.data();
      const printWindow = window.open();
      const contentToPrint = generatePrintContent(getValue);
      printWindow.document.write(contentToPrint);
      printWindow.document.close();
      printWindow.print();
    }

  };

  // This function will generate PDF for prints
  const generatePrintContent = (data) => {
    return `
      <html>
        <head>
          <title>Print Document</title>
          <!-- Add any CSS styles if needed -->
          <style>
            /* Your styles here */
          </style>
        </head>
        <body>
          <!-- Your data rendering here -->
          <div>
            ${console.log(data.FirstName)}
            <h1>FirstName: ${data.FirstName}</h1>
            <p>LastName: ${data.LastName}</p>
          </div>
        </body>
      </html>
    `;
  };

  //This function is used to edit table data and move to Form.Js page
  const handleEdit = async (id, FirstName, LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, TotalFEE, PaidAmount, ParentsContactNumber, DateOfBirth, AcademicYear) => {
    setStudent({
      id, FirstName, LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, TotalFEE, PaidAmount, ParentsContactNumber, DateOfBirth, AcademicYear
    })
    navigate(`/Form`);
  }

  const handleClearStudent = () => {
    clearStudent();
  };
  const columns = [
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'universityName', headerName: 'University Name', width: 300 },
    { field: 'courseName', headerName: 'Course Name', width: 250 },
    { field: 'totalFee', headerName: 'Total Fee', width: 130 },
    { field: 'paidAmount', headerName: 'Paid Amount', width: 200 },
    { field: 'remainingAmount', headerName: 'Remaining Amount', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(
            params.row.firebaseindex,
            params.row.firstname,
            params.row.lastname,
            params.row.fathername,
            params.row.mothername,
            params.row.contactnumber,
            params.row.aadharnumber,
            params.row.state,
            params.row.city,
            params.row.category,
            params.row.address,
            params.row.universityName,
            params.row.courseName,
            params.row.coursesubject,
            params.row.totalFee,
            params.row.paidAmount,
            params.row.parentscontactnumber,
            params.row.dateofbirth,
            params.row.academicyear
          )}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.firebaseindex)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handlePrint(params.row.firebaseindex)}>
            <PrintIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = val.map((values, index) => ({
    id: index,
    firebaseindex: values.id,
    firstname: values.FirstName,
    lastname: values.LastName,
    fathername: values.FatherName,
    mothername: values.MotherName,
    contactnumber: values.ContactNumber,
    aadharnumber: values.AadharNumber,
    state: values.State,
    city: values.City,
    category: values.Category.label == null ? values.Category : values.Category.label,
    address: values.Address,
    name: values.FirstName + ' ' + values.LastName,
    universityName: values.UniversityName.label == null ? values.UniversityName : values.UniversityName.label,
    courseName: values.CourseName.label == null ? values.CourseName : values.CourseName.label,
    coursesubject: values.CourseSubject,
    totalFee: values.TotalFee,
    paidAmount: values.PaidAmount,
    remainingAmount: values.PendingAmount,
    parentscontactnumber: values.ParentsContactNumber,
    dateofbirth: values.DateOfBirth,
    academicyear: values.AcademicYear
  }));

  return (
    <div>
      <h1 className='displayname'>Student List</h1>
      <Link to="/Form" className='studentlist_button'>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleClearStudent}>Add Student</Button>
      </Link>

      <Link to="/Login" className="logout-button">
        <Button variant="contained" color="secondary" startIcon={<LogoutIcon />}>
          logout
        </Button>
      </Link>

      <Box sx={{ height: 400, width: '100%' }} className="student_list">
        <DataGrid
          rows={rows}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </div>
  );
}

export default StudentList;
