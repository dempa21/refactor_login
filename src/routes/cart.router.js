import { Router } from "express";
import CartManager from "../dao/dbManagers/carts.js";
import cartsModel from "../dao/models/carts.js";

const manager = new CartManager();

const router = Router();

router.get("/", async (req, res) => {
  const cart = await manager.getCarts();
  console.log(cart[0].products)
  const cart1 = cart[0].products;
  // console.log(carts);
  // return res.send({status: "success", payload: carts});

  // return carts,cart1;
  /* con paginate */
  const { page = 1 } = req.query;
  const {
    docs: carts,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  } = await cartsModel.paginate({}, { limit: 10, page, lean: true });

  return res.render("carts", {
    carts,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  }),cart1;
});

// });

router.post("/", async (req, res) => {
  const cart = req.body;
  if (!cart) {
    return res
      .status(400)
      .send({ status: "Error", error: "Cart could not be added" });
  }

  const newCart = await manager.addCart(cart);
  return res.send({
    status: "OK",
    message: "Cart added successfully",
    payload: newCart,
  });
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await manager.getCartById(cartId);

  if (!cart) {
    return res.status(404).send({
      status: "Error",
      error: "cart was not found",
    });
  }
  return res.send({ status: "OK", message: "Cart found", payload: cart });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const { quantity } = req.body;

  const newProduct = await manager.addProduct(cartId, productId, quantity);

  if (!newProduct) {
    return res
      .status(404)
      .send({ status: "Error", error: "Product could not be found" });
  }
  return res.send({
    status: "OK",
    message: "Product successfully added to the cart",
    payload: newProduct,
  });
});

export default router;
