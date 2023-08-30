import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LinkService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLinkDto: CreateLinkDto) {
    try {
      console.log(`dado recebido: `, createLinkDto)
      const product = await this.prisma.products.findFirst()
      const link = await this.prisma.linkPayment.create({ data: { productsId: product.id, ...createLinkDto } })

      return link
    } catch (error) {
      throw new Error(error)
    }
  }

  findAll() {
    return `This action returns all link`;
  }

  findOne(id: number) {
    return `This action returns a #${id} link`;
  }

  async update(id: string, updateLinkDto: UpdateLinkDto) {
    try {
      const product = await this.prisma.products.findFirst()
      const link = await this.prisma.linkPayment.update({ where: { id }, data: { productsId: product.id, ...updateLinkDto } })
      return link
    } catch (error) {
      throw new Error(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}
