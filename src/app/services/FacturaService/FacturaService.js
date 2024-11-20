import axios from 'axios';

class facturaervice {

    async create(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/factura/create", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async send(data) {  

        return await axios.post(process.env.REACT_APP_API_HOST + "/factura/send", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getList() {

        return axios.get(process.env.REACT_APP_API_HOST + "/factura/list")
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

    async get_next_sequence(data) {
        return axios.post(process.env.REACT_APP_API_HOST + "/factura/get_next_sequence", data)
        .then((response) => {
            return response;
        }).catch((error) => {
            return error.response;
        });
    }

}

const instance = new facturaervice();

export default instance;