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
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useStudent } from "../StudentContext";
import IconButton from '@mui/material/IconButton';

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

  //This function is used to edit table data and move to Form.Js page
  const handleEdit = async (id, FirstName, LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, CourseDuration, TotalFEE, PaidAmount) => {
    setStudent({
      id, FirstName, LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, CourseDuration, TotalFEE, PaidAmount
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
          <IconButton color="primary" onClick={() => handleEdit(params.row.id, params.row.name, /* other params.row properties... */)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>

        </>
      ),
    },
  ];

  const rows = val.map((values, index) => ({
    id: index,
    name: values.FirstName + ' ' + values.LastName,
    universityName: values.UniversityName,
    courseName: values.CourseName,
    totalFee: values.TotalFee,
    paidAmount: values.PaidAmount,
    remainingAmount: values.PendingAmount,
  }));

  return (
    <div>
      <h1 className='displayname'>Student List</h1>
      <Link to="/Form" className='studentlist_button'>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleClearStudent}>Add Student</Button>
      </Link>

      <Box sx={{ height: 400, width: '100%' }}>
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
