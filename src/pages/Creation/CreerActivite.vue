<template>
    <span>
        <span v-if="!showQR">
                <base-card id="base-card">
                    <h2>Création en cours ...</h2>
                    <form @submit.prevent="sendForm" class="form-container">
                        <div class="form-control">
                            <label class="label-activity" for="question">Titre :</label>
                            <input class="input-activity" v-model.trim="activity.title" type="text" id="title"
                                name="title" size="15" required maxlength="30" />
                        </div>
                        <div class="form-control">
                            <label class="label-activity" for="question">Question :</label>
                            <input class="input-activity" v-model.trim="activity.question" type="text" id="question"
                                name="question" size="20" required maxlength="80" />
                        </div>
                        <div class="form-control">
                            <label class="label-activity" for="question">Réponses :</label>
                            <input class="input-activity" v-model.trim="newAnswer" type="text" id="propositions"
                                name="propositions" size="25" maxlength="50" minlength="1" />
                        </div>
                        <div class="form-control">
                            <div class="form-control-answer">
                                <div class="form-grid-answer-1">
                                    <input class="boite-oui" type="radio" name="reponse" value="bonne" checked>
                                    <label class="label-oui" for="bonne">Bonne réponse</label>
                                </div>
                                <div class="form-grid-answer-2">
                                    <input class="boite-non" type="radio" name="reponse" value="mauvaise">
                                    <label class="label-non" for="mauvaise">Mauvaise réponse</label>
                                </div>
                                <div class="form-grid-answer-3">
                                    <svg @click="ajoutPropositions" xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-circle-plus" width="32" height="32"
                                        viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" fill="none"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <line x1="9" y1="12" x2="15" y2="12"></line>
                                        <line x1="12" y1="9" x2="12" y2="15"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="form-control" id="form-control-image">
                            <label class="label-image" for="image">Ajouter une image : {{ activity.image }}</label>
                            <input class="input-image" type="file" accept="image/*" @change="previewImage">
                        </div>
                        <div class="form-control" id="input-submit">
                            <validate-button></validate-button>
                        </div>
                    </form>
                </base-card>
            <previsualisation :activity="activity" :imageData="imageData" :getImage="getImage"></previsualisation>
        </span>
        <generation v-if="showQR" :activity="activity" :nameActivity="nameActivity" @emit-qrcode="sendActivity">
        </generation>
        <base-dialog :show="showDialog" :title="titleDialog" :error="errorDialog" @close="closeDialog"></base-dialog>
    </span>
</template>

<script>
import Previsualisation from './Prévisualisation.vue';
import Generation from './GenerationQRCode.vue'
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

export default {
    components: {
        Previsualisation,
        Generation
    },
    data() {
        return {
            newProp: null,
            newAnswer: null,
            activity: {
                title: null,
                question: null,
                propositions: [],
                image: null,
                QRcode: null
            },
            nameActivity: '',

            picture: null,
            imageData: null,
            getImage: false,

            showQR: false,
            showDialog: false,
            titleDialog: '',
            errorDialog: null,

            user: [],
            userLoggedIn: {},
            userId: '',
            userIsAdmin: false,
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
        }, 500);

    },
    methods: {
        async sendActivity(e) {
            if (this.userIsAdmin) {
                this.activity.QRcode = e;
                await fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity/${this.nameActivity.name}/.json`, {
                    method: 'PUT',
                    body: JSON.stringify(this.activity)
                });
            }
        },
        ajoutPropositions() {
            if (this.activity.propositions.length == 4) {
                this.showDialog = true;
                this.titleDialog = "Trop de propositions !";
                this.errorDialog = "Impossible d'ajouter plus de 4 possibilités";
            } else {
                if (document.querySelector('input[name="reponse"]:checked').value === 'bonne') {
                    this.newProp = {
                        name: this.newAnswer,
                        mode: 'nonSelected',
                        answer: 'oui'
                    }
                } else {
                    this.newProp = {
                        name: this.newAnswer,
                        mode: 'nonSelected',
                        answer: 'non'
                    }
                }
                this.activity.propositions.push(this.newProp);
                this.newAnswer = null;
            }
        },
        async sendForm() {
            if (this.userIsAdmin) {
                const response = await fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity.json`, {
                    method: 'POST',
                    body: JSON.stringify(this.activity)
                });
                this.nameActivity = await response.json();
                this.onUpload();
                this.showQR = true;
            } else {
                this.showDialog = true;
                this.titleDialog = 'Accès refusé';
                this.errorDialog = "Tu n'as pas les droits pour créer une activité";
            }
        },
        previewImage(event) {
            this.imageData = event.target.files[0];
            this.activity.image = this.imageData.name;
            this.getImage = true;
            setTimeout(() => {
                this.getImage = false;
            }, 500);
        },
        onUpload() {
            this.picture = null;
            const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
            storageRef.on(`state_changed`, error => { console.log(error.message) },
                () => {
                    storageRef.snapshot.ref.getDownloadURL().then((url) => {
                        this.picture = url;
                    })
                }
            )
        },
        closeDialog() {
            this.showDialog = false;
        }
    }
}
</script>

