import Cookies from 'js-cookie';

class Auth {
    constructor() {
        this.authenticated = false
    }
    login(cb) {
        //console.log("we in LOgin function")        
        this.authenticated=true
        //console.log("we in LOgin function", this.authenticated)
        cb()
        
    }
    logout(cb) {
        this.authenticated=false
        Cookies.remove('auth');
        cb()
    }
    isAuthenticated() {
        return this.authenticated
    }
}

export default new Auth();