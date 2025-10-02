import prismaClient from "../../prisma";
import {hash} from 'bcryptjs';

interface IUser {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: IUser) {
    if (!email) {
      throw new Error("Email incorrect");
    }
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const passwordHash = await hash(password,16)

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select:{
        id:true,
        name:true,
        email:true
      }
    });

    return user;
  }
}

export { CreateUserService };
