export default defineNuxtRouteMiddleware((to, from) => {
  
     if(to.name!=="Authentication"){
       if(useCookie('token').value===undefined){
         return navigateTo('/Authentication');
       }
     }
  })