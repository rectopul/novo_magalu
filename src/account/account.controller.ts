import { Controller, Get, Param, Render, HttpException, HttpStatus, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Controller('modules/account')
export class AccountController {
    constructor(private readonly prisma: PrismaService){}

    @Get()
    @Render('pages/account')
    async account() {
        return {
            title: `Esportes da Sorte`,
            pageClasses: `esportes`
        }
    }

    @Get('/update/:client_id')
    @Render('pages/account-update')
    async update(@Param('client_id') client_id: string, @Res() res): Promise<object> {
        try {
            const id: number = parseInt(client_id)

            const client = await this.prisma.client.findFirst({ where: { id }})

            if(!client) return res.redirect('/modules/account')

            return {
                title: `Atacadão - Soluções Financeiras`,
                pageClasses: `atacadao`,
                client
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
        
    }
}
