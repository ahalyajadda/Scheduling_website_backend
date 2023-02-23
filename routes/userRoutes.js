import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { isAuth, generateToken } from '../utils.js';

const userRouter = express.Router();

//login

userRouter.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        username: user.username,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: 'Invalid email or password' });
});

//register
userRouter.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password),
  });
  const user = await newUser.save();
  res.send({
    _id: user._id,
    username: user.username,
    token: generateToken(user),
  });
});

//delete account
userRouter.delete('/deleteMyAccount/account/:id', isAuth, async (req, res) => {
  try {
    const post = await User.findOneAndDelete({ _id: req.params.id });
    if (!post) return res.status(404).send();
    res.send({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

export default userRouter;
