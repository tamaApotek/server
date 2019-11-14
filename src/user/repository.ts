import { User } from "../model/user";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}

const makeUserRepository = (repository: UserRepository): UserRepository =>
  Object.freeze({
    findById: repository.findById,
    findByUsername: repository.findByUsername
  });

export default makeUserRepository;
