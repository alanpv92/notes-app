class HasuraQueries {
  static findUserByEmail(email: String) {
    return `
    query MyQuery {
        users(where: {email: {_eq: "${email}"}}) {
          id
          email
          hash
          salt
          user_name
        }
      }
      
        `;
  }
}

export default HasuraQueries;