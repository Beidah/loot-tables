import axios, { AxiosRequestHeaders } from "axios";
import { TableFormValues } from "../pages/CreateTable";

const API_URL = '/api/tables/';

export interface Table {
  _id: string,
  name: string,
  private: boolean,
  description?: string,
  events?: {
    _id: string,
    name: string,
    weight: number,
  }[],
  user: {
    _id: string,
    name: string,
  }
}

export const getAllTables = async(userToken?: string) => {
  try {
    let headers: AxiosRequestHeaders = {};

    if (userToken)
      headers.authorization = `Bearer ${userToken}`;

    const route = API_URL;
    const { data } = await axios.get<Table[]>(route, {
      headers
    });
    
    if (data) return data;

    throw new Error("No data found");
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

export const getTable = async (tableId: string, userToken?: string) => {
  try {
    let headers: AxiosRequestHeaders = {};

    if (userToken)
      headers.authorization = `Bearer ${userToken}`;

    const route = API_URL + tableId;
    const { data } = await axios.get<Table>(route, {
      headers
    });
    
    if (data) return data;

    throw new Error("No data found");
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

export const submitTable = async (tableData: TableFormValues, userToken?: string) => {
  let results: Table | undefined;
  let err: string | undefined;
  try {
    if (!userToken) {
      err = 'User not logged in!'
    }

    const authorization = `Bearer ${userToken}`;
    results = (await axios.post<Table>('/api/tables', tableData, {
      headers: {
        authorization,
      }
    })).data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let message = '';
      if (error.response && error.response.data) {
        message = (error.response.data as Error).message;
      } else {
        message = error.message;
      }
      err = message;
    }

    console.error('unexepected error: ', error);
    err = 'Unexpected error occurred.';
  }

  return { results, error: err }
}