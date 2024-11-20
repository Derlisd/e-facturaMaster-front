import axios from 'axios';

class TiposDocumentosService {

    async guardar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/tipo_documento/insert", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async editar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/tipo_documento/update", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getList() {

        return axios.get(process.env.REACT_APP_API_HOST + "/tipo_documento/list")
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async eliminar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/tipo_documento/delete", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async predeterminar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/tipo_documento/predeterminar", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async active(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/tipo_documento/active", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

}

const instance = new TiposDocumentosService();

export default instance;