import { Router } from "express";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { AuthUserController } from "../controllers/user/AuthUserControlle";
import { DetailUserControler } from "../controllers/user/DetailUserController";
import { ListAccessProfileController } from "../controllers/user/ListAccessProfileController";
import { ListUsersController } from "../controllers/user/ListUsersController";
import { UpdateUserController } from "../controllers/user/UpdateUserController";
import { UpdateMyProfileController } from "../controllers/user/UpdateMyProfileController";
import { DeleteUserController } from "../controllers/user/DeleteUserController";
import { GetUserPermissionsController } from "../controllers/user/GetUserPermissionsController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkPermission } from "../middlewares/checkPermission";

const userRoutes = Router();

userRoutes.post("/users", new CreateUserController().handle);

userRoutes.post("/session", new AuthUserController().handle);

userRoutes.get("/me/permissions", isAuthenticated, new GetUserPermissionsController().handle);
userRoutes.put("/me", isAuthenticated, new UpdateMyProfileController().handle); 
userRoutes.get("/users", isAuthenticated, checkPermission('Users', 'READ'), new ListUsersController().handle);
userRoutes.get("/user/:userId", isAuthenticated, checkPermission('Users', 'READ'), new DetailUserControler().handle);
userRoutes.put("/user/:userId", isAuthenticated, checkPermission('Users', 'UPDATE'), new UpdateUserController().handle); 
userRoutes.delete("/user/:userId", isAuthenticated, checkPermission('Users', 'DELETE'), new DeleteUserController().handle);

userRoutes.get("/access-profiles", new ListAccessProfileController().handle);

export { userRoutes };
