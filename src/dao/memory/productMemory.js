import fs from 'fs/promises';
import path from 'path';
import ProductDTO from '../../dto/productDTO.js';

const filePath = path.resolve('src/data/products.json');

export default class ProductMemory {
    async getProducts(filter) {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const products = JSON.parse(data);
            const filteredProducts = products.filter(product => {
                for (const key in filter) {
                    if (product[key] !== filter[key]) {
                        return false;
                    }
                }
                return true;
            });
            return filteredProducts.map(product => new ProductDTO(product));
        } catch (error) {
            console.error("Error en getProducts:", error.message);
            throw new Error("Error al obtener los productos desde la memoria");
        }
    }

    async getProductByID(id) {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find(product => product.id === id);
            if (!product) throw new Error(`El producto ${id} no existe!`);
            return new ProductDTO(product);
        } catch (error) {
            console.error("Error en getProductByID:", error.message);
            throw new Error(error.message);
        }
    }

    async addProduct(product) {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const products = JSON.parse(data);
            products.push(product);
            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
            return new ProductDTO(product);
        } catch (error) {
            console.error("Error en addProduct:", error.message);
            throw new Error("Error al agregar el producto");
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            let products = JSON.parse(data);
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...productUpdate };
                await fs.writeFile(filePath, JSON.stringify(products, null, 2));
                return new ProductDTO(products[index]);
            }
            throw new Error(`Producto con id ${id} no encontrado`);
        } catch (error) {
            console.error("Error en updateProduct:", error.message);
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            let products = JSON.parse(data);
            const initialLength = products.length;
            products = products.filter(product => product.id !== id);
            if (products.length < initialLength) {
                await fs.writeFile(filePath, JSON.stringify(products, null, 2));
                return true;
            }
            throw new Error(`Producto con id ${id} no encontrado`);
        } catch (error) {
            console.error("Error en deleteProduct:", error.message);
            throw new Error("Error al eliminar el producto");
        }
    }
}