import axios from 'axios'
import { SERVER_URL } from './constants';

/*
data = {
education: "religious school"
email: "email"
gender: "gender"
genderPref: "Man"
location: "location"
locationPref: "North"
numOfKids: "one"
username: "name"
}
*/

export const register = (data, navigate) => {
    axios.post(SERVER_URL + "/register", {
        data
    }).then((response) => {
        if (response.status === 200) {
            navigate('/Results', { state: response.data })
        }
    });

}; //end register


export const results = (id, setResults) => {
    axios.get(SERVER_URL + `/calcpref/${id}`).then((response) => {
        if (response.status === 200) {
            setResults(response.data);
        }
    });
}; 


export const stableMatching = (setResults) => {
    axios.get(SERVER_URL + `/matching`).then((response) => {
        if (response.status === 200) {
            setResults(response.data);
        }
    });
}; 

