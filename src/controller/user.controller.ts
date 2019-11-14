import makeUserRepository from "../user/repository";
import userMongo from "../user/repository/userMongo";

const userRepository = makeUserRepository(userMongo);
