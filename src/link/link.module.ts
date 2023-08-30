import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [LinkController],
  providers: [LinkService, PrismaService]
})
export class LinkModule { }
