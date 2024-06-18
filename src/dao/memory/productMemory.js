import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('src/data/products.json');

export default class ProductMemory {
    async getProducts(filter) {
        const data = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(data);
        return products.filter(product => Object.keys(filter).every(key => product[key] === filter[key]));
    }

    async getProductByID(id) {
        const data = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(data);
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const data = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(data);
        products.push(product);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return product;
    }

    async updateProduct(id, productUpdate) {
        const data = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(data);
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productUpdate };
            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
            return products[index];
        }
        throw new Error(`Product with id ${id} not found`);
    }

    async deleteProduct(id) {
        const data = await fs.readFile(filePath, 'utf-8');
        let products = JSON.parse(data);
        const initialLength = products.length;
        products = products.filter(product => product.id !== id);
        if (products.length < initialLength) {
            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
            return true;
        }
        throw new Error(`Product with id ${id} not found`);
    }
}