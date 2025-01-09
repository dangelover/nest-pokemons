export interface HttpAdapter {
  //nuestra interface va a manejar un metodo que va a trabajar con data de tipo T y va a retornar una promesa de tipo T
  get<T>(url: string): Promise<T>;
}
