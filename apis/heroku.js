import axios from 'axios'
import { TOKEN_API_HEROKU } from '@env'

const api = axios.create({
    baseURL: 'https://api.heroku.com/',
    headers: {
        Authorization: `Bearer ${TOKEN_API_HEROKU}`,
        Accept: 'application/vnd.heroku+json; version=3'
    }
})

export default api 