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

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link`;
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}
