import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

    if (!user) {
      throw new Error()
    }

    req.token = token
    req.user = user
    next()
  } catch {
    res.status(401).send({ error: "Please authenticate" })
  }
}

export default auth