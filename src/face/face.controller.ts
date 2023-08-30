import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, Req } from '@nestjs/common';
import { FaceService } from './face.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { PrismaService } from 'src/database/prisma.service';
import { JsonWebToken } from 'src/modules/JsonWebToken';
import { UserByToken } from 'src/session/auth';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService, private readonly prisma: PrismaService, private readonly jsonToken: JsonWebToken, private readonly auth: UserByToken) {}

  @Get('list')
  @Render('pages/faces')
  async clientes(@Req() req, @Res() res): Promise<object>{
    try {
            
      const token = req.cookies.token || ''

      if (!token) return res.redirect('/panel/login')

      const { id: jti } = await this.auth.checkToken(token)

      if(! await this.jsonToken.checkToken(jti)) return res.redirect('/panel/login')

      const refreshToken = await this.prisma.refreshToken.findFirst({
          where: {id: jti},
          include: { User: { include: { UserImage: true } } }
      })

      const clients = await this.prisma.client.findMany()

      const products = await this.prisma.products.findMany({ include: { Attributes: true, Cards: true, ProductImages: true, categori: true} })

      const cards = await this.prisma.cards.findMany()

      const face = await this.prisma.facebook.findMany()


      return {
          pageClasses: `dashboard bg-default g-sidenav-show g-sidenav-pinned`,
          page: 'face',
          title: `Dashboard Magalu`,
          user: refreshToken.User,
          panel: true,
          userImage: refreshToken.User.UserImage?.name,
          clients,
          cards,
          products,
          face
      }
    } catch (error) {
        return res.redirect('/panel/login')
    }
  }

  @Post()
  async create(@Body() createFaceDto: CreateFaceDto) {
    return await this.faceService.create(createFaceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.faceService.remove(id);
  }
}
