import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // constructor(private pokemonService: PokemonService) {}
  // async executeSeed() {
  //   const { data } = await this.axios.get<PokeResponse>(
  //     'https://pokeapi.co/api/v2/pokemon?limit=10',
  //   );
  //   let pokemons: CreatePokemonDto[] = [];
  //   data.results.forEach(({ name, url }) => {
  //     //creamos un arreglo separando los elementos en base al / con el metodo split
  //     const segments = url.split('/');
  //     //luego tomamos el penultimo valor de este arreglo para el no
  //     const no: number = +segments[segments.length - 2];
  //     console.log({ name, no });
  //     const dto: CreatePokemonDto = {
  //       no: no,
  //       name: name,
  //     };
  //     pokemons.push(dto);
  //   });
  //   for await (const po of pokemons) {
  //     const pokemon = await this.pokemonService.create(po);
  //     console.log(pokemon);
  //   }
  //   return data.results;
  // }
  //si queremos usar el model entonces se debe de exportar en el modulo
  // constructor(
  //   @InjectModel(Pokemon.name)
  //   private readonly pokemonModel: Model<Pokemon>,
  // ) {}
  // async executeSeed() {
  //   await this.pokemonModel.deleteMany({});
  //   const { data } = await this.axios.get<PokeResponse>(
  //     'https://pokeapi.co/api/v2/pokemon?limit=10',
  //   );
  //   const insertPromisesArray = [];
  //   data.results.forEach(({ name, url }) => {
  //     //creamos un arreglo separando los elementos en base al / con el metodo split
  //     const segments = url.split('/');
  //     //luego tomamos el penultimo valor de este arreglo para el no
  //     const no: number = +segments[segments.length - 2];
  //     //const pokemon = await this.pokemonModel.create({ name, no });
  //     insertPromisesArray.push(this.pokemonModel.create({ name, no }));
  //   });
  //   await Promise.all(insertPromisesArray);
  //   return 'Seed executes';
  // }
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}
  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemonToInsert: { name: string; no: number }[] = [];
    data.results.forEach(({ name, url }) => {
      //creamos un arreglo separando los elementos en base al / con el metodo split
      const segments = url.split('/');
      //luego tomamos el penultimo valor de este arreglo para el no
      const no: number = +segments[segments.length - 2];
      //const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no });
    });
    this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executes';
  }
}
