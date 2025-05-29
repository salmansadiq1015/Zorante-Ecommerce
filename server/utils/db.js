import mongoose from "mongoose";

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Successfully connected to MongoDB ${conn.connection.host}`.bgBlue.white
    );
  } catch (error) {
    console.log(error);
  }
};

export default db;
