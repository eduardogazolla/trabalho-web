const express = require("express");
const app = express();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const hashPassword = require("../middlewares/hash");
const { generateToken, authenticateToken } = require("../middlewares/auth");

db.sync();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", hashPassword, async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({ name, email, password });
  res.send(newUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  const passmatch = await bcrypt.compare(password, user.password);
  if (!user && !passmatch) {
    return res.status(401).send("Invalid email or password");
  }
  const token = generateToken(user.dataValues);
  delete user.dataValues.password;
  res.send({ user, token });
});

app.get("/users", authenticateToken, async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

module.exports = app;
