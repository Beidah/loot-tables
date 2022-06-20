import axios from "axios";
import { TableFormValues } from "../pages/CreateTable";

export interface Table {
  _id: string,
  name: string,
  private: boolean,
  table: {
    event: string,
    weight: number,
  }[],
}

export const submitTable = async (tableData: TableFormValues, userToken?: string) => {
  let data: Table | undefined;
  let error: string | undefined;
  try {
    if (!userToken) {
      error = 'User not logged in!'
    }

    const authorization = `Bearer ${userToken}`;
    data = (await axios.post<Table>('/api/tables', tableData, {
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

  return { data, error }
}