import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO: Paginar
  async findAll() {
    try {
      const products = await this.productRepository.find();
      return products;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({
      id: id,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      return new NotFoundException(`Product with ID ${id} not found`);
    }

    this.productRepository.delete({id: id});

    return;
  }

  private handleDBExceptions(error: any) {
    console.log(`handleDBExceptions(${error})`);
    if ((error.code = '23505')) {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
