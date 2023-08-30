import { Controller, Get, Post, Body, Patch, Param, Delete, Render, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async create(@Body() createRegisterDto: CreateRegisterDto) {
    try {
      return await this.registerService.create(createRegisterDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
    
  }

  @Get()
  @Render('pages/register')
  async findAll() {
    return {
      pageClasses: `bg-light g-sidenav-show g-sidenav-pinned`,
      title: `Registro Painel`
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
    return this.registerService.update(+id, updateRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registerService.remove(+id);
  }
}
