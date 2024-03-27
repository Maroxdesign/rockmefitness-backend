import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { SpacesService } from '../spaces/spaces.service';
import { Variant } from './schema/variant.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly spacesService: SpacesService,
  ) {}

  async create(requestData, files: any) {
    const imageUrl = files?.image
      ? await this.spacesService.uploadFile(files.image[0])
      : undefined;

    const variantData = {
      color: requestData.color,
      price: parseFloat(requestData.price),
      image: imageUrl,
      size: requestData.size,
      _id: uuidv4(),
    };

    const productData = {
      name: requestData.name,
      description: requestData.description,
      productDetails: requestData.productDetails,
      tags: requestData.tags,
      quantity: requestData.quantity,
      category: requestData.category,
      variants: [variantData],
    };

    return await this.productModel.create(productData);
  }

  async addVariants(productId, requestData, files: any) {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    let imageUrl = null;

    if (files?.image) {
      imageUrl = await this.spacesService.uploadFile(files.image[0]);
    }

    const variantData = {
      _id: uuidv4(),
      color: requestData.color,
      price: parseFloat(requestData.price),
      image: imageUrl,
      size: requestData.size,
    };

    product.variants.push(variantData as Variant); // Type assertion to Variant
    return await product.save();
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

  async deleteVariant(productId: string, variantId: string): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Filter out the variant with the matching _id
    const updatedVariants = product.variants.filter(
      (variant) => variant._id.toString() !== variantId,
    );

    // Update product's variants with the filtered variants
    product.variants = updatedVariants;

    // Save and return the updated product
    return await product.save();
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

  async update(id, requestData) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        requestData,
        {
          new: true,
        },
      );

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return await product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  async updateVariant(productId, variantId, requestData, files) {
    const { color, price, size } = requestData;

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const [imageUrl] = await Promise.all([
      this.spacesService.uploadFile(files?.image?.[0]),
    ]);

    const dataToUpdate: any = {};
    if (imageUrl) dataToUpdate['variants.$.image'] = imageUrl;
    if (color) dataToUpdate['variants.$.color'] = color;
    if (price) dataToUpdate['variants.$.price'] = price;
    if (size) dataToUpdate['variants.$.size'] = size;

    try {
      const updatedVariant = await this.productModel.findOneAndUpdate(
        { 'variants._id': variantId },
        { $set: dataToUpdate },
        { new: true },
      );

      if (!updatedVariant) {
        throw new NotFoundException('Variant not found');
      }

      return updatedVariant;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
