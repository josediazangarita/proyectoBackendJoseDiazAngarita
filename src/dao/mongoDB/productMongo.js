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
      throw new ProductDatabaseError('Error al buscar los productos', error);
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findById(id); // Eliminado .lean()
      if (!product) throw new ProductNotFoundError(id);
      return product;
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new ProductNotFoundError(id);
      } else {
        throw new ProductDatabaseError('Error al buscar el producto', error);
      }
    }
  }

  async addProduct(productData) {
    console.log('Producto recibido por el DAO:', productData);
    const result = await productModel.create(productData);
    console.log('Producto guardado en la base de datos:', result);
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
      const result = await productModel.findByIdAndDelete(id);
      if (!result) throw new ProductNotFoundError(id);
      return true;
    } catch (error) {
      throw new ProductDatabaseError('Error al eliminar el producto', error);
    }
  }
}