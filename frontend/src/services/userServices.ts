import axios, { AxiosRequestHeaders } from "axios";
import { Table } from "./tableServices";

const API_URL = '/api/users/';

export interface User {
  _id: string,
  name: string,
  email: string,
  tables?: Table[],
}

export const getUser = async (userId: string, tables: boolean, userToken?: string) => {
  try {
    let headers: AxiosRequestHeaders = {};

    if (userToken)
      headers.authorization = `Bearer ${userToken}`;

    const route = API_URL + userId;

    const { data } = await axios.get<User>(route, {
      headers,
    });

    if (data) return data;

    throw new Error("No data found.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        const message = (error.response.data as Error).message;
        throw new Error(message);
      }
    }

    throw error;
  }
}