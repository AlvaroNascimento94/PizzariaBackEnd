declare namespace Express {
  export interface Request {
    userId?: string;
    userProfile?: string;
    userPermissions?: Array<{
      option: string;
      permission: string;
    }>;
    file?: Express.Multer.File;
  }
}
