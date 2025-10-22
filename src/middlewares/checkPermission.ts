import { NextFunction, Request, Response } from "express";
import prismaClient from "../prisma";

interface PermissionCheck {
  systemOption: string;
  permission: "CREATE" | "READ" | "UPDATE" | "DELETE";
}

export function checkPermission(
  systemOption: string,
  permission: "CREATE" | "READ" | "UPDATE" | "DELETE"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: "Usuário não autenticado",
        });
      }

      const requestedUserId = req.params.userId;
      const isSelfProfile = requestedUserId && requestedUserId === userId;

      if (isSelfProfile && (permission === "READ" || permission === "UPDATE")) {
        return next();
      }

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: {
          accessProfile: {
            include: {
              permissions: {
                include: {
                  permission: true,
                  systemOption: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      if (!user.active) {
        return res.status(403).json({
          error: "Usuário inativo",
        });
      }

      const hasPermission = user.accessProfile.permissions.some(
        (profilePermission) =>
          profilePermission.systemOption.name === systemOption &&
          profilePermission.permission.name === permission
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: "Acesso negado",
          message: `Você não tem permissão de ${permission} em ${systemOption}`,
          required: {
            systemOption,
            permission,
          },
          userProfile: user.accessProfile.name,
        });
      }

      req.userProfile = user.accessProfile.name;
      req.userPermissions = user.accessProfile.permissions.map((p) => ({
        option: p.systemOption.name,
        permission: p.permission.name,
      }));

      next();
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return res.status(500).json({
        error: "Erro ao verificar permissão",
      });
    }
  };
}
