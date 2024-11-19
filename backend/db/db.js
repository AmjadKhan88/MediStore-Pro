import mongoose from 'mongoose';

export const connectDB = async () => {
  const database_url = process.env.DATABASE_URL || "mongodb://localhost:27017/";
  const database_name = process.env.DATABASE_NAME || "medicine_store";
  await mongoose.connect(database_url+database_name)
  .then(()=>{
    console.log('DB connected');
  });
}

