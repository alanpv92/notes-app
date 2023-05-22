<template>
  <div class="flex flex-col p-4 shadow-2xl w-5/6 md:w-2/6 gap-5 rounded">
    <div class="flex flex-col gap-3">
      <input
        class="border rounded p-2"
        placeholder="Email"
        v-model="emailController"
      />
      <input
        type="password"
        class="border rounded p-2"
        placeholder="password"
        v-model="passwordController"
      />
      <input
        v-if="isRegMode"
        type="password"
        class="border rounded p-2"
        placeholder="confirm password"
        v-model="confirmController"
      />
    </div>
    <button
      class="bg-blue-700 hover:bg-blue-500 text-white text-2xl py-2 rounded" @click="submit"
    >
      {{ getAuthButtonText }}
    </button>
    <button
      class="text-blue-700 hover:text-blue-500 font-bold"
      @click="toogleLoginMode"
    >
      {{ getAuthToggleText }}
    </button>
    <div v-if="!isVaild" class="bg-red-500 text-white p-2 rounded font-bold">
        {{ errorText }}
    </div>
  </div>
</template>

<script setup lang="ts">
const isRegMode = ref(false);

const emailController = ref("");
const passwordController = ref("");
const confirmController = ref("");

let setIntervalId: NodeJS.Timer | null=null;

const isVaild=ref(true);
const errorText=ref('');


function toogleLoginMode() {
  isRegMode.value = !isRegMode.value;
}

const getAuthToggleText = computed(() => {
  if (isRegMode.value) {
    return "Dont Have An Account?";
  } else {
    return "Already Have An Account?";
  }
});

const getAuthButtonText = computed(() => {
  if (!isRegMode.value) {
    return "Login";
  } else {
    return "Register";
  }
});

function showError(message:string){
    isVaild.value=false;
    errorText.value=message;
    if(setIntervalId!=null){
       clearInterval(setIntervalId);
 
    }
  setIntervalId= setInterval(()=>{
      isVaild.value=true;
      errorText.value='';
    },3000)

}

function validateUserInput(){
    if(emailController.value.length==0||passwordController.value.length==0 ){
        showError("All Fields Are Required");
        return false;
    }
    if(isRegMode.value&&(passwordController.value!=confirmController.value)){
        showError("Password does not match");
        return false;
    }
    return true;
}

function submit(){
    if(validateUserInput()){

    }else{

    }
}
</script>
