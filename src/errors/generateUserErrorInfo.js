export const generateUserErrorInfo = (user) => {
    return `One or more properties are incomplete or invalid.
    List of required properties:
    * first_name: needs to be a String, received ${typeof user.first_name}
    * last_name: needs to be a String, received ${typeof user.last_name}
    * email: needs to be a String, received ${typeof user.email}
    * age: needs to be a Number, received ${typeof user.age}
    * password: needs to be a String, received ${typeof user.password}`;
};