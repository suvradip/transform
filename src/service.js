import axios from 'axios';

const API_ROOT = 'http://localhost:8888/api/hc-fc/';

/* common response parser */
const responseBody = response => response.data;

export default {
   post: payload => axios.post(API_ROOT, payload).then(responseBody),
};
