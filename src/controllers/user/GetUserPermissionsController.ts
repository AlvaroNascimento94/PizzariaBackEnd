import { Request, Response } from "express";
import { GetUserPermissionsService } from "../../services/user/GetUserPermissionsService";

class GetUserPermissionsController {
  async handle(req: Request, res: Response) {
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado' 
      });
    }

    const getUserPermissionsService = new GetUserPermissionsService();

    try {
      const permissions = await getUserPermissionsService.execute({ userId });

      return res.json(permissions);
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      return res.status(400).json({ 
        error: error.message 
      });
    }
  }
}

export { GetUserPermissionsController };
