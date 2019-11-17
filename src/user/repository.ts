import { UserProfile } from "../model/userProfile";

export interface UserRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByUsername(username: string): Promise<UserProfile | null>;
}

const makeUserRepository = (repository: UserRepository): UserRepository =>
  Object.freeze({
    findById: repository.findById,
    findByUsername: repository.findByUsername
  });

export default makeUserRepository;
