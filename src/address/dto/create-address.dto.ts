export class CreateAddressDto {
    productId: string
    cep: string
    address: string
    number: number
    reference: string | null
    clientId: number
}
