<template>
    <base-card id="base-card-animation">
        <play-card id="play-card" :title="title" :url="url" :question="question" :propositions="propositions">
        </play-card>
        <div id="base-card-hover">
            <h1 clas="h1-hover">{{ title }}</h1>
            <div class="div-base-button">
                <base-button id="base-button" class="base-button" @click="playActivity(id)">
                    Jouer</base-button>
                <base-button class="base-button" @click="editActivity">Editer</base-button>
                <base-button @click="deleteDataFirebase(id)" id="base-button-delete" class="base-button">
                    Supprimer</base-button>
            </div>
        </div>
    </base-card>
    <editer-carte v-if="editCard" :id="id" :index="index" :title="title" :url="url" :question="question"
        :propositions="propositions" :QRcode="QRcode" :image="image" @close-edit="closeEdit">
    </editer-carte>
    <base-dialog :show="showDialog" :title="titleDialog" :error="errorDialog" @close="closeDialog"></base-dialog>
</template>

<script>
import EditerCarte from './EditerCarte.vue';
import { getStorage, ref, deleteObject } from '@firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

export default {
    components: {
        EditerCarte
    },
    props: ['id', 'index', 'title', 'url', 'question', 'propositions', 'QRcode', 'image'],
    emits: ['delete-card'],
    data() {
        return {
            user: [],
            userLoggedIn: {},
            userId: '',
            userIsAdmin: false,

            showDialog: false,
            titleDialog: '',
            errorDialog: null,

            editCard: false
        }
    },
    mounted() {
        let auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userId = user.uid
            }
        });

        axios.get(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user.json`).then((response) => {
            for (let key in response.data) {
                this.user.push(response.data[key])
            }
        })

        setTimeout(() => {
            this.userLoggedIn = this.user.find(user => user.userId === this.userId)
            this.userIsAdmin = this.userLoggedIn.isAdmin;
            console.log(this.userIsAdmin)
        }, 1000);

    },
    methods: {
        playActivity(value) {
            if (this.userIsAdmin) {
                this.$router.push('/playanactivity/' + value);
            } else {
                this.showDialog = true;
                this.titleDialog = 'Accès refusé';
                this.errorDialog = "Tu n'as pas les droits pour pouvoir cliquer ici";
            }
        },
        editActivity() {
            if (this.userIsAdmin) {
                this.editCard = true;
            } else {
                this.showDialog = true;
                this.titleDialog = 'Accès refusé';
                this.errorDialog = "Tu n'as pas les droits pour pouvoir éditer cette activité";
            }
        },
        deleteDataFirebase(e) {
            if (this.userIsAdmin) {
                this.$emit('delete-card', e);
                fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity/${e}.json`, {
                    method: 'DELETE',
                    body: JSON.stringify(e)
                })
            } else {
                this.showDialog = true;
                this.titleDialog = 'Accès refusé';
                this.errorDialog = "Tu n'as pas les droits pour pouvoir supprimer cette activité";
            }
        },
        closeDialog() {
            this.showDialog = false;
        },
        closeEdit() {
            this.editCard = false
        }
    }
}
</script>

<style scoped>
/**** BaseCard Hover ****/
.div-base-button {
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}

#play-card {
    transform: scale(1);
    filter: blur(0px);
    transition: 350ms ease-in;
}

#base-card-animation:hover #play-card {
    transform: scale(0.95);
    filter: blur(6px);
    transition: 450ms ease-out;
}

#base-card-animation #base-card-hover {
    opacity: 0;
    height: 0;
    z-index: 1;
    overflow: hidden;
    transition: overflow 1.5s, opacity 1s, height 1.5s ease-in;
}

#base-card-animation:hover #base-card-hover {
    overflow: visible;
    opacity: 1;
    z-index: 1;
    position: relative;
    top: -550px;
    transition: overflow 0s, opacity 1.5s ease-out;
}
</style>
