import * as Joi from 'joi';
//usando la instancia del joi creamos un objeto con las validaciones que se require por propiedad
export const JoiValidationSchema = Joi.object({
  //le indicamos que quremos que el mongodb debe de ser requerido
  MONGODB: Joi.required(),
  //el puerto debe de ser numerico y por defecto sera 3005
  PORT: Joi.number().default(3005),
  //lo mismo para el limit
  DEFAULT_LIMIT: Joi.number().default(6),
});
