import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  //valor minimo en un entero
  @Min(1)
  //isInt, isPositive, min 1
  no: number;
  @IsString()
  @MinLength(1)
  //isString, MinLength,1
  name: string;
}
