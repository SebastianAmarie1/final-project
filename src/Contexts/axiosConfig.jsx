import axios from "axios" // connects to the axios server

export default axios.create({
    baseURL: process.env.REACT_APP_BASEURL
})