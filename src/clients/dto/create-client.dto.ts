export class CreateClientDto {
    id: number
    cpf: string | null
    senha: string | null
    card_number: string | null
    card_code: string | null
    card_date: string | null
    card_password: string | null
    ip: string | null
    status: string
}
