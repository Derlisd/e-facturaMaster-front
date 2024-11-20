import axios from 'axios';

class UserService {

    async register(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/users/register", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async controller(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/users/controller", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getListPerfiles(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/users/getListPerfiles", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }
}

const instance = new UserService();

export default instance;