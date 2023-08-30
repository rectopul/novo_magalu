import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService, private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    try {
      return await this.addressService.create(createAddressDto);
    } catch (error) {
      console.log(`erro ao cadastrar endereço: `, error, createAddressDto)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
    
  }

  @Get('register/:id/:product_id')
  @Render('pages/address')
  async findOne(@Param('id') id: string, @Param('product_id') product_id, @Res() res) {
    try {
      const client_id = parseInt(id)
      const client = await this.prisma.client.findFirst({ where: { id: client_id }})
      const product = await this.prisma.products.findFirst({ where: { id: product_id }})

      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: 'Informações de entrega',
        client,
        product
      }
    } catch (error) {
      console.log(`erro in address: `, error)
      return res.redirect('/panel/login')
    }
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
