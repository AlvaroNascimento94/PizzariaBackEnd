import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

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

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.SECRET_JWT,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    return { id: user.id, name: user.name, email: user.email, token: token };
  }
}

export { AuthUserService };
