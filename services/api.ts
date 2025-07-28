import axios from "axios";
import { BASE_URL } from "@/constants/index.constants";

export const api = axios.create({ baseURL: BASE_URL });
