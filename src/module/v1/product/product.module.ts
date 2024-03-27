import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { SpacesModule } from '../spaces/spaces.module';
import { Variant, VariantSchema } from './schema/variant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
    ]),
    SpacesModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
