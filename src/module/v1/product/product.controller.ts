import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  DATA_FETCH,
  PRODUCT_CREATED,
  PRODUCT_DELETED,
  PRODUCT_UPDATED,
  VARIANT_ADDED,
  VARIANT_DELETED,
  VARIANT_UPDATED,
} from '../../../common/constants/product.constants';
import { RoleEnum } from '../../../common/constants/user.constants';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../../common/decorator/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Public } from '../../../common/decorator/public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ResponseMessage(PRODUCT_CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(
    @Body() requestData,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    return await this.productService.create(requestData, files);
  }

  @ResponseMessage(VARIANT_ADDED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Patch('/:productId/add-variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async addVariants(
    @Param('productId') productId: string,
    @Body() requestData,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    return await this.productService.addVariants(productId, requestData, files);
  }

  @ResponseMessage(VARIANT_DELETED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete('/:productId/delete-variant/:variantId')
  async deleteVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return await this.productService.deleteVariant(productId, variantId);
  }

  @Public()
  @Get()
  async paginate(@Query() queryData) {
    return await this.productService.paginate(queryData);
  }

  @Public()
  @ResponseMessage(DATA_FETCH)
  @Get(':id')
  async getSingleProduct(@Param('id') id: string) {
    return await this.productService.getSingleProduct(id);
  }

  @ResponseMessage(PRODUCT_UPDATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData) {
    return await this.productService.update(id, requestData);
  }

  @ResponseMessage(PRODUCT_DELETED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }

  @ResponseMessage(VARIANT_UPDATED)
  @Patch('/:productId/update-variant/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async updateVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() requestData,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    return await this.productService.updateVariant(
      productId,
      variantId,
      requestData,
      files,
    );
  }
}
