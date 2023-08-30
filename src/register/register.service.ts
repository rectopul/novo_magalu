import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaService){}

  async create(createRegisterDto: CreateRegisterDto) {
    try {
      createRegisterDto.status = `criado`
      const client = await this.prisma.client.create({ data: createRegisterDto })

      const product = await this.prisma.products.findFirst({ where: { id: createRegisterDto.productId }})

      return { client, product }
    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  findAll() {
    return `This action returns all register`;
  }

  findOne(id: number) {
    return `This action returns a #${id} register`;
  }

  update(id: number, updateRegisterDto: UpdateRegisterDto) {
    return `This action updates a #${id} register`;
  }

  remove(id: number) {
    return `This action removes a #${id} register`;
  }
}
