//Script del desafío entregable dos del curso Backend de Coderhouse
console.log("\nTercer desafío entregable Backend de José Gregorio Díaz Angarita\n")

//Se importa el módulo de FuleSystem para manipular archivos
import { readFileSync, writeFileSync } from 'fs';

export default class ProductManager {
    constructor() {
        this.path = '../src/products.json';
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }
    //Método para agregar productos
    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.log("Error: Está intentando ingresar un producto con campos faltantes, ingrese el campo o los campos faltantes y reinténtelo.\n");
            return;
        }
        //Verificar si el código de un producto ya existe
        if (this.products.some(p => p.code === product.code)) {
            console.log("Error: El código del producto que intenta ingresar ya existe, asígnele otro código.\n");
            return;
        }
        //Asignar ID al producto
        product.id = this.productIdCounter++;
        this.products.push(product);
        this.saveProducts();
        console.log(`Se ha agregado un producto con ID ${product.id} correctamente.\n`);
        return product.id;
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
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            console.error(`No se encuentra el producto con el ID ${id} ingresado\n`);
            return;
        }
        //Verificar si el campo id no sea modificado y corresponda con el inicial
        if ('id' in updatedFields && updatedFields.id !== id) {
            console.error(`No se puede modificar el ID del producto con ID ${id}\n`);
            return;
        }
        //Actualizar los campos excepto el id
        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
        console.log(`Se actualizó el producto con ID ${id}\n`);
        return id;
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