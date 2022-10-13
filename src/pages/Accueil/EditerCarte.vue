<template>
    <teleport to="body">
        <div id="background" @click="$emit('close-edit')"></div>
        <div id="flex-edit-card">
            <base-card id="base-card">
                <h2>Édition de l'activité ...</h2>
                <form @submit.prevent="sendForm(id)" class="form-container">
                    <div class="form-control">
                        <label class="label-activity" for="question">Titre :</label>
                        <input class="input-activity" v-model.trim="activity.title" type="text" id="title" name="title"
                            size="15" required maxlength="30" />
                    </div>
                    <div class="form-control">
                        <label class="label-activity" for="question">Question :</label>
                        <input class="input-activity" v-model.trim="activity.question" type="text" id="question"
                            name="question" size="20" required maxlength="35" />
                    </div>
                    <div class="form-control">
                        <label class="label-activity" for="question">Réponses :</label>
                        <input class="input-activity" v-model.trim="newAnswer" type="text" id="propositions"
                            name="propositions" size="25" maxlength="30" minlength="1" />
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
            <base-card id="base-card-edit">
                <div class="play-card">
                    <h1>{{ activity.title }}</h1>
                    <div class="bordure"></div>
                    <div class="card-image">
                        <img :src="urlImage" />
                    </div>
                    <h3>{{ activity.question }}</h3>
                    <div class="div-ul-prop">
                        <ul class="ul-prop" v-for="(proposition, value) in activity.propositions" :key="proposition.id">
                            <proposition-answer class="proposition" :type="proposition.mode">
                                {{ proposition.name }}
                            </proposition-answer>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                @click="deleteProp(value)" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path
                                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                            </svg>
                        </ul>
                    </div>
                    <validate-button></validate-button>
                </div>
            </base-card>
        </div>
        <base-dialog :show="showDialog" :title="titleDialog" :error="errorDialog" @close="closeDialog"></base-dialog>
    </teleport>
</template>

<script>
import firebase from 'firebase/compat/app';

export default {
    props: ['id', 'index', 'title', 'url', 'question', 'propositions', 'QRcode', 'image'],
    emits: ['close-edit'],
    data() {
        return {
            newProp: null,
            newAnswer: null,
            activity: {
                QRcode: this.QRcode,
                title: this.title,
                question: this.question,
                propositions: this.propositions,
                image: this.image
            },
            picture: null,
            imageData: null,
            urlImage: this.url,
            uploadImage: false,

            showDialog: false,
            titleDialog: '',
            errorDialog: null,
        }
    },
    methods: {
        sendForm(value) {
            fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity/${value}.json`, {
                method: 'PUT',
                body: JSON.stringify(this.activity)
            });
            if (this.uploadImage) {
                this.onUpload();
            }
            this.$emit('close-edit')
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
        previewImage(event) {
            this.imageData = event.target.files[0];
            this.activity.image = this.imageData.name;
            this.getFileImage(this.imageData);
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
        getFileImage(image) {
            let urlImage = URL.createObjectURL(image);
            this.urlImage = urlImage;
            this.uploadImage = true;
        },
        deleteProp(id) {
            this.activity.propositions.splice(id, 1)
        },
        closeDialog() {
            this.showDialog = false;
        }
    }
}
</script>

<style scoped>
@media screen and (max-width: 1023px) {
    #flex-edit-card {
        flex-direction: column;
        width: 100% !important;
        position: absolute !important;
        top: 0vh;
    }

    #base-card {
        margin: -100px auto 50px auto !important;
    }

    #base-card-edit {
        margin-left: auto !important;
        margin-right: auto !important;
    }
}

@media (min-width: 431px) and (max-width: 800px) {
    #base-card {
        width: 420px !important;
    }
}

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
#background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: #1a1a1a9f;
    z-index: 10;
}

#flex-edit-card {
    position: fixed;
    width: 95%;
    display: flex;
    top: 20vh;
    z-index: 100;
    text-align: center;
}

#base-card-edit {
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 0;
    text-align: center;
    color: #2c3e50;
    position: relative;
    margin: 0 50px 0 50px;
}

.play-card {
    margin: 0 50px 0 50px;
    z-index: 1;
    position: relative;
}

#base-card-edit::before {
    background-image: url("@/assets/embleme.png");
    display: block;
    content: "";
    background-repeat: no-repeat;
    background-position: 50% 140px;
    background-size: 80%;
    position: absolute;
    top: 0;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0.3;
}

.card-content {
    position: relative;
}

ul {
    list-style-type: none;
    margin-bottom: 3%;
    padding: 0;
}

h5 {
    margin: 0;
    text-align: left;
    padding: 1.5% 1%;
    opacity: 50%;
}

h3 {
    margin: 0;
}

h1 {
    font-size: 22px;
    margin: 10px;
}

.bordure {
    border-bottom: 1px solid #CC0000;
    width: 60%;
    margin: 0 auto;
}

.card-image {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

img {
    height: 150px;
}

.div-ul-prop {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.ul-prop {
    margin-bottom: 5px;
}

.bi.bi-trash3-fill {
    float: right;
    margin-right: -20px;
    margin-top: -10%;
    opacity: 35%;
}

.bi.bi-trash3-fill:hover {
    opacity: 100%;
    cursor: pointer;
}

.edit-enter-from,
.edit-leave-to {
    opacity: 0;
    transform: scale(0.8)
}

.edit-enter-active {
    transition: all 0.3s ease-out
}

.edit-leave-active {
    transition: all 0.3s ease-in
}

.edit-enter-to,
.edit-leave-from {
    opacity: 1;
    transform: scale(1);
}

@media (min-width: 376px) and (max-width: 430px) {
    .play-card::before {
        background-position: 50% 170px !important;
    }

    img {
        width: 50% !important;
    }
}

@media screen and (max-width: 375px) {
    .play-card::before {
        background-position: 50% 190px !important;
    }

    img {
        width: 60% !important;
    }
}

/* Carte édition */
#base-card {
    margin-top: 120px;
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
</style>