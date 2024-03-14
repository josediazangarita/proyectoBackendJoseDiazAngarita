//Script del desafío entregable dos del curso Backend de Coderhouse
console.log("\nPrimera entrega Backend de José Gregorio Díaz Angarita\n")

//Se importa el módulo de FileSystem para manipular archivos
import { readFileSync, writeFileSync } from 'fs';

export default class ProductManager {
    constructor() {
        this.path = '../src/data/products.json';
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }
    //Método para agregar productos
    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            return { error: 'Está intentando ingresar un producto con campos faltantes, ingrese el campo o los campos faltantes y reinténtelo.' };
        }
        if (this.products.some(p => p.code === product.code)) {
            return { error: 'El código del producto que intenta ingresar ya existe, asígnele otro código.' };
        }
        product.id = this.productIdCounter++;
        this.products.push(product);
        this.saveProducts();
        return { success: true, productId: product.id };
    }
    
    
    //Método para obtener todos los productos almacenados
    getProducts() {
        console.log("Lista de todos los productos:", this.products);
        console.log('\n');
        return this.products;
    }

    //Método para obtener un producto almacenado por su ID
    getProductById(id) {
        const productId = parseInt(id); // Convertir el ID a entero
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.log(`Error: No se encuentra el producto con el ID ${productId}.\n`);
        } else {
            console.log(`El producto con ID ${productId} es el siguiente:`, product);
            console.log('\n');
        }
        return product;
    }

    async loadProducts() {
        try {
            const data = readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            this.productIdCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
            console.error('Error al cargar productos desde el archivo:', error.message);
        }
    }

    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            writeFileSync(this.path, data);
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error.message);
        }
    }

    updateProduct(id, updatedFields) {
        const productId = parseInt(id); // Convertir el ID a un número entero
        const index = this.products.findIndex(product => product.id === productId);
        console.log('ID del producto que se intenta actualizar:', productId);
        console.log('Índice del producto que se intenta actualizar:', index);
        console.log('Campos actualizados:', updatedFields);
        
        if (index === -1) {
            console.error(`No se encuentra el producto con el ID ${productId} ingresado\n`);
            return;
        }
    
        // Verificar si el campo id no sea modificado y corresponda con el inicial
        if ('id' in updatedFields && updatedFields.id !== productId) {
            console.error(`No se puede modificar el ID del producto con ID ${productId}\n`);
            return;
        }
    
        // Actualizar los campos excepto el id
        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
        console.log(`Se actualizó el producto con ID ${productId}\n`);
        return productId;
    }
    
    
    //Método para eliminar producto
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            console.log("No se encuentra el producto con el ID ingresado por lo que no puede ser eliminado.\n");
            return;
        }
        this.products.splice(index, 1);
        this.saveProducts();
        console.log(`El producto con ID ${id} fue eliminado correctamente.\n`)
    }
}