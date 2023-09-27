import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { SpacesService } from '../spaces/spaces.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly spacesService: SpacesService,
  ) {}

  async create(requestData, files) {
    const [imageUrl] = await Promise.all([
      this.spacesService.uploadFile(files?.image?.length > 0 && files.image[0]),
    ]);
    return await this.productModel.create({
      image: imageUrl,
      ...requestData,
    });
  }

  async paginate(query: any) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.productModel.count();
    const response = await this.productModel
      .find()
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort });

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async delete(id) {
    const product = await this.productModel.findByIdAndDelete({
      _id: id,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return;
  }

  async update(id, requestData, files) {
    try {
      const [imageUrl] = await Promise.all([
        this.spacesService.uploadFile(
          files?.image?.length > 0 && files.image[0],
        ),
      ]);

      const product = await this.productModel.findByIdAndUpdate(
        id,
        {
          image: imageUrl,
          ...requestData,
        },
        {
          new: true,
        },
      );

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSingleProduct(id) {
    const product = await this.productModel.findOne({
      _id: id,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
