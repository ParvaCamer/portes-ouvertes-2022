<template>
    <transition name="trans-user">
        <base-card v-if="!isLoggedIn" class="card-user">
            <register v-if="mode==='login'"></register>
            <sign-in v-else></sign-in>
            <p class="p-auth" @click="switchAuthMode">{{ submitCaption }}</p>
            <p class="p-btn" @click="signInWithGoogle">
                <button class="btn">Se connecter avec Google</button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google"
                    viewBox="0 0 16 16">
                    <path class="path-google"
                        d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                </svg>
            </p>
            <div class="div-waves">
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
        </base-card>
        <est-connecte v-else></est-connecte>
    </transition>
</template>

<script>
import SignIn from './Connexion.vue';
import Register from './Creation.vue';
import EstConnecte from './EstConnecte.vue';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
    props: ['isLoggedIn'],
    components: {
        SignIn,
        Register,
        EstConnecte
    },
    data() {
        return {
            mode: 'login',
            userData: [],
            error: null,
        }
    },
    async mounted() {
        const response = await fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user.json`)
        const responseData = await response.json();
        for (const data in responseData) {
            this.userData.push(responseData[data])
        }
    },
    computed: {
        submitCaption() {
            if (this.mode === 'login') {
                return 'Déjà un compte ? Connecte-toi ici';
            } else {
                return "Je n'ai pas de compte";
            }
        },
    },
    methods: {
        signInWithGoogle() {
            const newUser = {
                isAdmin: false,
                userId: null,
                points: 0,
                isDone: ['test']
            }
            const provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((result) => {
                    newUser.userId = result.user.uid;
                    this.registerUser(newUser);
                })
                .catch((error) => {
                    console.log(error.message)
                })
        },
        switchAuthMode() {
            if (this.mode === 'login') {
                this.mode = 'signup';
            } else {
                this.mode = 'login';
            }
        },
        registerUser(value) {
            let isInDB = false;
            for (let i = 0; i < this.userData.length; i++) {
                if (value.userId === this.userData[i].userId) {
                    isInDB = true;
                }
            }
            if (!isInDB) {
                const response = fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user.json`, {
                    method: 'POST',
                    body: JSON.stringify(value)
                })
            }
        }
    }
}
</script>

<style>
.card-user {
    position: relative;
    flex-wrap: wrap;
    padding: 0px !important;
    height: 520px !important;
}

.p-auth {
    cursor: pointer;
}

.p-btn {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

.btn {
    z-index: 1;
    margin-top: 10px;
    border-radius: 12px;
    padding: 10px;
    width: 65%;
    height: 55px;
    background-color: #494C6D;
    margin-left: 15px;
    color: #aeaeb6;
    border: 1px solid #323447;
}

.bi.bi-google {
    z-index: 1;
    position: relative;
    right: 30px;
    top: 30px;
}


/*** waves ***/
.div-waves { 
  height: 5%;
  width:100%;
  position:absolute;
  bottom:0;
  left:0;
  background: #cc0000;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

.wave {
  background: url('@/assets/wave.svg') repeat-x; 
  position: absolute;
  top: -138px;
  width: 100%;
  height: 198px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
}

.wave:nth-of-type(2) {
  top: -135px;
  animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 7s ease -1.25s infinite;
  opacity: 1;
}

@keyframes swell {
  0%, 100% {
    transform: translate3d(0,-25px,0);
  }
  50% {
    transform: translate3d(0,5px,0);
  }
}

@media (min-width: 376px) and (max-width: 430px) {
    .wave {
        width: 100%;
        top: -120px;
    }
    .wave:nth-of-type(2) {
        top: -123px;
    }
}

@media screen and (max-width: 375px) {
    .wave {
        width: 100%;
        top: -105px;
    }
    .wave:nth-of-type(2) {
        top: -108px;
    }
}

@media screen and (max-width: 320px) {
    .wave {
        width: 100%;
        top: -85px;
    }
    .wave:nth-of-type(2) {
        top: -90px;
    }
}
</style>