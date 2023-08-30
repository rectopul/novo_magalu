import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
    const password_hash = bcrypt.hashSync('123mudar', 12)
    const user = await prisma.user.create({
        data: {
            type: 'super',
            user: 'admin',
            name: 'admin',
            password_hash
        },
    });
    console.log('User created:', user);
}

main()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });