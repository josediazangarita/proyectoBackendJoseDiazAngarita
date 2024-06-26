import ProductDTO from '../dto/productDTO.js';
import productModel from '../models/productModel.js';

export default class ProductService {
    async getProducts(filter = {}) {
        try {
            const products = await productModel.find(filter).lean();
            return products.map(product => new ProductDTO(product));
        } catch (error) {
            console.error("Error en getProducts:", error.message);
            throw new Error("Error al buscar los productos");
        }
    }

    async getProductByID(pid) {
        try {
            const product = await productModel.findOne({ _id: pid });
            if (!product) throw new Error(`El producto ${pid} no existe!`);
            return new ProductDTO(product);
        } catch (error) {
            console.error("Error en getProductByID:", error.message);
            throw new Error(error.message);
        }
    }

    async addProduct(product) {
        try {
            const result = await productModel.create(product);
            return new ProductDTO(result.toObject());
        } catch (error) {
            console.error("Error en addProduct:", error.message);
            throw new Error("Error al agregar el producto");
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            const result = await productModel.findByIdAndUpdate(pid, productUpdate, { new: true });
            if (!result) throw new Error(`El producto ${pid} no existe!`);
            return new ProductDTO(result.toObject());
        } catch (error) {
            console.error("Error en updateProduct:", error.message);
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await productModel.findByIdAndDelete(pid);
            if (!result) throw new Error(`El producto ${pid} no existe!`);
            return true;
        } catch (error) {
            console.error("Error en deleteProduct:", error.message);
            throw new Error("Error al eliminar el producto");
        }
    }
}