import axios from 'axios';

class CertificadosService {

    async guardar(data) {

        return await axios.post(process.env.REACT_APP_API_HOST + "/certificados/insert", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }

    async getList() {

        return axios.get(process.env.REACT_APP_API_HOST + "/certificados/list")
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }
}

const instance = new CertificadosService();

export default instance;