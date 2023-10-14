import mongoose from "mongoose";

export const connect = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected at ${process.env.MONGO_URI}`);

  return db;
};
