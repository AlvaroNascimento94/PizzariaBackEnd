import prismaClient from "../../prisma";

class DetailUserService {
  async execute(user_id: string) {
    if (!user_id || !user_id.trim()) {
      throw new Error("User ID is required");
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        banner: true,
        active: true,
        phone: true,
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

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

export { DetailUserService };
