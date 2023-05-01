import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.js";
import CartManager from "../dao/dbManagers/carts.js";
import MessageManager from "../dao/dbManagers/messages.js";
import productsModel from "../dao/models/products.js";
import cartsModel from "../dao/models/carts.js";
import { checkLogged, checkLogin } from "../middlewares/auth.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

router.get("/", async (req, res) => {

  const { limit, page } = req.query;
  const products = await productManager.getProducts();
  if(limit) {
  const limitedProducts = products.slice(0, limit);

  return  res.render("home", limitedProducts); }
  
  const user = await req.session.user;
  console.log(user)
  //res.render("home", { products, style: "styles.css", title: "Products"});
  res.render("home", {products , user});
  
});


router.get("/products2", async (req, res) => {
  const {page} = req.query;
  const products2 = await productManager.getProducts2();
  const user = await req.session.user;
  console.log(user)
  //res.render("home", { products, style: "styles.css", title: "Products"});
  res.render("home2", {products2 , user});
});
  
router.get("/carts", async (req, res) => {

  const { limit, page } = req.query;
  const carts = await cartManager.getCarts();
  if(limit) {
  const limitedCarts = carts.slice(0, limit);

  return  res.render("home", limitedCarts); }
  
  const user = await req.session.user;
  console.log(user)
  //res.render("home", { products, style: "styles.css", title: "Products"});
  res.render("carts", {carts , user});
  
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realtime-products", {
    products,
    style: "styles.css",
    title: "Real Time Products",
  });
});

router.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  return res.render("messages");
});

router.get("/login", checkLogged, (req, res) => {
  res.render("login");
});

router.get("/register", checkLogged, (req, res) => {
  res.render("register");
});

router.get("/profile", checkLogin, (req, res) => {
  if(!req.session){
    res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
  console.log(user)
});


export default router;
