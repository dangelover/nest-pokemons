import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
//Se recomienda el no usar Document
// export class Pokemon extends Document {
//   //id: string; //Mongo lo genera
//   @Prop({
//     unique: true,
//     index: true,
//   })
//   name: string;
//   @Prop({
//     unique: true,
//     index: true,
//   })
//   no: number;
// }
export class Pokemon {
  //id: string; //Mongo lo genera
  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
