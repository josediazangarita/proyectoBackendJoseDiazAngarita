import productModel from '../../models/productModel.js';
import { ProductNotFoundError, ProductDatabaseError, InvalidProductError } from '../../errors/productErrors.js';
export default class ProductMongo {
  constructor() {}

  async getProducts(filter = {}) {
    try {
      const products = await productModel.find(filter).lean();
      return products;
    } catch (error) {
      throw new ProductDatabaseError('Error al buscar los productos', error);
    }
  }

  async getProductById(id) {
    try {
        const product = await productModel.findById(id);
        return product;
    } catch (error) {
        throw new Error('Error al obtener el producto por ID');
    }
}

  async addProduct(productData) {
    const result = await productModel.create(productData);
    return result.toObject();
}

  async updateProduct(id, productUpdate) {
    try {
      const result = await productModel.findByIdAndUpdate(id, productUpdate, { new: true, runValidators: true });
      if (!result) throw new ProductNotFoundError(id);
      return result.toObject();
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new ProductNotFoundError(id);
      } else if (error.name === 'ValidationError') {
        throw new InvalidProductError(productUpdate, error);
      } else {
        throw new ProductDatabaseError('Error al actualizar el producto', error);
      }
    }
  }

  async deleteProduct(id) {
    try {
      const product = await this.getProductById(id);
      if (!product) return false;

      await productModel.findByIdAndDelete(id);
      return product;
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }
}