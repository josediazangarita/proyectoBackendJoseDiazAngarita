import productModel from '../../models/productModel.js';
import ProductDTO from '../../dto/productDTO.js';

export default class ProductMongo {
    async getProducts(filter) {
        try {
            const products = await productModel.find(filter).lean();
            return products.map(product => new ProductDTO(product));
        } catch (error) {
            console.error("Error en getProducts:", error.message);
            throw new Error("Error al buscar los productos");
        }
    }

    async getProductByID(id) {
        try {
            const product = await productModel.findById(id);
            if (!product) throw new Error(`El producto ${id} no existe!`);
            return new ProductDTO(product.toObject());
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

    async updateProduct(id, productUpdate) {
        try {
            const result = await productModel.findByIdAndUpdate(id, productUpdate, { new: true });
            if (!result) throw new Error(`El producto ${id} no existe!`);
            return new ProductDTO(result.toObject());
        } catch (error) {
            console.error("Error en updateProduct:", error.message);
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.findByIdAndDelete(id);
            if (!result) throw new Error(`El producto ${id} no existe!`);
            return true;
        } catch (error) {
            console.error("Error en deleteProduct:", error.message);
            throw new Error("Error al eliminar el producto");
        }
    }
}