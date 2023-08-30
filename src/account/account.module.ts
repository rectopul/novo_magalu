import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AppGateway } from 'src/app/app.gateway';
import { AccountController } from './account.controller';

@Module({
  controllers: [AccountController],
  providers: [PrismaService, AppGateway]
})
export class AccountModule {}
