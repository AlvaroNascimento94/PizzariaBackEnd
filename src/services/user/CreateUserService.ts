import prismaClient from "../../prisma";
import { hash } from 'bcryptjs';

interface IUser {
  name: string;
  email: string;
  password: string;
  banner?: string;
  accessProfileId: string;
  active?: boolean;
  phone: string;
}

class CreateUserService {
  async execute({ name, email, password, banner, accessProfileId, active = true, phone }: IUser) {

    if (!email || !email.trim()) {
      throw new Error("Email is required");
    }

    if (!name || !name.trim()) {
      throw new Error("Name is required");
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    if (!accessProfileId || !accessProfileId.trim()) {
      throw new Error("Access Profile is required");
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email: email.trim().toLowerCase() },
    });

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const accessProfileExists = await prismaClient.accessProfile.findUnique({
      where: { id: accessProfileId },
    });

    if (!accessProfileExists) {
      throw new Error("Access Profile not found");
    }

    const passwordHash = await hash(password, 16);

    const user = await prismaClient.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: passwordHash,
        banner: banner || null,
        accessProfileId,
        active,
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        banner: true,
        active: true,
        createdAt: true,
        accessProfile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }
}

export { CreateUserService };
