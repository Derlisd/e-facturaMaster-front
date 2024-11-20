import axios from 'axios';

class ControllerService {

    async controller(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/controller/inject", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getList(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/controller/getList", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getListFilter(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/controller/getListFilter", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

}

const instance = new ControllerService();

export default instance;