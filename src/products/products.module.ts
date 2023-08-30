import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UserByToken } from 'src/session/auth';
import { JsonWebToken } from 'src/modules/JsonWebToken';
import { PrismaService } from 'src/database/prisma.service';
import { AppGateway } from 'src/app/app.gateway';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, UserByToken, JsonWebToken, PrismaService, AppGateway]
})
export class ProductsModule {}
