import { defineStore } from "pinia";

export const useAuthStore = defineStore("Auth", {
  state() {
    return {
      baseUrl: "http://localhost:5000/auth/",
      userDetails: {
        id: "",
        email: "",
        userName: "",
        token: "",
      },
    };
  },
  actions: {
    async authenticateUser(
      isReg: Boolean,
      email: string,
      password: string,
      userName: string
    ) {
      return new Promise(async (resolve, reject) => {
        try {
          let authUrl;
          let authBody = {};
          if (isReg) {
            authUrl = this.baseUrl + "register";
          } else {
            authUrl = this.baseUrl + "login";
          }
          const data = await fetch(authUrl, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
              user_name: userName,
            }),
          });

          const conData = await data.json();
         
          if (conData.error) {
            throw conData.error;
          } else {
            this.userDetails = conData;
            useCookie("token").value = conData.token;
            resolve("");
            
          }
        } catch (e) {
          const errorText = e || "something went wrong";

          reject(errorText);
        }
      });
    },
  },
  getters: {},
});
