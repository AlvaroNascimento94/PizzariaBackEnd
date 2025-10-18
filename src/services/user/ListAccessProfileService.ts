import prismaClient from "../../prisma";

class ListAccessProfileService {
  async execute() {
    const accessProfiles = await prismaClient.accessProfile.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return accessProfiles;
  }
}

export { ListAccessProfileService };
