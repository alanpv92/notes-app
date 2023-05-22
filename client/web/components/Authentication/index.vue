<template>
  <div class="flex flex-col p-4 shadow-2xl w-5/6 md:w-2/6 gap-5 rounded">
    <div class="flex flex-col gap-3">
      <input
        v-if="isRegMode"
        class="border rounded p-2"
        placeholder="user name"
        v-model="userNameController"
      />
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
      v-if="!isLoading"
      class="bg-blue-700 hover:bg-blue-500 text-white text-2xl py-2 rounded"
      @click="submit"
    >
      {{ getAuthButtonText }}
    </button>
    <LoadersSpinner v-if="isLoading" />
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
import { useAuthStore } from "~/store/authentication";



const authStore = useAuthStore();

const isRegMode = ref(false);

const emailController = ref("");
const passwordController = ref("");
const confirmController = ref("");
const userNameController = ref("");

const isLoading = ref(false);

let setIntervalId: NodeJS.Timer | null = null;

const isVaild = ref(true);
const errorText = ref("");

function toogleLoginMode() {
  isRegMode.value = !isRegMode.value;
  clearAllFields();
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

function clearAllFields() {
  emailController.value = "";
  passwordController.value = "";
  confirmController.value = "";
  userNameController.value = "";
}

function showError(message: string) {
  isVaild.value = false;
  errorText.value = message;
  if (setIntervalId != null) {
    clearInterval(setIntervalId);
  }
  setIntervalId = setInterval(() => {
    isVaild.value = true;
    errorText.value = "";
  }, 3000);
}

function validateUserInput() {
  if (
    emailController.value.length == 0 ||
    passwordController.value.length == 0
  ) {
    showError("All Fields Are Required");
    return false;
  }
  if (isRegMode.value && userNameController.value.length === 0) {
    showError("All Fields Are Required");
    return false;
  }
  if (isRegMode.value && passwordController.value != confirmController.value) {
    showError("Password does not match");
    return false;
  }
  return true;
}



async function submit() {
  isLoading.value = true;
  if (validateUserInput()) {
    console.log("i am being called");
    authStore
      .authenticateUser(
        isRegMode.value,
        emailController.value,
        passwordController.value,
        emailController.value
      ).then((e)=>{
        useRouter().replace("/");
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    isLoading.value = false;
  }
}
</script>
