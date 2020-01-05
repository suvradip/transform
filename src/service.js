import axios from 'axios';

const { origin } = window.location;
const API_ROOT = `${origin}/api/hc-fc/`;

/* common response parser */
const responseBody = response => response.data;

export default {
   post: payload => axios.post(API_ROOT, payload).then(responseBody),
};
