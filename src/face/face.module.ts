import { Module } from '@nestjs/common';
import { FaceService } from './face.service';
import { FaceController } from './face.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UserByToken } from 'src/session/auth';
import { JsonWebToken } from 'src/modules/JsonWebToken';
import { AppGateway } from 'src/app/app.gateway';

@Module({
  controllers: [FaceController],
  providers: [FaceService, PrismaService, UserByToken, JsonWebToken, AppGateway]
})
export class FaceModule {}
