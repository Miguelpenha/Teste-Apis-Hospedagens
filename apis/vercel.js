import axios from 'axios'
import { TOKEN_API_VERCEL } from '@env'

const api = axios.create({
    baseURL: 'https://api.vercel.com',
    headers: {
        Authorization: `Bearer ${TOKEN_API_VERCEL}`
    }
})

export default api 