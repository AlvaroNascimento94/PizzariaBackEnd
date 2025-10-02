interface IUser {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {

  async execute({ name, email, password }: IUser) {

    return { message: "User created", user: { name, email, password} };
  }
}

export { CreateUserService }