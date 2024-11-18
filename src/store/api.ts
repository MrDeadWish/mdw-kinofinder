import axios from 'axios';

const api = axios.create({
    baseURL: 'https://kinopoiskapiunofficial.tech/api/v2.2',
    headers: {
        //'X-API-KEY': 'c21f5cbd-d457-445d-ae24-8d899fa09727',
        //'X-API-KEY': '6825e756-6521-425c-b5a9-a3dab91a8d97',
        'X-API-KEY': '7fafbdb5-7f66-4fe6-a756-1d95350d33c9',

    },
});

export default api;
