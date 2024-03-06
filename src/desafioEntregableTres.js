//Script del desafío entregable dos del curso Backend de Coderhouse
console.log("\nSegundo desafío entregable Backend de José Gregorio Díaz Angarita\n")

//Se importa el módulo de FuleSystem para manipular archivos
const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = 'products.json';
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
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.log(`Error: No se encuentra el producto con el ID ${id}.\n`);
        } else {
            console.log(`El producto con ID ${id} es el siguiente:`, product);
            console.log('\n');
        }
        return product;
    }

    async loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            this.productIdCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
            console.error('Error al cargar productos desde el archivo:', error.message);
        }
    }

    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data);
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

//Proceso de testing 

const store = new ProductManager();

console.log(store);

//Test agregar productos correctamente
store.addProduct({
    title: "Producto 1",
    description: "descripción del producto 1",
    price: 100,
    thumbnail: "imagen1.jpg",
    code: "001",
    stock: 100
});

store.addProduct({
    title: "Producto 2",
    description: "descripción del producto 2",
    price: 200,
    thumbnail: "imagen2.jpg",
    code: "002",
    stock: 200
});

store.addProduct({
    title: "Producto 3",
    description: "descripción del producto 3",
    price: 300,
    thumbnail: "imagen3.jpg",
    code: "003",
    stock: 300
});

//Obtener la lista de todos los productos
store.getProducts();

//Test agregar un producto con campo faltante
store.addProduct({
    title: "Producto 4",
    description: "descripción del producto 4",
    price: 400,
    //thumbnail: "imagen4.jpg",
    code: "004",
    stock: 400
});

//Test agregar un producto con código existente
store.addProduct({
    title: "Producto 5",
    description: "descripción del producto 5",
    price: 500,
    thumbnail: "imagen5.jpg",
    code: "001",
    stock: 500
});

//Obtener productos por su ID
store.getProductById(2);
store.getProductById(3);

//Obtener producto con un ID inexistente (error)
store.getProductById(20);

//Actualizar campo de un producto
store.updateProduct(2, { price: 1000 });

//Error al intentar cambiar el campo id de un producto
store.updateProduct(2, { id: 10 });

//Test de eliminación de un producto por id
store.deleteProduct(3);

//Test de eliminación de un producto cin id inexistente (error)
store.deleteProduct(15);