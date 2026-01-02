import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserControler {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    const detailUserService = new DetailUserService();

    try {
      const user = await detailUserService.execute(userId);
      return res.json(user);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export { DetailUserControler };
