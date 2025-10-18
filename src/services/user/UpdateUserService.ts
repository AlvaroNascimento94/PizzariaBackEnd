import prismaClient from "../../prisma";
import { hash } from 'bcryptjs';

interface IUpdateUser {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  banner?: string;
  accessProfileId?: string;
  active?: boolean;
}

class UpdateUserService {
  async execute({ userId, name, email, password, banner, accessProfileId, active }: IUpdateUser) {
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    const dataToUpdate: any = {};

    if (name !== undefined) {
      if (!name.trim()) {
        throw new Error("Name cannot be empty");
      }
      dataToUpdate.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) {
        throw new Error("Email cannot be empty");
      }

      const emailInUse = await prismaClient.user.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          NOT: { id: userId },
        },
      });

      if (emailInUse) {
        throw new Error("Email already in use");
      }

      dataToUpdate.email = email.trim().toLowerCase();
    }

    // Atualiza a senha se fornecida
    if (password !== undefined) {
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      dataToUpdate.password = await hash(password, 16);
    }

    if (banner !== undefined) {
      dataToUpdate.banner = banner || null;
    }

    if (accessProfileId !== undefined) {
      if (!accessProfileId.trim()) {
        throw new Error("Access Profile ID cannot be empty");
      }

      const accessProfileExists = await prismaClient.accessProfile.findUnique({
        where: { id: accessProfileId },
      });

      if (!accessProfileExists) {
        throw new Error("Access Profile not found");
      }

      dataToUpdate.accessProfileId = accessProfileId;
    }

    if (active !== undefined) {
      dataToUpdate.active = active;
    }

    dataToUpdate.updatedAt = new Date();

    const userUpdated = await prismaClient.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        banner: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        accessProfile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return userUpdated;
  }
}

export { UpdateUserService };
