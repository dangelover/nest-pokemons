import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';
//nuestra clase UpdatePokemonDto va a extender de la clase CreatePokemonDto para ello usamos extends
// y usamos PartialType para indicarle que seran opcionales
export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
