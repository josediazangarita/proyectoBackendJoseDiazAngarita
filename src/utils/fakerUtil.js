import {faker} from '@faker-js/faker';
import { ObjectId } from 'mongodb';

export const generateUser = () =>{
    let numOfProducts = parseInt(faker.string.numeric(1,{bannedDigits:['0']}));
    let products= [];
    for(let i=0;i<numOfProducts;i++){
        products.push(generateProduct());
    }
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({min:18, max:70}),
        id: faker.database.mongodbObjectId(),
        products
    }
}

export const generateProduct = () =>{
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.productAdjective(),
        code: faker.number.int({min:10000000, max:100000000}),
        price: faker.commerce.price(),
        stock: faker.number.int({min:0, max:1000}),
        thumbnails: faker.image.urlLoremFlickr(),
        id: faker.database.mongodbObjectId()
    }
}