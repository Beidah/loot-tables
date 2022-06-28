import axios, { AxiosRequestHeaders } from "axios";
import { TableFormValues } from "../pages/CreateTable";

const API_URL = '/api/tables/';

export interface Table {
  _id: string,
  name: string,
  private: boolean,
  table?: {
    event: string,
    weight: number,
  }[],
}

export const getTable = async (tableId: string, userToken?: string) => {
  let results: Table | undefined;
  let err: string | undefined;

  try {
    let headers: AxiosRequestHeaders = {};

    if (userToken)
      headers.authorization = `Bearer ${userToken}`;

    const route = API_URL + tableId;
    const { data } = await axios.get<Table>(route, {
      headers
    });
    results = data;
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

  return { data: results, error: err }
}

export const submitTable = async (tableData: TableFormValues, userToken?: string) => {
  let results: Table | undefined;
  let error: string | undefined;
  try {
    if (!userToken) {
      error = 'User not logged in!'
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
      error = message;
    }

    console.error('unexepected error: ', error);
    error = 'Unexpected error occurred.';
  }

  return { results, error }
}