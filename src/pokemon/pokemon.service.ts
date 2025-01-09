import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    //vamos a realizar la injeccion de la dependecia
    //para realizar la injeccion usamos el decorador InjectModel que viene de mongosee,
    //este pide el nombre de nuestro modelo y esto lo obtenemos de nuestra clase Pokemon que es un Entity
    @InjectModel(Pokemon.name)
    //creamos una variable que sera de tipo Model pero emitira valores del squema Pokemon
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    console.log(process.env.DEFAULT_LIMIT);
    //usamos el metodo get para obtener los valores de nuestra funcion y le pasamos por parametro el valor de la propiedad que se quiere obtener
    //le indicamos que tipo de dato va a ser manejado
    this.defaultLimit = configService.get<number>('defaultLimit');
  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      //ahora de nuestra instancia pokemonModel vamos a usar el metodo create
      //este nos pide el dto o la data que se va a insertar
      //recordemos que al extender de Document nuestra entity podemos usar los metodo de crear actualizar
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      // usando el save
      // const newPokemon = new this.pokemonModel(createPokemonDto)
      // await newPokemon.save()

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return (
      this.pokemonModel
        .find()
        .limit(limit)
        //el skip indica cuantos elementos debe de saltarse
        .skip(offset)
        //con el sort le indicamos que quremos ordernarlo en base al no y en orden ascendente por eso el 1 si quremos el descendente entonces -1
        .sort({ no: 1 })
        //y con el select agremamos que campos no queremos que se muestre
        //con el - indacamos que campos deben de excluirse y si queremos mostrar ese campo entonces solo colocamos sin el -
        .select('-__v')
    );
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    //si esto es un numero entonces
    if (!isNaN(+term)) {
      //de nuestra instancia pokemonModel vamos a usar el metodo findOne para realizar la busqueda
      //y dentro de las llaves colocamos que parametro es el que estamos buscando
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    //MongoId
    //usamos el metodo isValidObjectId para verificar si es un id de mongo
    if (!pokemon && isValidObjectId(term)) {
      //si es un id entonce usamos el metodo findById de nuestra instancia pokemonModel para realizar la busqueda en base al id
      pokemon = await this.pokemonModel.findById(term);
    }
    //Name
    //si aun no se encontro el pokemon entonces hay que buscarlo por el name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //vamos a usar el metodo findOne para realizar busquedas en base al termino de busqueda que nos pasen
    const pokemon = await this.findOne(term);
    //usamos el metodo findOne de nuestra instancia pokemonModel para buscar en base a un parametro y propiedad
    const findPokemon = await this.pokemonModel.findOne({
      no: updatePokemonDto.no,
    });
    console.log(findPokemon);
    if (findPokemon) {
      throw new BadRequestException(`Pokemon exists in db`);
    }
    //este codigo esta cambiando en el 80 se usa updateOne pasando el dto y el new en true
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }
    //usamos el metodo findOneAndUpdate para actualizar en base a un parametro
    const updatePokemon = await this.pokemonModel.findOneAndUpdate(
      { no: pokemon.no },
      updatePokemonDto,
      //este new en true signifca que va a traer el objeto actualizado
      { new: true },
    );
    return updatePokemon;
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // console.log(pokemon);
    // await this.pokemonModel.findOneAndDelete({ no: pokemon.no });
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with ${id} not found`);
    }
    return;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
