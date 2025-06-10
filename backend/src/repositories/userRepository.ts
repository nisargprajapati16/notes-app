import { User, IUser } from "../models/User";

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }),
  create: (userData: Partial<IUser>) => User.create(userData),
  findById: (id: string) => User.findById(id),
};
