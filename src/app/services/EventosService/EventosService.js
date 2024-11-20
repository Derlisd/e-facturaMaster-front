import axios from 'axios';

class EventosService {

    async sendService(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/eventos/send-service", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error;
            });
    }


    async getList(data) {

        return axios.post(process.env.REACT_APP_API_HOST + "/eventos/list", data)
            .then((response) => {
                return response;
            }).catch((error) => {
                return error.response;
            });
    }
}

const instance = new EventosService();

export default instance;