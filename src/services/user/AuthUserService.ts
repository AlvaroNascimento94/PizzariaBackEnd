import prismaClient from "../../prisma";
import { compare } from "bcryptjs";

interface IAuth {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: IAuth) {
    const user = await prismaClient.user.findFirst({
      where: { email: email },
    });

    if (!user) throw new Error("User/passord incorrect");

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new Error("User/passord incorrect");


    

    return { ok: true };
  }
}

export { AuthUserService };
