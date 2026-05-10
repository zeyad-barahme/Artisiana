import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    "https://firestore.googleapis.com/v1/projects/artisianaapp/databases/(default)/documents",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
