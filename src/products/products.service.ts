import { Injectable } from '@nestjs/common';
import { Cards, Client, Products } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { JsonWebToken } from 'src/modules/JsonWebToken';
import { UserByToken } from 'src/session/auth';
import { Attributes, CardDto, ClientDto, CreateProductAttributesDto, CreateProductDto, productImages } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { isValid, isExpirationDateValid, isSecurityCodeValid, getCreditCardNameByNumber } from 'creditcard.js'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly auth: UserByToken, private readonly jsonToken: JsonWebToken){}

  async cardInfos(id: string, token: string): Promise<Cards> {
    try {

      const { id: jti } = await this.auth.checkToken(token)

      if(! await this.jsonToken.checkToken(jti)) throw new Error(`Erro de autenticação`)
      
      const card = await this.prisma.cards.findFirst({ where: { id }, include: { client: { include: { Address: true }} }})

      return card;
    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  async clientUpdate(id: number, data: ClientDto): Promise<Client> {
    try {
      delete data.client_id
      const client = await this.prisma.client.update({where: {id}, data: data})

      return client;
    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  async cardCreate(cardData: CardDto): Promise<Cards> {
    try {
      const card_number = cardData.card_number.replace(/ /g, '')
      const valid = isValid(card_number)
      const card_brand: string = getCreditCardNameByNumber(card_number)

      console.log(`card`, valid, card_brand)
      
      if(!valid) throw new Error(`Cartão inválido`)

      const card = await this.prisma.cards.create({data: {card_brand, ...cardData}})

      return card
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    try {
      const category = await this.prisma.categories.create({data: { name: createProductDto.category }})
      const product = await this.prisma.products.create({ data: {
        name: createProductDto.name, 
        description: createProductDto.description, 
        categoriesId: category.id,
        sale_value: createProductDto.value,
        value: createProductDto.value
      }})

      return product;
    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  async attributes(attributesProductDto: CreateProductAttributesDto): Promise<Products> {
    try {
      console.log(`imagens criadas: `, attributesProductDto)
      const images = await this.prisma.productImages.createMany({ data: attributesProductDto.productImages })


      if(attributesProductDto.Attributes) {
        const attributes = await this.prisma.attributes.createMany({ data: attributesProductDto.Attributes })
      }

      const product = await this.prisma.products.findFirst({ 
        where: { id: attributesProductDto.productImages[0].productsId }, 
        include: { ProductImages: true, Attributes: true, categori: true}
      })

      return product;
    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
