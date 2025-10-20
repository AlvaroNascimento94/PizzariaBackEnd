import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, accessProfileId, active, phone } = req.body;

    const banner = req.file?.filename;

    const createUserService = new CreateUserService();
    
    const user = await createUserService.execute({ 
      name, 
      email, 
      password, 
      banner, 
      accessProfileId,
      active,
      phone
    });
    
    return res.json(user);
  }
}

export { CreateUserController };
