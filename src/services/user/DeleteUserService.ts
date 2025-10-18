import prismaClient from "../../prisma";

interface IDeleteUser {
  userId: string;
}

class DeleteUserService {
  async execute({ userId }: IDeleteUser) {

    if (!userId || !userId.trim()) {
      throw new Error("User ID is required");
    }

    const userExists = await prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    if (userExists._count.orders > 0) {
      throw new Error(
        `Cannot delete user. User has ${userExists._count.orders} order(s) associated. Consider deactivating the user instead.`
      );
    }

    await prismaClient.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  }
}

export { DeleteUserService };
