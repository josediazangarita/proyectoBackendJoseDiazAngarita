export const generateUserErrorInfo = (user) => {
    return `Una o varias propiedades están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * first_name: necesita ser un String, recibió ${typeof user.first_name}
    * last_name: necesita ser un String, recibió ${typeof user.last_name}
    * email: necesita ser un String, recibió ${typeof user.email}
    * age: necesita ser un Número, recibió ${typeof user.age}
    * password: necesita ser un String, recibió ${typeof user.password}`;
};