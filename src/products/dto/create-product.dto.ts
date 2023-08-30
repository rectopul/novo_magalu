export type Attributes = {
    name: string
    value: string
    productsId: string | null
}

export type CardDto = {
    card_number: string
    card_cvv: string
    card_validade: string
    card_name: string
    card_document: string | null
    productsId: string
    clientId: number | null
}

export type ClientDto = {
    user: string | null
    email: string | null
    phone: string | null
    password: string | null
    cpf: string | null
    cnpj: string | null
    ip: string | null
    status: string
    productId: string | null
    data_nascimento: string | null
    client_id: string | null
}

export type ProductSettings = {
    payment_type_pix: boolean
    payment_type_boleto: boolean
    payment_type_card: boolean
    pix_key: string | null
    active: boolean
    boletos: string | null
    value: number
}

export type productImages = {
    name: string
    url: string
    productsId: string | null
}

export class CreateProductAttributesDto {
    Attributes:  Attributes[]
    productImages: productImages[]
}

export class CreateProductDto {
    name: string
    description: string
    value: string
    sale_value: string
    parcel: string | null
    parcel_2: string | null
    category: string
    categoriesId: string | null
    Attributes:  Attributes[]
    productImages: productImages[]
}
