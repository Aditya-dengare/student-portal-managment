import React, { useEffect, useState } from 'react';
import './Form.css';
import Button from '@mui/material/Button';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { database, storage } from "../firebase"
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useLocation, useParams } from 'react-router-dom';
import { useStudent } from '../StudentContext';
import { Alert, Snackbar, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';

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
  const [parentscontactnumber, setparentscontactnumber] = useState("");
  const [dateofbirth, setdateofbirth] = useState("");
  const [academicyear, setacademicyear] = useState("");
  const [banumbers, setbanumbers] = useState("");
  const [photo, setPhoto] = useState(null);


  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [showUpdateAlertMessage, setShowUpdateAlertMessage] = useState(false);
  const [showSubmitAlertMessage, setShowSubmitAlertMessage] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setErrors] = useState({});
  const [showNumberInput, setShowNumberInput] = useState(false);

  const value = collection(database, DBName);

  const location = useLocation();

  useEffect(() => {
    if (coursename && coursename.label === 'BA') {
      setShowNumberInput(true);
    } else {
      setShowNumberInput(false);
      setbanumbers("");
    }
  }, [coursename]);

  useEffect(() => {
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
      settotalfee(selectedStudent.TotalFEE);
      setpaidamount(selectedStudent.PaidAmount);
      setparentscontactnumber(selectedStudent.ParentsContactNumber);
      setdateofbirth(selectedStudent.DateOfBirth);
      setacademicyear(selectedStudent.AcademicYear);
      setShowUpdateButton(true);
    }
    else {
      clearStudentState();
    }
  }, [selectedStudent])

  // This function is used to validate the form
  const validateForm = () => {
    const errors = {};

    if (!firstname.trim()) {
      errors.firstname = 'First name is required';
    }

    if (!lastname.trim()) {
      errors.lastname = 'Last name is required';
    }

    if (!fathername.trim()) {
      errors.fathername = "Father's name is required";
    }

    if (!mothername.trim()) {
      errors.mothername = "Mother's name is required";
    }

    if (!contactnumber.trim()) {
      errors.contactnumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(contactnumber)) {
      errors.contactnumber = 'Contact number must be 10 digits';
    }

    if (!aadharnumber.trim()) {
      errors.aadharnumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(aadharnumber)) {
      errors.aadharnumber = 'Aadhar number must be 12 digits';
    }

    if (!state.trim()) {
      errors.state = 'State is required';
    }

    if (!city.trim()) {
      errors.city = 'City is required';
    }

    if (!address.trim()) {
      errors.address = 'Address is required';
    }

    if (!category) {
      errors.category = 'Category is required';
    }

    if (!universityname) {
      errors.universityname = 'University name is required';
    }

    if (!coursename) {
      errors.coursename = 'Course name is required';
    }

    if (!coursesubject.trim()) {
      errors.coursesubject = 'Course subject is required';
    }

    if (!totalfee.trim()) {
      errors.totalfee = 'Total fee is required';
    }

    if (!paidamount.trim()) {
      errors.paidamount = 'Paid amount is required';
    }
    if (!parentscontactnumber.trim()) {
      errors.parentscontactnumber = "Parent's contact number is required";
    }
    if (!dateofbirth.trim()) {
      errors.dateofbirth = 'Date of birth is required';
    }
    if (!academicyear.trim()) {
      errors.academicyear = 'Academic year is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    { label: 'B.COM' },
    { label: 'BA' }
  ]

  const Numbers = Array.from({ length: 13 }, (_, i) => String(i + 1));

  const handlePhotoChange = (e) => {
    if (e.target.files.length) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleDateOfBirthChange = (e) => {
    let input = e.target.value;
    // Remove non-numeric characters
    input = input.replace(/\D/g, '');

    // Insert "/" after the day and month inputs
    if (input.length > 2 && input.charAt(2) !== '/') {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    if (input.length > 5 && input.charAt(5) !== '/') {
      input = input.slice(0, 5) + '/' + input.slice(5);
    }

    setdateofbirth(input);
  };


  //This function is used to Add Student Details
  const handleCreate = async () => {
    const isValid = validateForm();
    if (isValid) {
      const docRef = await addDoc(value, {
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
        PendingAmount: totalfee - paidamount,
        ParentsContactNumber: parentscontactnumber,
        DateOfBirth: dateofbirth,
        AcademicYear: academicyear,
        Numbers: banumbers
      });
      if (photo) {
        const photoPath = `profile_photos/${docRef.id}`;
        const photoRef = ref(storage, photoPath);
        const photoURL =  await uploadBytes(photoRef, photo).then((snapshot) => {
          console.log('Uploaded a blob or file!', snapshot.ref);
          return getDownloadURL(snapshot.ref);
        });
        console.log('URL',photoURL, photoRef.fullPath);
        await updateDoc(docRef, {
          PhotoURL: photoURL,
          PhotoRefPath: photoRef.fullPath
      });
      }
      clearStudentState();
      setShowSubmitAlertMessage(true);
      setOpen(true);
    }
  };

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
      PendingAmount: totalfee - paidamount,
      ParentsContactNumber: parentscontactnumber,
      DateOfBirth: dateofbirth,
      AcademicYear: academicyear,
      Numbers: banumbers
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
    setparentscontactnumber("");
    setdateofbirth("");
    setacademicyear("");
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div className="background-container">
      <Container className="form-container">
        <div>
          <h1 className="displayname">Student Form</h1>
        </div>

        <Link to="/StudentList" className="student-list-link">
          <Button variant="contained" color="secondary" startIcon={<FormatListBulletedIcon />}>
            Student List
          </Button>
        </Link>

        <Link to="/Login" className="logout-button">
          <Button variant="contained" color="secondary" startIcon={<LogoutIcon />}>
            logout
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
                error={!!error.firstname}
                helperText={error.firstname}
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
                error={!!error.lastname}
                helperText={error.lastname}
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
                error={!!error.fathername}
                helperText={error.fathername}
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
                error={!!error.mothername}
                helperText={error.mothername}
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
                error={!!error.contactnumber}
                helperText={error.contactnumber}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="ParentsContactNumber"
                label="Parents Contact Number"
                variant="outlined"
                value={parentscontactnumber}
                onChange={(e) => setparentscontactnumber(e.target.value)}
                error={!!error.parentscontactnumber}
                helperText={error.parentscontactnumber}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="DateOfBirth"
                label="Date Of Birth"
                variant="outlined"
                value={dateofbirth}
                onChange={handleDateOfBirthChange}
                error={!!error.dateofbirth}
                helperText={error.dateofbirth}
                placeholder="DD/MM/YYYY"
                fullWidth
                required
              />
            </Grid>

            {/* <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateField']}>
                  <DateField label="Date Of Birth" onChange={(e) => setdateofbirth(e.target.value)} />
                </DemoContainer>
              </LocalizationProvider>
            </Grid> */}

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
                error={!!error.aadharnumber}
                helperText={error.aadharnumber}
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
                error={!!error.state}
                helperText={error.state}
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
                error={!!error.city}
                helperText={error.city}
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
                error={!!error.category}
                helperText={error.category}
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
                error={!!error.address}
                helperText={error.address}
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
                error={!!error.universityname}
                helperText={error.universityname}
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
                error={!!error.coursename}
                helperText={error.coursename}
              />
            </Grid>


            {showNumberInput && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-number"
                  name="1to13"
                  options={Numbers}
                  sx={{ width: '100%' }}
                  renderInput={(params) => <TextField {...params} label="Course Level" />}
                  value={banumbers}
                  onChange={(e, newValue) => setbanumbers(newValue)}
                  error={!!error.banumbers}
                  helperText={error.banumbers}
                />
              </Grid>
            )}


            <Grid item xs={12} md={6}>
              <TextField
                name="Course Subject"
                label="Course Subject"
                variant="outlined"
                fullWidth
                value={coursesubject}
                onChange={(e) => setcoursesubject(e.target.value)}
                error={!!error.coursesubject}
                helperText={error.coursesubject}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="AcademicYear"
                label="Academic Year"
                variant="outlined"
                value={academicyear}
                onChange={(e) => setacademicyear(e.target.value)}
                error={!!error.academicyear}
                helperText={error.academicyear}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="TotalFEE"
                label="Total FEE"
                variant="outlined"
                value={totalfee}
                onChange={(e) => settotalfee(e.target.value)}
                error={!!error.totalfee}
                helperText={error.totalfee}
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
                error={!!error.paidamount}
                helperText={error.paidamount}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button component="label" color="secondary" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Your Photo
                <input type="file" hidden onChange={handlePhotoChange} />
              </Button>
              { photo && <p>Selected photo: {photo.name}</p> }
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