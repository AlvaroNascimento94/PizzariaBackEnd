import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const { name, email, password, accessProfileId, active, phone } = req.body;

    const banner = req.file?.filename;

    // Converter active de string para boolean se necessário
    const activeBoolean =
      active !== undefined ? active === "true" || active === true : undefined;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      userId,
      name,
      email,
      password,
      banner,
      accessProfileId,
      active: activeBoolean,
      phone,
    });

    return res.json(user);
  }
}

export { UpdateUserController };
