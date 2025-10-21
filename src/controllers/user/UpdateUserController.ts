import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const { name, email, password, accessProfileId, active, phone } = req.body;

    const banner = req.file?.filename;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      userId,
      name,
      email,
      password,
      banner,
      accessProfileId,
      active,
      phone,
    });

    return res.json(user);
  }
}

export { UpdateUserController };
