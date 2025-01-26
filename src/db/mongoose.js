import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to db')
  })
  .catch((err) => {
    console.error(err)
  })