import ProductDTO from '../dto/productDTO.js';
import ProductMongo from '../dao/mongoDB/productMongo.js';

const productDAO = new ProductMongo();

export default class ProductService {
  constructor(productDao) {
    this.productDao = productDao;
  }

  async getProducts(filter = {}) {
    try {
      const products = await productDAO.getProducts(filter);
      return products.map((product) => new ProductDTO(product));
    } catch (error) {
      console.error(`Error en getProducts: ${error.message}`);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await productDAO.getProductById(id);
      if (!product) throw new Error(`El producto ${id} no existe!`);
      return new ProductDTO(product);
    } catch (error) {
      console.error(`Error en getProductById: ${error.message}`);
      throw error;
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await productDAO.addProduct(product);
      return new ProductDTO(newProduct);
    } catch (error) {
      console.error(`Error en addProduct: ${error.message}`);
      throw error;
    }
  }

  async updateProduct(id, productUpdate) {
    try {
      const updatedProduct = await productDAO.updateProduct(id, productUpdate);
      return new ProductDTO(updatedProduct);
    } catch (error) {
      console.error(`Error en updateProduct: ${error.message}`);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await productDAO.deleteProduct(id);
      return true;
    } catch (error) {
      console.error(`Error en deleteProduct: ${error.message}`);
      throw error;
    }
  }
}