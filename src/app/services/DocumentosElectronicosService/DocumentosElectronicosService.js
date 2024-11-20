import axios from 'axios';

class DocumentosElectronicosService {

    async consulta(data) {
        
        return await axios.post(process.env.REACT_APP_API_HOST + '/documentos_electronicos/consulta', data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }
    async kude(data) {
        return await axios.post(process.env.REACT_APP_API_HOST + '/documentos_electronicos/kude', {
            cdc: data.cdc,
            tipo: 'view'
        }, {
            responseType: 'blob'
        }).then((response) => {
            return response;
        }).catch((error) => {
            return error.response;
        });
    }

    async xml(data) {
        return await axios.post(process.env.REACT_APP_API_HOST + '/documentos_electronicos/xml', {
            cdc: data.cdc,
            tipo: 'view'
        }, {
            responseType: 'blob'
        }).then((response) => {
            return response;
        }).catch((error) => {
            return error.response;
        });
    }

    async getList(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/documentos_electronicos/list", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async active(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/documentos_electronicos/active", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

}

const instance = new DocumentosElectronicosService();

export default instance;