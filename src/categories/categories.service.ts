import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>
  ) { }


  async create(createCategoryDto: CreateCategoryDto) {
    createCategoryDto.name = createCategoryDto.name.toLocaleLowerCase()
    try {
      const category = await this.categoryModel.create(createCategoryDto)
      return category
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return this.categoryModel.find()
    
      .limit(limit)
      .skip(offset)
      .sort({
        name: 1
      })
      .select('-__v')
  }

  async findOne(id: string) {
    let category: Category
    //Buscar MongoID
    if (isValidObjectId(id)) {
      category = await this.categoryModel.findById(id)
    }

    //Buscar name
    if (!category) {
      category = await this.categoryModel.findOne({ name: id.toLocaleLowerCase().trim() })
    }

    if (!category) {
      throw new NotFoundException(`Category con id, name No "${id}" not found`)
    }
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)

    if (updateCategoryDto.name) {
      updateCategoryDto.name = updateCategoryDto.name.toLocaleLowerCase()

      try {
        await category.updateOne(updateCategoryDto)
        return { ...category.toJSON, ...updateCategoryDto }
      } catch (error) {
        this.handleExceptions(error)
      }
    }

  }

  async remove(id: string) {
    const { deletedCount } = await this.categoryModel.deleteOne({ _id: id })
    if (deletedCount === 0) {
      throw new BadRequestException(`Category con id "${id}" not foud`)
    }
    return

  }


  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Category ya existe en BD ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`No se puede crear la categoria: verifique los registros del servidor`)
  }
}