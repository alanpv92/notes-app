class HasuraMutation {
  static addUser(email: String, hash: String, salt: String, userName: String) {
    return `
        
        mutation adduser {
            insert_users_one(object: {email: "${email}", hash: "${hash}", salt: "${salt}", user_name: "${userName}"}) {
              id
            }
          }
          
        
        
        
        `;
  }
}


export default HasuraMutation;