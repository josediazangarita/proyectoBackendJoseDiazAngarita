import ProductDTO from '../dto/productDTO.js';
import ProductMongo from '../dao/mongoDB/productMongo.js';

const productDAO = new ProductMongo();

export default class ProductService {
  constructor(productDao) {
    this.productDao = productDao;
  }

  async getProducts(filter = {}) {
      const products = await productDAO.getProducts(filter);
      return products.map((product) => new ProductDTO(product));
    } 

    async getProductById(id) {
      const product = await productDAO.getProductById(id);
      return product ? new ProductDTO(product) : null;
    }

    async addProduct(productData) {
      console.log('Producto recibido por el servicio:', productData);
      const newProduct = await productDAO.addProduct(productData);
      return new ProductDTO(newProduct);
    }

    async updateProduct(id, productUpdate) {
      const updatedProduct = await productDAO.updateProduct(id, productUpdate);
      return new ProductDTO(updatedProduct);
    }

    async deleteProduct(id) {
      return await productDAO.deleteProduct(id);
    }
}