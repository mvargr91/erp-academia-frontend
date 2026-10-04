import axios from 'axios';
import environment from '../../../env';

const apiConfig = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-Academia': environment.ACADEMIA,
  },
});
export default apiConfig;
