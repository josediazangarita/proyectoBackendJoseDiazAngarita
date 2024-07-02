class UserDTO {
    constructor({ _id, first_name, last_name, email, age, password, role, githubId, cart }) {
      this.id = _id;
      this.firstName = first_name;
      this.lastName = last_name;
      this.email = email;
      this.age = age;
      this.password = password;
      this.role = role;
      this.githubId = githubId;
      this.cart = cart;
    }
  }
  
  export default UserDTO;  