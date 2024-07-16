import productModel from '../../models/productModel.js';
import { ProductNotFoundError, ProductDatabaseError, InvalidProductError } from '../../errors/productErrors.js';
import { generateProductErrorInfo } from '../../errors/generateProductErrorInfo.js';
export default class ProductMongo {
  constructor() {}

  async getProducts(filter = {}) {
    try {
      const products = await productModel.find(filter).lean();
      return products;
    } catch (error) {
      throw new ProductDatabaseError(null, 'Error al buscar los productos', error);
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id);
      if (!product) throw new ProductNotFoundError(id);
      return product;
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new ProductNotFoundError(id);
      }
      throw new ProductDatabaseError(null, 'Error al buscar el producto', error);
    }
  }

  async addProduct(product) {
    try {
      const result = await productModel.create(product);
      return result.toObject();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errorInfo = generateProductErrorInfo(product);
        throw new InvalidProductError(errorInfo);
      } else {
        throw new ProductDatabaseError(product, `Error al agregar el producto: ${error.message}`, error);
      }
    }
  }

  async updateProduct(id, productUpdate) {
    try {
      const result = await productModel.findByIdAndUpdate(id, productUpdate, { new: true, runValidators: true });
      if (!result) throw new ProductNotFoundError(id);
      return result.toObject();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errorInfo = generateProductErrorInfo(productUpdate);
        throw new InvalidProductError(errorInfo);
      } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new ProductNotFoundError(id);
      } else {
        throw new ProductDatabaseError(productUpdate, `Error al actualizar el producto: ${error.message}`, error);
      }
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productModel.findByIdAndDelete(id);
      if (!result) throw new ProductNotFoundError(id);
      return true;
    } catch (error) {
      throw new ProductDatabaseError(null, 'Error al eliminar el producto', error);
    }
  }
}