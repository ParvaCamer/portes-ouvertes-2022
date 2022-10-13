<template>
    <h1 class="user-title">Créer un compte</h1>
    <div class="form">
        <form class="input-container ic1">
            <input id="email" class="input-user" type="text" placeholder=" " v-model="email" />
            <div class="cut cut-short"></div>
            <label for="email" class="placeholder">Email</label>
        </form>
        <form class="input-container ic2">
            <input id="password" class="input-user" type="password" placeholder=" " v-model="password"
                autocomplete="new-password" />
            <div class="cut"></div>
            <label for="password" class="placeholder">Mot de passe</label>
        </form>
    </div>
    <div class="div-error" v-if="errorMsg">
        <p class="p-error">{{ errorMsg }}</p>
    </div>
    <p class="p-btn"><button class="btn-auth" @click="register">S'incrire</button></p>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { useRouter } from 'vue-router';
// const router = useRouter();
const email = ref("");
const password = ref("");
const errorMsg = ref();
const newUser = {
    isAdmin: false,
    userId: null,
    points: 0,
    isDone: ['test']
};
const register = () => {
    //.value à cause des ref()
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            newUser.userId = data.user.uid
            registerUser(newUser)
            console.log("Inscription réussie !")
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errorMsg.value = "Email invalide";
                    break;
                case "auth/user-not-found":
                    errorMsg.value = "Utilisateur introuvable";
                    break;
                case "auth/wrong-password":
                    errorMsg.value = "Mot de passe incorrect";
                    break;
                default:
                    errorMsg.value = "Email ou mot de passe incorrect";
                    break;
            }
        })
}
function registerUser(value) {
    fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user.json`, {
        method: 'POST',
        body: JSON.stringify(value)
    })
}
</script>

<style scoped>
@import '@/styles/UiUser.css';
</style>