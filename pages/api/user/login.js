import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

  

    const users = readUsersDB();

    
    const user = users.find(
      (x) => x.username === username && bcrypt.compareSync(password, x.password)
    );

    if (!user)
      return res
        .status(400)
        .json({ ok: false, message: "Invalid Username or Password" });

    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0
    )
      return res
        .status(400)
        .json({ ok: false, message: "Username or password cannot be empty" });

    const secret = process.env.JWT_SECRET;


    const token = jwt.sign({ username, isAdmin: user.isAdmin }, secret, {
      expiresIn: "1800s",
    });

    
    return res.json({ ok: true, username, isAdmin: user.isAdmin, token });
  }
}