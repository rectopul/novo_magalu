import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { JsonWebToken } from '../modules/JsonWebToken';
import { SessionService } from '../session/session.service';
import { User } from '@prisma/client';
import { UserByToken } from 'src/session/auth';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService, 
    private jsonWebToken: JsonWebToken, 
    private session: SessionService,
    private  readonly auth: UserByToken
  ){}


  async create(token: string | null, createUserDto: CreateUserDto): Promise<object> {
    try {

      //check if exist users
      const users = await this.prisma.user.count()

      if(users) await this.auth.checkToken(token)

      createUserDto.password_hash = bcrypt.hashSync(createUserDto.password, 12)

      delete createUserDto.password

      const jti = uuidv4()

      if(!process.env.APP_SECRET || !process.env.JWT_REFRESH_SECRET) throw new Error(`Please create the app-secret`)

      const user = await this.prisma.user.create({data: createUserDto})

      const { accessToken, refreshToken } = this.jsonWebToken.generateTokens({user: user, jti})

      const tokenToWhitelist = await this.session.addRefreshTokenToWhitelist({jti, refreshToken, userId: user.id})

      return {
        user,
        accessToken,
        tokenToWhitelist
      }
    } catch (error) {
      console.log(error)
      throw new Error(error?.message || error?.error)
    }
    
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(token: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { id: jti } = await this.auth.checkToken(token)

      if(! await this.jsonWebToken.checkToken(jti)) throw new Error(`Permissão não concedida`)

      const refreshToken = await this.prisma.refreshToken.findFirst({
          where: {id: jti},
          include: { User: { include: { UserImage: true } } }
      })

      if(!refreshToken) throw new Error(`User not exist`)

      updateUserDto.password_hash = bcrypt.hashSync(updateUserDto.password, 12)

      delete updateUserDto.password

      const newUser = await this.prisma.user.update({where: { id: refreshToken.User.id }, data:updateUserDto })

      return newUser
    } catch (error) {
      console.log(error)
      throw new Error(error?.message || error?.error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
