import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

  @ApiProperty({
    example: '12bf3ac9-ce34-47db-8c61-dc2c29394fb8',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: 'Men’s Chill Crew Neck Sweatshirt',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string;

  @ApiProperty({
    example: '75',
    description: 'Product Price',
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    example: 'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.',
    description: 'Product Description',
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 'mens_chill_crew_neck_sweatshirt',
    description: 'Product Slug - for SEO Routes',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: '7',
    description: 'Product Stock',
    default: 0
  })
  @Column('int', {
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ["XS", "S", "M", "L", "XL", "XXL"],
    description: 'Product Sizes',
  })
  @Column('text', {
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Product Gender',
  })
  @Column('text')
  gender: string;
  
  @ApiProperty({
    example: ["sweatshirt"],
    description: 'Product Tags',
    default: []
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @ApiProperty({
    example: '["1740176-00-A_0_2000.jpg", "1740176-00-A_1.jpg"]',
    description: 'Product Images',
  })
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {cascade: true, eager: true}
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    {eager: true}
  )
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }
}
