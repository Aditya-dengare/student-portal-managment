import React, { useEffect, useState } from "react";
import './StudentList.css'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { database } from "../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useStudent } from "../StudentContext";

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

  // const handleEdit = async (id, FirstName, LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, CourseDuration, TotalFEE, PaidAmount) => {
  //   navigate(`/Form?id=${id}&firstname=${FirstName}&lastname=${LastName}&fathername=${FatherName}&mothername=${MotherName}
  //     &contactnumber=${ContactNumber}&aadharnumber=${AadharNumber}&state=${State}&city=${City}&category=${Category}&address=${Address}
  //     &universityname=${UniversityName}&coursename=${CourseName}&coursesubject=${CourseSubject}&courseduration=${CourseDuration}&totalfee=${TotalFEE}&paidamount=${PaidAmount}
  //   `);
  // };

  const handleEdit = async (id, FirstName, LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, CourseDuration, TotalFEE, PaidAmount) => {
    setStudent({
      id, FirstName ,LastName, FatherName, MotherName, ContactNumber, AadharNumber, State, City, Category, Address, UniversityName, CourseName, CourseSubject, CourseDuration, TotalFEE, PaidAmount
    })
    navigate(`/Form`);
  }

  const handleClearStudent = () => {
    clearStudent();
  };

  return (
    <div>
      <h1 className='displayname'>Student List</h1>
      <Link to="/Form" className='studentlist_button'>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClearStudent}>Add Student</Button>
      </Link>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">University Name</StyledTableCell>
              <StyledTableCell align="right">Course Name</StyledTableCell>
              <StyledTableCell align="right">Total Fee</StyledTableCell>
              <StyledTableCell align="right">Paid Amount</StyledTableCell>
              <StyledTableCell align="right">Remaining Amount</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              val.map(values =>
                <TableRow key = {values.id}>
                  <StyledTableCell align="right">{values.FirstName} {values.LastName}</StyledTableCell>
                  <StyledTableCell align="right">{values.UniversityName.label}</StyledTableCell>
                  <StyledTableCell align="right">{values.CourseName.label}</StyledTableCell>
                  <TotalAmount align="right">{values.TotalFee}</TotalAmount>
                  <TotalPaidAmount align="right">{values.PaidAmount}</TotalPaidAmount>
                  <PendingAmount align="right">{values.PendingAmount}</PendingAmount>
                  <ActionCell align="right">
                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(values.id)}>Delete</Button>
                  <Button variant="outlined" color="primary" startIcon={<EditIcon />}
                    onClick={() => handleEdit(values.id, values.FirstName, values.LastName, values.FatherName, values.MotherName,
                      values.ContactNumber, values.AadharNumber, values.State, values.City, values.Category.label == null ? values.Category : values.Category.label, values.Address,
                      values.UniversityName.label == null ? values.UniversityName : values.UniversityName.label, values.CourseName.label == null ? values.CourseName : values.CourseName.label, values.CourseSubject, values.CourseDuration, values.TotalFee,
                      values.PaidAmount
                      )}
                  >Edit</Button>
                  </ActionCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default StudentList;
