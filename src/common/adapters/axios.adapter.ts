import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interface/http-adapter.interface';
import { Injectable } from '@nestjs/common';
//para que podamos usarlo en otro lado debemos convertirlo en un injectable
@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs');
    }
  }
}
