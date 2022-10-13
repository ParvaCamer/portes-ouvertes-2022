<template>
    <h1 class="user-title">Se connecter</h1>
    <div class="form">
        <form class="input-container ic1">
            <input id="email" class="input-user" type="text" placeholder=" " v-model="email" />
            <div class="cut cut-short"></div>
            <label for="email" class="placeholder">Email</label>
        </form>
        <form class="input-container ic2">
            <input id="password" class="input-user" type="password" placeholder=" " v-model="password" autocomplete="new-password"/>
            <div class="cut"></div>
            <label for="password" class="placeholder">Mot de passe</label>
        </form>
    </div>
    <p class="p-error" v-if="errorMsg">{{ errorMsg }}</p>
    <p class="p-btn"><button class="btn-auth" @click="register">Connexion</button></p>
</template>

<script setup>
    // voir pour faire un ui pour register et signin. gain de code
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { useRouter } from 'vue-router';
// const router = useRouter();
const email = ref("");
const password = ref("");
const errorMsg = ref();
const register = () => {
    //.value à cause des ref()
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            console.log("Connexion réussie !")
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
};
</script>

<style scoped>
@import '@/styles/UiUser.css';
</style>