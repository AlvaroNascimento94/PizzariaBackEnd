import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateMyProfileController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;
    const { name, email, password, phone, removeBanner } = req.body;

    let banner: string | null | undefined = undefined;
    if (req.file) {
      banner = req.file.filename;
    } else if (removeBanner === "true") {
      banner = null;
    }

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      userId,
      name,
      email,
      password,
      banner,
      phone,
    });

    return res.json(user);
  }
}

export { UpdateMyProfileController };
