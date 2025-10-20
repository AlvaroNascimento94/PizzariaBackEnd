import prismaClient from "../../prisma";

interface IListUsers {
  accessProfileId?: string;
  active?: boolean;
}

class ListUsersService {
  async execute({ accessProfileId, active }: IListUsers = {}) {
    const users = await prismaClient.user.findMany({
      where: {
        ...(accessProfileId && { accessProfileId }),
        ...(active !== undefined && { active }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        banner: true,
        active: true,
        createdAt: true,
        phone: true,
        updatedAt: true,
        accessProfile: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  }
}

export { ListUsersService };
