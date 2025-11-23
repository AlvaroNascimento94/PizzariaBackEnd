import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, accessProfileId, active, phone } = req.body;

    const banner = req.file?.filename;

    // Converter active de string para boolean se necessário
    const activeBoolean = active === "true" || active === true;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
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

export { CreateUserController };
