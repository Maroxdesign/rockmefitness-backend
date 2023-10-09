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

  async create(requestData, images) {
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        return this.spacesService.uploadFile(image);
      }),
    );

    const { sizes, colors } = requestData;
    const price = parseFloat(requestData.price);
    const quantity = parseInt(requestData.quantity);

    const productData = {
      name: requestData.name,
      description: requestData.description,
      productDetails: requestData.productDetails,
      colors: colors,
      tags: requestData.tags,
      price: price,
      image: imageUrls,
      sizes: sizes,
      quantity: quantity,
      category: requestData.category,
    };

    return await this.productModel.create(productData);
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
      let imageUrls = [];

      if (files?.image?.length > 0) {
        imageUrls = await Promise.all(
          files.image.map(async (image) => {
            return this.spacesService.uploadFile(image);
          }),
        );
      }

      // Construct the updated product data
      const updatedData = {
        ...(imageUrls.length > 0 && { image: imageUrls[0] }), // Update the image URL if a new image is uploaded
        ...requestData,
      };

      const product = await this.productModel.findByIdAndUpdate(
        id,
        updatedData,
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
