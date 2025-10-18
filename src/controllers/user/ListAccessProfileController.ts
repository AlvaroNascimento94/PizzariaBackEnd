import { Request, Response } from "express";
import { ListAccessProfileService } from "../../services/user/ListAccessProfileService";

class ListAccessProfileController {
  async handle(req: Request, res: Response) {
    const listAccessProfileService = new ListAccessProfileService();
    
    const accessProfiles = await listAccessProfileService.execute();
    
    return res.json(accessProfiles);
  }
}

export { ListAccessProfileController };
