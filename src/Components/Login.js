import React from "react";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";



function Login() {

    const [usernameReg, setUsernameReg] = useState ("");
    const [genderReg, setGenderReg] = useState ("");
    const [locationReg, setLocationReg] = useState ("");
    const [emailReg, setEmailReg] = useState ("");
    //const [phoneReg, setPhoneReg] = useState ("");
    //const [dateReg, setDateReg] = useState ("");
    

    const register1 = () => {
      axios.post("http://localhost:9000/register", {
      username: usernameReg,
      gender: genderReg,
      location: locationReg,
      email: emailReg,
      //phone: phoneReg,
      //date: dateReg,



    }).then((response) => {
      if (response.status === 200) {
        // todo: route to "main" component
      }
      console.log(response);
    });

      }; //end register




    


    return(
    <div className="App">
      <div className="Registration"></div>


      <form>
    <h1> Registration</h1>

      <br />
   
    <input placeholder="username" type="text"
        onChange={(e) => {
        setUsernameReg(e.target.value);
    }}
    />
   
   <br />

    <input placeholder="Gender" type="text"
      onChange={(e) => {
        setGenderReg(e.target.value);
    }}/>

    <br />
    <input placeholder="Location" type="text"
      onChange={(e) => {
        setLocationReg(e.target.value);
    }}/>

    <br />
    <input placeholder="Email" type="text"
      onChange={(e) => {
        setEmailReg(e.target.value);
    }}/>


     <br />



    <button onClick={register1}>Register</button>
    </form>
    

      </div>
    
    );
    }

    export default Login;