<style scoped>
@media (min-width: 375px) and (max-width: 430px) {
    #base-card {
        width: 98% !important;
    }
}

@media screen and (max-width: 375px) {
    #base-card {
        width: 96% !important;
    }
}

#base-card {
    width: 700px;
    height: 50%;
}

.form-container {
    display: grid;
    gap: 1.5rem;
    grid-template-areas:
        'one'
        'two'
        'three'
        'four'
        'five';
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 0.5fr);
    justify-content: center;
    align-items: center;
    margin: 0 30px;
}

.form-control:nth-child(1) {
    grid-area: one;
}

.form-control:nth-child(2) {
    grid-area: two;
}

.form-control:nth-child(3) {
    grid-area: three;
}

.form-control:nth-child(4) {
    grid-area: four;
}

.form-control:nth-child(5) {
    grid-area: five;
}

.form-control:nth-child(6) {
    grid-area: six;
}

@media (min-width: 50em) {
    .form-container {
        grid-template-areas:
            'one five'
            'two five'
            'three four'
            'six six';
    }
}

.form-control {
    margin: 1%;
}

/* dropzone */
#form-control-image {
    border: 1px black solid;
    height: 110px;
    align-items: center;
    border: 1px dashed black;
}

.input-image {
    height: 100%;
    width: 100%;
    opacity: 0;
}

/* titre - question - réponse */
.form-control {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.input-activity {
    width: 250px;
    box-sizing: border-box;
    margin: 0;
    border: 0.5px solid #1a1a1a98;
    border-radius: 20px;
    padding: 8px 10px;
    font-size: 15px;
    box-shadow: 5px 5px 5px #cc00006b;
}

.label-activity {
    padding: 0 15px 3px;
}

/* input radio */
.form-control-answer {
    display: grid;
    width: 100%;
    height: auto;
    gap: 0.55rem;
    grid-template-columns: 1fr 0.5fr;
    grid-template-rows: repeat(2, 0.5fr);
    align-items: center;
}

.form-grid-answer-1 {
    grid-area: 1 / 1 / 2 / 2;
    justify-self: left;
}

.form-grid-answer-2 {
    grid-area: 2 / 1 / 3 / 2;
    justify-self: left;
}

.form-grid-answer-3 {
    grid-area: 1 / 2 / 3 / 3;
}

.label-oui,
.label-non {
    margin-left: 10px;
}

.boite-oui,
.boite-non {
    accent-color: #cc000094;
    cursor: pointer;
}

.icon {
    cursor: pointer;
}

.icon:active {
    top: 0.1em;
}

/* bouton ajout */
#input-submit {
    display: block;
    justify-content: center;
}

.input-submit {
    position: relative;
    width: 30%;
    border-radius: 20px;
    background-color: #ffffff;
    cursor: pointer;
    padding: 11px;
}

.input-submit:hover {
    border: 2px solid #cc000000;
    background-color: #cc000094;
    box-shadow: 0 0 1em #cc00006b;
    -webkit-transition: background-color 500ms linear;
    -ms-transition: background-color 500ms linear;
    transition: background-color 500ms linear;
}

/* media queries */
@media (max-width: 800px) {
    #base-card {
        width: 420px;
    }

    .form-container {
        grid-template-columns: 0fr;
        grid-template-areas:
            'one'
            'two'
            'three'
            'four'
            'five'
            'six';
        gap: 1rem;
    }

    .form-control-answer {
        grid-template-columns: none;
    }
}

@media (min-width: 376px) and (max-width: 430px) {
    #base-card {
        width: 420px;
    }
}

@media screen and (max-width: 375px) {
    #base-card {
        width: 420px;
    }
}
</style>