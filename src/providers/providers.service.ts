import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Provider } from './entities/provider.entity';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProvidersService {

  constructor(
    @InjectModel(Provider.name)
    private readonly providerModel: Model<Provider>
  ){ }

  async create(createProviderDto: CreateProviderDto) {
    createProviderDto.name= createProviderDto.name.toLocaleLowerCase()

    try{
      const provider= await this.providerModel.create(createProviderDto)
      return provider
    }
    catch(error){
      this.handleExceptions(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const {limit =10, offset=0}= paginationDto
    return this.providerModel.find().limit(limit).skip(offset).sort({name:1}).select('-__v')
  }

  async findOne(id: string) {
    let provider: Provider
    //Busqueda por id
    if(isValidObjectId(id)){
      provider= await this.providerModel.findById(id)
    }
    //Busqueda por nombre
    if(!provider){
      provider = await this.providerModel.findOne({name: id.toLocaleLowerCase().trim()})
    }
    if(!provider){
      throw new NotFoundException(`Provider con id o nombre "${id}" not found`)
    }
    return provider
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const provider =await this.findOne(id)

    if(updateProviderDto.name){
      updateProviderDto.name = updateProviderDto.name.toLocaleLowerCase()

      try{
        await provider.updateOne(updateProviderDto)
        return {...provider.toJSON, ...updateProviderDto}
      }
      catch(error){
        this.handleExceptions(error)
      }
    }

  }

  async remove(id: string) {
    const {deletedCount}= await this.providerModel.deleteOne({_id:id})

    if(deletedCount === 0){
      throw new BadRequestException(`Provider con id "${id}" not found`)
    }
    
    return
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Provider ya existe en BD ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`No se puede crear el proveedor: verifique los registros del servidor`)
  }
}