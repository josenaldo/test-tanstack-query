import {createFetchClient} from "@/infra/http/FetchHttpClient.ts";
import type {User} from "@/features/user/model/User.ts";


const api = createFetchClient({
  baseURL: 'http://localhost:3000'
});

const USER_API_URL = '/users';

async function getUser(id: string) {
  try{
    const url = `${USER_API_URL}/${id}`;

    const response  = await api.get<User>(url);

    return response.data;
  }catch (error) {
    console.log(error);
    throw error;
  }
}

export {getUser}