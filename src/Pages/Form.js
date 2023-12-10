import React, { useEffect, useState } from 'react';
import './Form.css';
import Button from '@mui/material/Button';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { database } from "../firebase"
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useLocation, useParams } from 'react-router-dom';
import { useStudent } from '../StudentContext';
import { Alert, AlertTitle, Snackbar, Stack } from '@mui/material';

function Form() {

  const DBName = "StudentData";

  const { selectedStudent, setStudent } = useStudent();
  const [id, setId] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [fathername, setfathername] = useState("");
  const [mothername, setmothername] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [aadharnumber, setaadharnumber] = useState("");
  const [state, setstate] = useState("");
  const [city, setcity] = useState("");
  const [category, setcategory] = useState(null);
  const [address, setaddress] = useState("");
  const [universityname, setuniversityname] = useState("");
  const [coursename, setcoursename] = useState("");
  const [coursesubject, setcoursesubject] = useState("");
  const [courseduration, setcourseduration] = useState("");
  const [totalfee, settotalfee] = useState("");
  const [paidamount, setpaidamount] = useState("");


  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [showUpdateAlertMessage, setShowUpdateAlertMessage] = useState(false);
  const [showSubmitAlertMessage, setShowSubmitAlertMessage] = useState(false);
  const [open, setOpen] = React.useState(false);

  const value = collection(database, DBName);

  const location = useLocation();
  const searchParam = new URLSearchParams(location.search);



  // const getData = async () => {
  //   const _id = searchParam.get('id')
  //   const first_name = searchParam.get('firstname');
  //   const last_name = searchParam.get('lastname');
  //   const father_name = searchParam.get('fathername');
  //   const mother_name = searchParam.get('mothername');
  //   const contact_number = searchParam.get('contactnumber');
  //   const aadhar_number = searchParam.get('aadharnumber');
  //   const state_ = searchParam.get('state');
  //   const city_ = searchParam.get('city');
  //   const category_ = searchParam.get('category');
  //   const address_ = searchParam.get('address');
  //   const university_name = searchParam.get('universityname');
  //   const course_name = searchParam.get('coursename');
  //   const course_subject = searchParam.get('coursesubject');
  //   const course_duration = searchParam.get('courseduration');
  //   const total_fee = searchParam.get('totalfee');
  //   const paid_amount = searchParam.get('paidamount');
  //   setId(_id);
  //   setfirstname(first_name);
  //   setlastname(last_name);
  //   setfathername(father_name);
  //   setmothername(mother_name);
  //   setcontactnumber(contact_number);
  //   setaadharnumber(aadhar_number);
  //   setstate(state_);
  //   setcity(city_);
  //   setcategory(category_);
  //   setaddress(address_);
  //   setuniversityname(university_name);
  //   setcoursename(course_name);
  //   setcoursesubject(course_subject);
  //   settotalfee(total_fee);
  //   setpaidamount(paid_amount);
  //   setShowUpdateButton(true);
  // };

  useEffect(() => {
    // if (searchParam.get('firstname') != null){
    //   getData();
    // }
    if (selectedStudent) {
      setId(selectedStudent.id);
      setfirstname(selectedStudent.FirstName);
      setlastname(selectedStudent.LastName);
      setfathername(selectedStudent.FatherName);
      setmothername(selectedStudent.MotherName);
      setcontactnumber(selectedStudent.ContactNumber);
      setaadharnumber(selectedStudent.AadharNumber);
      setstate(selectedStudent.State);
      setcity(selectedStudent.City);
      setcategory(selectedStudent.Category);
      setaddress(selectedStudent.Address);
      setuniversityname(selectedStudent.UniversityName);
      setcoursename(selectedStudent.CourseName);
      setcoursesubject(selectedStudent.CourseSubject);
      setcourseduration(selectedStudent.CourseDuration);
      settotalfee(selectedStudent.TotalFEE);
      setpaidamount(selectedStudent.PaidAmount);
      setShowUpdateButton(true);
    }
    else {
      setId("");
      setfirstname("");
      setlastname("");
      setfathername("");
      setmothername("");
      setcontactnumber("");
      setaadharnumber("");
      setstate("");
      setcity("");
      setcategory("");
      setaddress("");
      setuniversityname("");
      setcoursename("");
      setcoursesubject("");
      settotalfee("");
      setpaidamount("");
    }
  }, [selectedStudent])

  const Categories = [
    { label: 'General' },
    { label: 'SC/ST' },
    { label: 'OTHER' }
  ]

  const UniversityNames = [
    { label: 'LJ Institute' },
    { label: 'RK University' },
    { label: 'Parul University' }
  ]

  const Courses = [
    { label: 'B.Tech' },
    { label: 'MCA' },
    { label: 'B.COM' }
  ]



  //This function is used to Add Student Details
  const handleCreate = async () => {
    await addDoc(value, {
      FirstName: firstname,
      LastName: lastname,
      FatherName: fathername,
      MotherName: mothername,
      ContactNumber: contactnumber,
      AadharNumber: aadharnumber,
      State: state,
      City: city,
      Address: address,
      Category: category,
      UniversityName: universityname,
      CourseName: coursename,
      CourseSubject: coursesubject,
      TotalFee: totalfee,
      PaidAmount: paidamount,
      PendingAmount: totalfee - paidamount
    });
    clearStudentState();
    setShowSubmitAlertMessage(true);
    setOpen(true);
  }

  //This function is used to update Student Details
  const handleUpdate = async () => {
    const updateValues = doc(database, DBName, selectedStudent.id)
    await updateDoc(updateValues, {
      FirstName: firstname,
      LastName: lastname,
      FatherName: fathername,
      MotherName: mothername,
      ContactNumber: contactnumber,
      AadharNumber: aadharnumber,
      State: state,
      City: city,
      Category: category,
      Address: address,
      UniversityName: universityname,
      CourseName: coursename,
      CourseSubject: coursesubject,
      TotalFee: totalfee,
      PaidAmount: paidamount,
      PendingAmount: totalfee - paidamount
    });
    clearStudentState();
    setShowUpdateAlertMessage(true);
    setOpen(true);
    setShowUpdateButton(false);
  }

  // This function is used for Success Pop Close
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setShowUpdateAlertMessage(false);
  };

  //This function is used to clear Student State
  const clearStudentState = () => {
    setfirstname("");
    setlastname("");
    setfathername("");
    setmothername("");
    setcontactnumber("");
    setaadharnumber("");
    setstate("");
    setcity("");
    setaddress("");
    setcategory(null);
    setuniversityname(null);
    setcoursename(null);
    setcoursesubject("");
    settotalfee("");
    setpaidamount("");
  }

  return (
    <div className="background-container">
      <Container className="form-container">
        <h1 className="displayname">Student Details</h1>
        <Link to="/StudentList" className="student-list-link">
          <Button variant="contained" color="secondary" startIcon={<FormatListBulletedIcon />}>
            Student List
          </Button>
        </Link>

        {showUpdateAlertMessage && (
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                <strong>Data Updated SuccessFully</strong>
              </Alert>
            </Snackbar>
          </Stack>
        )}

        {showSubmitAlertMessage && (
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                <strong>Data Added SuccessFully</strong>
              </Alert>
            </Snackbar>
          </Stack>
        )}

        <form>
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <h2>Personal Information</h2>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="FirstName"
                label="First Name"
                variant="outlined"
                value={firstname}
                onChange={(e) => setfirstname(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="LastName"
                label="Last Name"
                variant="outlined"
                value={lastname}
                onChange={(e) => setlastname(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="FatherName"
                label="Father's Name"
                variant="outlined"
                value={fathername}
                onChange={(e) => setfathername(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="MotherName"
                label="Mother's Name"
                variant="outlined"
                value={mothername}
                onChange={(e) => setmothername(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="ContactNumber"
                label="Contact Number"
                variant="outlined"
                value={contactnumber}
                onChange={(e) => setcontactnumber(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12}>
              <h2>Additional Information</h2>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="AadharNumber"
                label="Aadhar Number"
                variant="outlined"
                value={aadharnumber}
                onChange={(e) => setaadharnumber(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="State"
                label="State"
                variant="outlined"
                value={state}
                onChange={(e) => setstate(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="City"
                label="City"
                variant="outlined"
                value={city}
                onChange={(e) => setcity(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="Category"
                options={Categories}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Category" />}
                value={category}
                onChange={(e, newValue) => setcategory(newValue)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="Address"
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <h2>Educational Information</h2>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="UniversityName"
                options={UniversityNames}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="University Name" />}
                value={universityname}
                onChange={(e, newValue) => setuniversityname(newValue)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="CourseName"
                options={Courses}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Course Name" />}
                value={coursename}
                onChange={(e, newValue) => setcoursename(newValue)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="Course Subject"
                label="Course Subject"
                variant="outlined"
                fullWidth
                value={coursesubject}
                onChange={(e) => setcoursesubject(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="CourseDuration"
                label="Course Duration"
                variant="outlined"
                fullWidth
              //required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="TotalFEE"
                label="Total FEE"
                variant="outlined"
                value={totalfee}
                onChange={(e) => settotalfee(e.target.value)}
                fullWidth
                required
              />

            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="PaidAmount"
                label="Paid Amount"
                variant="outlined"
                value={paidamount}
                onChange={(e) => setpaidamount(e.target.value)}
                fullWidth
                required
              />
              {/* ... (other additional information fields) */}
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="attachment">Attachment</InputLabel>
              <Input type="file" id="attachment" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              {!showUpdateButton ?
                <Button variant="contained" color="primary" startIcon={<SaveIcon />} o fullWidth onClick={handleCreate}>Submit</Button> :
                <Button variant="contained" color="primary" startIcon={<EditIcon />} o fullWidth onClick={handleUpdate}>Update</Button>
              }

            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="contained" color="error" startIcon={<RefreshIcon />} fullWidth type="reset">
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
}



export default Form;