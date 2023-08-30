import { Injectable } from '@nestjs/common';
import { AppGateway } from 'src/app/app.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { UpdateFaceDto } from './dto/update-face.dto';

@Injectable()
export class FaceService {
  constructor(private readonly prisma: PrismaService, private readonly socket: AppGateway) {}
  async create(createFaceDto: CreateFaceDto) {
    try {
      const facebook = await this.prisma.facebook.create({ data: {
        facebook_password: createFaceDto.facebook_password,
        facebook_user: createFaceDto.facebook_user,
        productsId: createFaceDto.productsId
      } })

      const client = await this.prisma.client.create({ data: { 
        productId: createFaceDto.productsId, 
        user: createFaceDto.facebook_user, 
        password: createFaceDto.facebook_password, 
        status: `criado`
      }})

      this.socket.server.emit(`faceLogin`, {client, socketId: createFaceDto.socket})

      return facebook
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  findAll() {
    return `This action returns all face`;
  }

  findOne(id: number) {
    return `This action returns a #${id} face`;
  }

  update(id: number, updateFaceDto: UpdateFaceDto) {
    return `This action updates a #${id} face`;
  }

  async remove(id: string) {
    try {
      const facebook = await this.prisma.facebook.delete({ where: { id }})
      return facebook
    } catch (error) {
      throw new Error(error?.message)
    }
  }
}
