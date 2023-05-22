<template>
    <div class="text-yellow-600">
        <button @click="logout">hello world</button>
    </div>
</template>

<script setup>

function logout(){
    useCookie("token").value=undefined;
    useRouter().replace("/Authentication");
}

</script>