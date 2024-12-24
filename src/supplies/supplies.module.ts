import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { Supply, SupplySchema } from './entities/supply.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [SuppliesController],
  providers: [SuppliesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Supply.name,
        schema: SupplySchema
      }
    ])
  ]
})
export class SuppliesModule {}
