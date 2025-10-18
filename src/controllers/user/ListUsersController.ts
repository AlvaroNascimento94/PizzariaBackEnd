import { Request, Response } from "express";
import { ListUsersService } from "../../services/user/ListUsersService";

class ListUsersController {
  async handle(req: Request, res: Response) {
    const { accessProfileId, active } = req.query;

    const listUsersService = new ListUsersService();

    const users = await listUsersService.execute({
      accessProfileId: accessProfileId as string,
      active: active === 'true' ? true : active === 'false' ? false : undefined,
    });

    return res.json(users);
  }
}

export { ListUsersController };
