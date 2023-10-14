import mongoose from "mongoose";
import ENV from "../config.js";

export const connect = async () => {

  const db = await mongoose.connect(ENV.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected at ${ENV.mongoURI}`);

  return db;
};
