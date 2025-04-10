import axios from "axios";

const usersApi = axios.create({
  baseURL: "http://localhost:5000/api/v1/users", // Adjust based on your backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable if using cookies/sessions
});

export default usersApi;
