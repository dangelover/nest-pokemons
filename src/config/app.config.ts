//esta funcion va a mapear las variables de entorno
export const EnvConfiguration = () => ({
  //en caso de que la variable NODE_ENV no este entonces tomara el valor de dev
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7,
});
// esto es lo mismo de arriba
// const envfn = () => {
//     return {

//     }
// }
