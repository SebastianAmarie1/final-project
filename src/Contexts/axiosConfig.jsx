import axios from "axios" // connects to the axios server

export default axios.create({
    baseURL: "http://localhost:5000"
})