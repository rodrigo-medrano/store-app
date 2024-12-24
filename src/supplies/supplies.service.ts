import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { Product } from 'src/products/entities/product.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class SuppliesService {
  
  constructor(
    @InjectModel(Supply.name)
    private readonly supplyModel: Model<Supply>
  ) { }


  async create(createSupplyDto: CreateSupplyDto, product: Product, provider: Provider) {
    
    createSupplyDto.product_id = product.id
    createSupplyDto.provider_id = provider.id

    try {
      const supply = await this.supplyModel.create(createSupplyDto)
      return supply
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return this.supplyModel.find()

      .limit(limit)
      .skip(offset)
      .select('-__v')
  }

  async findOne(id: string) {
    let supply: Supply
    //Buscar MongoID
    if (isValidObjectId(id)) {
      supply = await this.supplyModel.findById(id)
    }

    if (!supply) {
      throw new NotFoundException(`Supply con id No "${id}" not found`)
    }
    return supply
  }

  async update(id: string, updateSupplyDto: UpdateSupplyDto) {
    const supply = await this.findOne(id)

    if (updateSupplyDto.date) {
      try {
        await supply.updateOne(updateSupplyDto)
        return { ...supply.toJSON, ...updateSupplyDto }
      } catch (error) {
        this.handleExceptions(error)
      }
    }

  }

  async remove(id: string) {
    const { deletedCount } = await this.supplyModel.deleteOne({ _id: id })
    if (deletedCount === 0) {
      throw new BadRequestException(`Product con id "${id}" not foud`)
    }
    return

  }


  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Supply ya existe en BD ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`No se puede crear el supply: verifique los registros del servidor`)
  }
}