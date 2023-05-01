import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { isValidPassword, createHash } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .send({ status: "error", error: "User already exists" });
    }

    const user = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    };

    console.log(password)
    await userModel.create(user);
    return res.send({ status: "sucess", message: "user registered" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/failRegister", (req, res) => {
  console.log("Failed Register");
  return res.send({ status: "error", error: "authentication error" });
});

router.post("/login", passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect credentials" });
    }

    req.session.user = {
      name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };

    res.send({
      status: "sucess",
      message: "Logged In",
      payload: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/faillogin', (req, res) => {
  res.send({error: 'Failed login'})
})

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    console.log(req.user);
    res.redirect("/");
  }
);

export default router;
