import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService){}
  async create(createAddressDto: CreateAddressDto) {
    try {
      const product = await this.prisma.products.findFirst({ where: { id: createAddressDto.productId }})
      delete createAddressDto.productId
      const checkAddress = await this.prisma.address.findFirst({ where: { clientId: createAddressDto.clientId }})
      let address

      if(checkAddress) {
        address = await this.prisma.address.update({ data: createAddressDto, where: { clientId: createAddressDto.clientId} })
      }else{
        address = await this.prisma.address.create({ data: createAddressDto })
      }
      

      return { address, product }
    } catch (error) {
      console.log(`erro ao criar endereco`, error)
      throw new Error(error?.message)
    }
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
