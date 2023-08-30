import { Module } from '@nestjs/common';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginController } from './login/login.controller';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';
import { RegisterModule } from './register/register.module';
import { ProductsModule } from './products/products.module';
import { AddressModule } from './address/address.module';
import { FaceModule } from './face/face.module';
import { LinkModule } from './link/link.module';

@Module({
  imports: [DashboardModule, SessionModule, UsersModule, ClientsModule, AccountModule, RegisterModule, ProductsModule, AddressModule, FaceModule, LinkModule],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule {}
