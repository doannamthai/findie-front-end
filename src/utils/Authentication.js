import {Component} from 'react';


const user_id = "user_id";
const username = "username";

class Authentication extends Component {
    static isLoggedIn(){
        return localStorage.getItem(user_id) ? true : false;
    }

    static setAccessToken(id, uname){
        localStorage.setItem(username, uname);
        localStorage.setItem(user_id, id);
    }
    
    static deleteSession(){
        localStorage.removeItem(username);
        localStorage.removeItem(user_id);
    }
    static getUserId(){
        return parseInt(localStorage.getItem(user_id));
    }

    static getUsername(){
        return localStorage.get(username);
    }
}

export default Authentication;