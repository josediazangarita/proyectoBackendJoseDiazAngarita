import userModel from '../models/userModel.js';
class UserDTO {
    constructor({ _id, first_name, last_name, email, age, password, role, githubId, cart, documents, profileImage, productImages, last_connection }) {
      this.id = _id;
      this.firstName = first_name;
      this.lastName = last_name;
      this.email = email;
      this.age = age;
      this.password = password;
      this.role = role;
      this.githubId = githubId;
      this.cart = cart;
      this.documents = documents;
      this.profileImage = profileImage;
      this.productImages = productImages;
      this.last_connection = last_connection;
    }

    async save() {
      return await userModel.findByIdAndUpdate(this.id, {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          age: this.age,
          password: this.password,
          role: this.role,
          githubId: this.githubId,
          cart: this.cart,
          documents: this.documents,
          profileImage: this.profileImage,
          productImages: this.productImages,
          last_connection: this.last_connection
      }, { new: true });
    }
  }
  
  export default UserDTO;  