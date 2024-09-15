const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      include: { posts: true, comments: true },
      orderBy: { id: "desc" },
      take: 20,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.user.findFirst({
      where: { id: Number(id) },
      include: { posts: true, comments: true },
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/users", async (req, res) => {
  const { name, username, bio, password } = req.body;

  if (!name) {
    return res.status(400)
      .json({ msg: "name is required." });
  }

  if (!username) {
    return res.status(400)
      .json({ msg: "username is required." });
  }

  if (!password) {
    return res.status(400)
      .json({ msg: "password is required." });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, username, password: hash, bio, },
  });
  res.json(user);
});

module.exports = { userRouter: router };