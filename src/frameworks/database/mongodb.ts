import mongoose from "mongoose";

const connectMongoDB = async () => {
  const dbUri = process.env.ATLAS_CONNECT as string;

  const client = await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  console.log("connected to MongoDB");

  return client;
};

export default connectMongoDB;
