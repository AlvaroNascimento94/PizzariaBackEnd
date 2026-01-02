import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const {
      name,
      email,
      password,
      accessProfileId,
      active,
      phone,
      removeBanner,
    } = req.body;

    let banner: string | null | undefined = undefined;
    if (req.file) {
      banner = req.file.filename;
    } else if (removeBanner === "true") {
      banner = null;
    }

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
