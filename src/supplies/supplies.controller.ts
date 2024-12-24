import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetProduct } from 'src/products/decorators/get-product.decorator';
import { Product } from 'src/products/entities/product.entity';
import { GetProvider } from 'src/providers/decorators/get-providers.decorator';
import { Provider } from 'src/providers/entities/provider.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @HttpCode(HttpStatus.OK)
  create(@Body() createSupplyDto: CreateSupplyDto,
  @GetProduct() product: Product,
  @GetProvider() provider: Provider) {
    return this.suppliesService.create(createSupplyDto, product, provider);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    //console.log({ paginationDto })PaginationDto
    return this.suppliesService.findAll(paginationDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliesService.remove(id);
  }
}
