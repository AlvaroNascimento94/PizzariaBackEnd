import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/DeleteUserService";

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;

    const deleteUserService = new DeleteUserService();

    const result = await deleteUserService.execute({
      userId: userId as string,
    });

    return res.json(result);
  }
}

export { DeleteUserController };
