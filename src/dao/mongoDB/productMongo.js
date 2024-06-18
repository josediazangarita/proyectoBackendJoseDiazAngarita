import productModel from '../../models/productModel.js';

export default class ProductMongo {
    async getProducts(filter) {
        return await productModel.find(filter).lean();
    }

    async getProductByID(id) {
        return await productModel.findById(id);
    }

    async addProduct(product) {
        return await productModel.create(product);
    }

    async updateProduct(id, productUpdate) {
        return await productModel.findByIdAndUpdate(id, productUpdate, { new: true });
    }

    async deleteProduct(id) {
        return await productModel.findByIdAndDelete(id);
    }
}