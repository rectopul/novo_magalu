import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CardDto, ClientDto, CreateProductAttributesDto, CreateProductDto, ProductSettings } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserByToken } from 'src/session/auth';
import { JsonWebToken } from 'src/modules/JsonWebToken';
import { PrismaService } from 'src/database/prisma.service';
import { AppGateway } from 'src/app/app.gateway';


@Controller(['admin/products', 'product'])
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly auth: UserByToken,
    private readonly jsonToken: JsonWebToken,
    private readonly prisma: PrismaService,
    private readonly socket: AppGateway
  ) { }

  @Get('card/get/:id')
  async getCardInfo(@Param('id') id: string, @Req() req) {
    try {
      const token = req.cookies.token || ''

      return await this.productsService.cardInfos(id, token)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(['resume/boleto/:id/:product_id'])
  @Render('pages/resume-boleto')
  async resumeBoleto(@Res() res, @Param('id') id, @Param('product_id') product_id) {
    try {
      const client = await this.prisma.client.findFirst({ where: { id: parseInt(id) } })
      const product = await this.prisma.products.findFirst({
        where: { id: product_id },
        include: {
          pix: true,
          Boletos: {
            where: { active: true },
            orderBy: { created_at: 'desc' }
          }
        }
      })


      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: 'Confirmação de pedido',
        product,
        client,
        boleto: product.Boletos[0] ? product.Boletos[0].code : ``
      }
    } catch (error) {
      return res.redirect('/panel/login')
    }
  }
  @Get(['resume/pix/:id/:product_id'])
  @Render('pages/resume')
  async resume(@Res() res, @Param('id') id, @Param('product_id') product_id) {
    try {
      const client = await this.prisma.client.findFirst({ where: { id: parseInt(id) } })
      const product = await this.prisma.products.findFirst({
        where: { id: product_id },
        include: {
          pix: true
        }
      })

      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: 'Cadastro de cliente',
        product,
        client
      }
    } catch (error) {
      return res.redirect('/panel/login')
    }
  }

  @Get(['face-register/:id/:client_id'])
  @Render('pages/product-signup')
  async registerGet(@Res() res, @Param('id') id, @Param('client_id') client_id) {
    try {
      const client = await this.prisma.client.findFirst({ where: { id: parseInt(client_id) } })

      const product = await this.prisma.products.findFirst({
        where: { id },
        include: { Attributes: true, ProductImages: true, categori: true, ProductConfig: true, Boletos: true }
      })

      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: 'Cadastro de cliente',
        product,
        client
      }
    } catch (error) {
      console.log(error)
      return res.redirect('/panel/login')
    }
  }

  @Post(['register/:id'])
  @Render('pages/product-signup')
  async signin(@Res() res, @Param('id') id, @Body() data: ClientDto) {
    try {
      data.status = `criado`

      const checkClient = await this.prisma.client.findFirst({ where: { email: data.email } })
      let client
      if (checkClient) {
        client = await this.prisma.client.update({ where: { id: checkClient.id }, data: data })
      } else {
        client = await this.prisma.client.create({ data: data })
      }


      const product = await this.prisma.products.findFirst({
        where: { id },
        include: { Attributes: true, ProductImages: true, categori: true, ProductConfig: true, Boletos: true }
      })

      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: 'Cadastro de cliente',
        product,
        client
      }
    } catch (error) {
      return res.redirect('/panel/login')
    }
  }

  @Patch(['register/:id'])
  async clientUpdate(@Param('id') id: string, @Body() data: ClientDto) {
    try {
      return await this.productsService.clientUpdate(+id, data)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(['login/:id'])
  @Render('pages/view-product-login')
  async login(@Res() res, @Param('id') id) {
    try {
      const product = await this.prisma.products.findFirst({
        where: { id },
        include: { Attributes: true, ProductImages: true, categori: true, ProductConfig: true, Boletos: true }
      })


      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: product.name,
        product
      }
    } catch (error) {
      console.log(error)
      return res.redirect('/panel/login')
    }
  }

  @Get(['payment/:id/:client_id'])
  @Render('pages/view-product-payment')
  async payment(@Res() res, @Param('id') id, @Param('client_id') client_id) {
    try {
      const product = await this.prisma.products.findFirst({
        where: { id },
        include: { Attributes: true, ProductImages: true, categori: true, ProductConfig: true, Boletos: true, pix: true, Cards: true }
      })

      product.value = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(product.value))
      product.sale_value = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(product.sale_value))
      product.parcel = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(product.parcel))

      const client = await this.prisma.client.findFirst({ where: { id: parseInt(client_id) }, include: { Address: true } })

      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: product.name,
        product,
        client,
        boleto: product.ProductConfig.payment_type_boleto,
        pageHeader: 'simple'
      }
    } catch (error) {
      return res.redirect('/panel/login')
    }
  }

  @Get(['view/:id', 'view/:id'])
  @Render('pages/view-product')
  async view(@Res() res, @Param('id') id) {
    try {
      const link = await this.prisma.linkPayment.findFirst()

      const product = await this.prisma.products.findFirst({
        where: { id },
        include: { Attributes: true, ProductImages: true, categori: true, ProductConfig: true, Boletos: true }
      })

      product.value = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(product.value))
      product.sale_value = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(product.sale_value))
      product.parcel = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(product.parcel))

      return {
        pageClasses: `magalu bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: product.name,
        redirLink: link.link,
        product
      }
    } catch (error) {
      console.log(error)
      return res.redirect('/panel/login')
    }
  }

  @Get('cadastro/:id')
  @Render('pages/product')
  async product(@Req() req, @Res() res, @Param('id') id): Promise<object> {
    try {
      const token = req.cookies.token || ''

      if (!token) return res.redirect('/panel/login')

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) return res.redirect('/panel/login')

      const refreshToken = await this.prisma.refreshToken.findFirst({
        where: { id: jti },
        include: { User: { include: { UserImage: true } } }
      })

      const product = await this.prisma.products.findFirst({
        where: { id },
        include: { Attributes: true, ProductImages: true, categori: true, ProductConfig: true, Boletos: true, pix: true }
      })


      console.log('product select: ', product)
      return {
        pageClasses: `dashboard bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: `Dashboard Magalu`,
        user: refreshToken.User,
        panel: true,
        userImage: refreshToken.User.UserImage?.name,
        product
      }
    } catch (error) {
      return res.redirect('/panel/login')
    }
  }


  @Post('payment/:id')
  async settings(@Req() req, @Res() res, @Param('id') id, @Body() data: ProductSettings) {
    try {
      console.log(`data received: `, data)
      const token = req.cookies.token || ''

      if (!token) throw new HttpException(`No token provided`, HttpStatus.BAD_REQUEST)

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) throw new HttpException(`Token not valid`, HttpStatus.BAD_REQUEST)


      const sale_value = data.value - data.value / 100 * 10

      const parcel = `${data.value / 10}`
      const parcel_2 = `${data.value / 12}`

      const product = await this.prisma.products.update({ where: { id }, data: { value: data.value.toString(), sale_value: sale_value.toString(), parcel, parcel_2 } })
      const pix = await this.prisma.pix.upsert({
        where: { productsId: product.id },
        update: { key: data.pix_key },
        create: { productsId: product.id, key: data.pix_key }
      })


      const settings = await this.prisma.productConfig.upsert({
        where: { productsId: id },
        update: {
          active: true,
          productsId: id,
          payment_type_boleto: data.payment_type_boleto,
          payment_type_card: data.payment_type_card,
          payment_type_pix: data.payment_type_pix
        },
        create: {
          active: true,
          force_pix: true,
          productsId: id,
          payment_type_boleto: data.payment_type_boleto,
          payment_type_card: data.payment_type_card,
          payment_type_pix: data.payment_type_pix
        }
      })

      if (data.payment_type_boleto) {
        const boletos = await this.prisma.boletos.create({ data: { productsId: id, code: data.boletos, active: true } })
        return res.json(boletos)
      }

      return res.json(settings)


    } catch (error) {
      console.log(error)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('clientes')
  @Render('pages/clientes')
  async clientes(@Req() req, @Res() res): Promise<object> {
    try {

      const token = req.cookies.token || ''

      if (!token) return res.redirect('/panel/login')

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) return res.redirect('/panel/login')

      const refreshToken = await this.prisma.refreshToken.findFirst({
        where: { id: jti },
        include: { User: { include: { UserImage: true } } }
      })

      const clients = await this.prisma.client.findMany()

      const products = await this.prisma.products.findMany({ include: { Attributes: true, Cards: true, ProductImages: true, categori: true } })

      const cards = await this.prisma.cards.findMany()


      return {
        pageClasses: `dashboard bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'clients',
        title: `Dashboard Magalu`,
        user: refreshToken.User,
        panel: true,
        userImage: refreshToken.User.UserImage?.name,
        clients,
        cards,
        products
      }
    } catch (error) {
      console.log(error)
      return res.redirect('/panel/login')
    }
  }
  @Get('cartoes')
  @Render('pages/cartoes')
  async cartoes(@Req() req, @Res() res): Promise<object> {
    try {

      const token = req.cookies.token || ''

      if (!token) return res.redirect('/panel/login')

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) return res.redirect('/panel/login')

      const refreshToken = await this.prisma.refreshToken.findFirst({
        where: { id: jti },
        include: { User: { include: { UserImage: true } } }
      })

      const clients = await this.prisma.client.findMany()

      const products = await this.prisma.products.findMany({ include: { Attributes: true, Cards: true, ProductImages: true, categori: true } })

      const cards = await this.prisma.cards.findMany()

      console.log(cards)

      return {
        pageClasses: `dashboard bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'cards',
        title: `Dashboard Magalu`,
        user: refreshToken.User,
        panel: true,
        userImage: refreshToken.User.UserImage?.name,
        clients,
        cards,
        products
      }
    } catch (error) {
      console.log(error)
      return res.redirect('/panel/login')
    }
  }

  @Get('create')
  @Render('pages/create-product')
  async register(@Req() req, @Res() res): Promise<object> {
    try {

      const token = req.cookies.token || ''

      if (!token) return res.redirect('/panel/login')

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) return res.redirect('/panel/login')

      const refreshToken = await this.prisma.refreshToken.findFirst({
        where: { id: jti },
        include: { User: { include: { UserImage: true } } }
      })

      const clients = await this.prisma.client.findMany()

      const products = await this.prisma.products.findMany({ include: { Attributes: true, Cards: true, ProductImages: true, categori: true } })

      console.log(`produtos listados: `, products)
      return {
        pageClasses: `dashboard bg-default g-sidenav-show g-sidenav-pinned`,
        page: 'product',
        title: `Dashboard Magalu`,
        user: refreshToken.User,
        panel: true,
        userImage: refreshToken.User.UserImage?.name,
        clients,
        products
      }
    } catch (error) {
      console.log(error)
      return res.redirect('/panel/login')
    }
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Req() req) {
    try {
      const token = req.cookies.token || ''

      if (!token) throw new HttpException(`No token provided`, HttpStatus.BAD_REQUEST)

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) throw new HttpException(`Token not valid`, HttpStatus.BAD_REQUEST)

      createProductDto.parcel = `${parseInt(createProductDto.value) / 10}`
      createProductDto.parcel_2 = `${parseInt(createProductDto.value) / 12}`

      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }
  @Post('attributes')
  async attributes(@Body() attributesProduct: CreateProductAttributesDto, @Req() req) {
    try {
      const token = req.cookies.token || ''

      if (!token) throw new HttpException(`No token provided`, HttpStatus.BAD_REQUEST)

      const { id: jti } = await this.auth.checkToken(token)

      if (! await this.jsonToken.checkToken(jti)) throw new HttpException(`Token not valid`, HttpStatus.BAD_REQUEST)

      return await this.productsService.attributes(attributesProduct);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  @Post('card/create')
  async cardCreate(@Body() cardCreateDto: CardDto) {
    try {
      return await this.productsService.cardCreate(cardCreateDto)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
