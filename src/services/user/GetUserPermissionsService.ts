import prismaClient from "../../prisma";

interface GetUserPermissionsRequest {
  userId: string;
}

class GetUserPermissionsService {
  async execute({ userId }: GetUserPermissionsRequest) {

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        banner: true,
        active: true,
        accessProfile: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                  }
                },
                systemOption: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const permissions = user.accessProfile.permissions.map(p => ({
      systemOption: p.systemOption.name,
      permission: p.permission.name,
    }));

    const permissionsByModule: Record<string, string[]> = {};
    permissions.forEach(p => {
      if (!permissionsByModule[p.systemOption]) {
        permissionsByModule[p.systemOption] = [];
      }
      permissionsByModule[p.systemOption].push(p.permission);
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        banner: user.banner,
        active: user.active,
      },
      profile: {
        id: user.accessProfile.id,
        name: user.accessProfile.name,
      },
      permissions,
      permissionsByModule,
      summary: {
        totalPermissions: permissions.length,
        modules: Object.keys(permissionsByModule),
      }
    };
  }
}

export { GetUserPermissionsService };
