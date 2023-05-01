import productsModel from "../models/products.js";

export default class ProductManager {
  constructor() {}

  // getProductsPag = async () => {
  //   try {
  //     // const products = await productsModel.find().lean()
  //     const {
  //       docs: products,
  //       hasPrevPage,
  //       hasNextPage,
  //       nextPage,
  //       prevPage,
  //     } = await productsModel.paginate({}, { limit: 5, page, lean: true });
  //   }
  // };

  getProducts = async () => {
    try {
      const products = await productsModel.find().lean().limit(5);
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getProducts2 = async () => {
    try {
      const products2 = await productsModel.find().lean().limit(5).skip(5);
      return products2;
    } catch (error) {
      console.log(error);
    }
  };


  addProduct = async (product) => {
    try {
      const createdProduct = await productsModel.create(product);
      return createdProduct;
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (id) => {
    try {
      const product = await productsModel.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (id, changes) => {
    try {
      const updatedProduct = await productsModel.updateOne(
        { _id: id },
        changes
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      const deletedProduct = await productsModel.deleteOne({ _id: id });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  };
}
