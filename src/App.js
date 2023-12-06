import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Form from './Pages/Form';
import StudentList from './Pages/StudentList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='*' Component={Form}></Route>
        <Route path="/studentlist" element={<StudentList />} />
      </Routes>
    </Router>
  );
}

export default App;
// import { db } from "./firebase";
// import { uid } from "uid";
// import { set, ref, onValue, remove, update } from "firebase/database";
// import { useState, useEffect } from "react";

// function App() {
//   const [name, setName] = useState(""); 
//   const [names, setNames] = useState([]);
//   const [isEdit, setisEdit] = useState(false);
//   const [nameUuid, setTempUuid] = useState("");
//   const handleToDoChange = (e) => {
//     setName(e.target.value);
//   }

//   //read student
//   useEffect(() => {
//     onValue(ref(db), (snapshot) => {
//       setNames([]);
//       const data = snapshot.val();
//       if(data !== null)
//       {
//         Object.values(data).map((name) => {
//           setNames((oldArray) => [...oldArray,name]);
//         })
//       }
//     });
//   }, []);

//   //create student
//   const writeToDatabase = () => {
//     const uuid = uid();
//     set(ref(db, `/${uuid}`),{
//       name,
//       uuid
//     })

//     setName("");
//   };

//   //delete student
//   const handleDelete = (name) => {
//     remove(ref(db, `/${name.uuid}`));
//   }

//   //update Student
//   const handleUpdate = (name) => {
//     setisEdit(true);
//     setTempUuid(name.uuid);
//     setName(name.name);
//   };

//   const handleSubmitChange = () => {
//     update(ref(db, `/${nameUuid}`),{
//       name,
//       uuid: nameUuid,
//     });

//     setName("");
//     setisEdit(false);
//   }
  
//   return (
//     <div className="App">
//       <input type="text" value={name} onChange={handleToDoChange} />
//       {isEdit ? (
//       <>
//         <button type="submit" onClick={handleSubmitChange} >Submit Change</button>
//         <button onClick={() => {
//           setisEdit(false);
//           setName("");
//         }}>X</button>
//       </>
//       ) : (
      
//       <button type="submit" onClick={writeToDatabase} >Submit</button>)}

//         <table className="table">
//           <thead>
//             <tr>
//               <th>Firstname</th>
//               <th>Action</th>
//             </tr>
//             <tbody>
//               {names.map((name) => (
//                 <>
//                   <tr>
//                     <td>{name.name}</td>
//                     <td>
//                       <button type="submit" onClick={() => handleUpdate(name)}>Update</button>
//                       <button type="submit" onClick={() => handleDelete(name)}>delete</button>
//                     </td>
//                   </tr>
//                 </>
//               ))}
//             </tbody>
//           </thead>
//         </table>

//       {/* {names.map((name) => (
//         <>
//           <h1>{name.name}</h1>
//           <button type="submit" onClick={() => handleUpdate(name)}>Update</button>
//           <button type="submit" onClick={() => handleDelete(name)}>delete</button>
//         </>
//       ))} */}
//     </div>
//   );
// }

// export default App;