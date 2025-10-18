import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateMyProfileController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;
    const { name, email, password } = req.body;

    // Pega o nome do arquivo de imagem (se foi enviado)
    const banner = req.file?.filename;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      userId,
      name,
      email,
      password,
      banner,
    });

    return res.json(user);
  }
}

export { UpdateMyProfileController };
