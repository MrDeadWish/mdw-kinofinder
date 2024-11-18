import axios from 'axios';

// Настройки для axios
const api = axios.create({
    baseURL: 'https://kinopoiskapiunofficial.tech/api/v2.2',
    headers: {
        'X-API-KEY': 'c21f5cbd-d457-445d-ae24-8d899fa09727',
    },
});

export default api;
