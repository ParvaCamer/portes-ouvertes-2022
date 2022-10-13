<template>
  <header>
    <the-header :isLoggedIn="isLoggedIn"></the-header>
  </header>

  <router-view v-slot="slotProps">
    <transition name="route">
      <component :is="slotProps.Component" :isLoggedIn="isLoggedIn"></component>
    </transition>
  </router-view>
  <footer>
    <the-footer></the-footer>
  </footer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const isLoggedIn = ref(false);
let auth;
const userId = ref(null);

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid
      console.log(userId.value)
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  })
})
</script>

<style>
@import url('http://fonts.cdnfonts.com/css/palatino');

html {
  background-color: #1a1a1a;
  background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%232c3e50' fill-opacity='0.11' fill-rule='evenodd'/%3E%3C/svg%3E");
}

#app {
  font-family: Palatino, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  cursor: pointer;
}

.route-enter-from{
    opacity: 0;
    transform: translateX(-30px)
}

.route-leave-to{
    opacity: 0;
    transform: translateX(30px)
}

.route-enter-active{
    transition: all 0.8s ease-out;
}

.route-leave-active{
    transition: all 0.2s ease-in;
}

.route-enter-to,
.route-leave-from{
    opacity: 1;
    transform: translateX(0);
}
</style>
