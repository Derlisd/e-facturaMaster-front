import axios from 'axios';

class EmpresasService {

    async guardar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/empresas/insert", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async editar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/empresas/update", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getList() {

        return axios.get(process.env.REACT_APP_API_HOST + "/empresas/list")
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async eliminar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/empresas/delete", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async predeterminar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/empresas/predeterminar", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async active(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/empresas/active", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

}

const instance = new EmpresasService();

export default instance;