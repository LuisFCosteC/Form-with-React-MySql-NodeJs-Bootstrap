/*Encuentralo de nuevo*/

import './App.css';
import {useState} from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function App() {

  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [country, setCountry] = useState("");
  const [workPosition, setWorkPosition] = useState("");
  const [yearsWork, setYearsWork] = useState();
  const [id, setId] = useState();
  
  const [edit, setEdit] = useState(false);

  const [employeesList, setEmployees] = useState([]);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      name:name,
      age:age,
      country:country,
      workPosition:workPosition,
      yearsWork:yearsWork
    }).then(() => {
      getEmployees();
      cleanSpaces();
      Swal.fire({
        title: "<strong>!Success Registration¡</strong>",
        html: "<i>!The employee <strong>" + name + "</strong> was successfully registered¡</i>",
        icon: 'success',
        timer: 3000
      })
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: JSON.parse(JSON.stringify(error)).message === "Network Error"? "Try again later": JSON.parse(JSON.stringify(error)).message
      });
    });
  }

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id:id,
      name:name,
      age:age,
      country:country,
      workPosition:workPosition,
      yearsWork:yearsWork
    }).then(() => {
      getEmployees();
      cleanSpaces();
      Swal.fire({
        title: "<strong>!Successful Update¡</strong>",
        html: "<i>! <strong>" + name + "</strong> was successfully updated¡</i>",
        icon: 'success',
        timer: 3000
      })
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: JSON.parse(JSON.stringify(error)).message === "Network Error"? "Try again later": JSON.parse(JSON.stringify(error)).message
      });
    });
  }

  const deleteEmployees = (val) => {
    Swal.fire({
      title: 'Confirm Deleted',
      html: "<i>Realmente wishes to eliminate <strong>" + val.name + "</strong> ?</i>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmployees();
          cleanSpaces();
          Swal.fire({
            icon: 'success',
            title: '<strong>' + val.name + '</strong> was eliminated.',
            showConfirmButton: false,
            timer: 2000
          });
        }).catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to remove the employee',
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error"? "Try again later": JSON.parse(JSON.stringify(error)).message
          });
        });
      }
    });
  }

  const cleanSpaces = () => {
    setName("");
    setAge("");
    setCountry("");
    setWorkPosition("");
    setYearsWork("");
    setEdit(false);
  }

  const editEmployee = (val) =>{
    setEdit (true);
    setName(val.name);
    setAge(val.age);
    setCountry(val.country);
    setWorkPosition(val.workPosition);
    setYearsWork(val.yearsWork);
    setId(val.id);
  }

  const getEmployees = () => {
    Axios.get("http://localhost:3001/employees",).then((response) => {
      setEmployees(response.data);
    })
  }

  getEmployees();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          Employee Management
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Name:</span>
            <input type="text" value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            className="form-control" placeholder="Enter your name" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
              
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Age:</span>
            <input type="number" value={age}
              onChange={(event) => {
                setAge(event.target.value);
              }}
            className="form-control" placeholder="Enter your age" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
              
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Country:</span>
            <input type="text" value={country}
              onChange={(event) => {
                setCountry(event.target.value);
              }}
            className="form-control" placeholder="Enter your country" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
              
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Work Position:</span>
            <input type="text" value={workPosition}
              onChange={(event) => {
                setWorkPosition(event.target.value);
              }}
            className="form-control" placeholder="Enter your work position" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
              
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Years of experience:</span>
            <input type="number" value={yearsWork}
              onChange={(event) => {
                setYearsWork(event.target.value);
              }}
            className="form-control" placeholder="Enter the years" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
        </div>
        <div className="card-footer text-muted">
          {
            edit === true?
            <div>
              <button className='btn btn-warning m-2' onClick={update}>Update</button>
              <button className='btn btn-info m-2' onClick={cleanSpaces}>Cancel</button>
            </div>
            :<button className='btn btn-success' onClick={add}>Register</button>
          }
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Country</th>
            <th scope="col">Work Position</th>
            <th scope="col">Experience</th>
            <th scope="col">Shares</th>
          </tr>
        </thead>
        <tbody>
          {
            employeesList.map((val,key) => {
              return <tr key={val.id}>
                        <th>{val.id}</th>
                        <td>{val.name}</td>
                        <td>{val.age}</td>
                        <td>{val.country}</td>
                        <td>{val.workPosition}</td>
                        <td>{val.yearsWork}</td>
                        <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <button type="button" 
                            onClick={() => {
                              editEmployee(val);
                            }}
                          className="btn btn-info">Edit</button>
                          <button type="button" onClick = {() => {
                            deleteEmployees(val);
                          }} className="btn btn-danger">Delete</button>
                        </div>
                        </td>
                      </tr>
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
