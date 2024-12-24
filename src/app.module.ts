import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { SuppliesModule } from './supplies/supplies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    CategoriesModule,
    CommonModule, 
    ProductsModule, 
    AuthModule, 
    ProvidersModule, 
    SuppliesModule,
    MongooseModule.forRoot("mongodb://rodrigo:Producto12@localhost:27017/"),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
