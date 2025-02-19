import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../src/models/user.js";
import Task from "../../src/models/task.js";

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "test",
  email: "test@test.com",
  password: "test_pass!@#",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "test 2",
  email: "test2@test.com",
  password: "test_pass!@#2",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: true,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  completed: false,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

const closeDatabase = async () => {
  await mongoose.connection.close();
};

export { userOneId, userOne, userTwo, taskOne, setupDatabase, closeDatabase };
