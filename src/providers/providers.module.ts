import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider, ProviderSchema } from './entities/provider.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Provider.name,
        schema: ProviderSchema
      }
    ])
  ]
})
export class ProvidersModule {}
