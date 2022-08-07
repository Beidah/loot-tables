import axios, { AxiosRequestHeaders } from "axios";
import { useAppSelector } from "../app/hooks";
import { selectUserToken } from "../features/auth/authSlice";

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

export type TableFormValues = {
  name: string;
  private: boolean;
  description?: string;
  events: {
    name: string;
    weight: number;
  }[];
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

    console.error('unexepected error: ', error);
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

    console.error('unexepected error: ', error);
    throw error;
  }
}

export const submitTable = async (tableData: TableFormValues, userToken?: string) => {
  try {
    if (!userToken) {
      throw new Error('User not logged in!');
    }

    const authorization = `Bearer ${userToken}`;
    const { data } = (await axios.post<Table>('/api/tables', tableData, {
      headers: {
        authorization,
      }
    }));

    if (data) return data;

    throw new Error("No data found");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        const message = (error.response.data as Error).message;
        throw new Error(message);
      }
    }

    console.error('unexepected error: ', error);
    throw error;
  }
}

export const updateTable = async (tableData: TableFormValues, tableId: string, userToken?: string) => {
  
  if (!userToken) {
    throw new Error("Need to be logged in.");
  }

  try {
    let headers ={
      authorization: `Bearer ${userToken}`
    };

    const route = API_URL + tableId;
    const { data } = await axios.patch<Table>(route, tableData, {
      headers
    });
    
    if (data) return data;

    throw new Error("No data returned");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        const message = (error.response.data as Error).message;
        throw new Error(message);
      }
    }

    console.error('unexepected error: ', error);
    throw error;
  }
}

export const deleteTable = async (tableId: string, userToken: string) => {
  try {
    const authorization = `Bearer ${userToken}`;
    await axios.delete(`/api/tables/${tableId}`, {
      headers: {
        authorization,
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        const message = (error.response.data as Error).message;
        throw new Error(message);
      }
    }

    console.error('unexepected error: ', error);
    throw error;
  }
}