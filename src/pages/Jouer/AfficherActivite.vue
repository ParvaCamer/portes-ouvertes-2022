<template>
    <div>
        <base-spinner></base-spinner>
        <div>
            <base-card v-if="!displayIsOver">
                <play-card :title="card.title" :url="card.url" :question="card.question"
                    :propositions="card.propositions" :userToSend="userToSend" :getCorrectAnswer="getCorrectAnswer">
                </play-card>
            </base-card>
            <activite-finie v-else>
            </activite-finie>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
export default {
    data() {
        return {
            card: [],
            id: '',

            user: [],
            userId: '',

            userToSend: {},

            displayIsOver: false,
            isLoading: false
        }
    },
    async mounted() {
        this.isLoading = true;
        // to display the card on click
        this.id = this.$route.params.id;
        axios.get(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity.json?id=${this.id}`).then((response) => {
            this.card = response.data[this.id]
        })

        // to get the user and add data to it
        let auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userId = user.uid
            }
        });
        const responseUser = await fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user.json`)
        const responseDataUser = await responseUser.json();
        for (let key in responseDataUser) {
            this.user.push({ ...responseDataUser[key], id: key })
        }

        this.userToSend = this.user.find(user => user.userId === this.userId)

        this.displayActivityIsOver();
        this.loadImage();

        this.isLoading = false;

    },
    methods: {
        displayActivityIsOver() {
            let trueOrFalse = this.userToSend.isDone.find(id => id === this.id)

            if (trueOrFalse == this.id) {
                this.displayIsOver = true;
            }
        },
        loadImage() {
            let self = this;
            const storageRef = firebase.storage().ref()
            storageRef.listAll().then(function (result) {
                result.items.forEach(function (imageRef) {
                    self.displayImage(imageRef)
                })
            })
        },
        displayImage(images) {
            let self = this
            images.getDownloadURL().then(function () {
                self.card.url = `https://firebasestorage.googleapis.com/v0/b/porte-ouverte-3be77.appspot.com/o/${self.card.image}?alt=media`;
            })
        },
        getCorrectAnswer() {
            let props = this.card.propositions
            for (let i = 0; i < props.length; i++) {
                if (props[i].answer === "oui" && props[i].mode === "selected") {
                    console.log('un point en plus')
                    this.userToSend.points++;
                } else {
                    this.userToSend.points--;
                    console.log('pas de point')
                }
                console.log(this.userToSend.points)
            }

            let dataToSend = {
                isAdmin: this.userToSend.isAdmin,
                isDone: [...this.userToSend.isDone,
                this.id],
                points: this.userToSend.points,
                userId: this.userToSend.userId
            }
            const activityIsHover = {
                method: 'PUT',
                body: JSON.stringify(dataToSend)
            }
            fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user/${this.userToSend.id}/.json`, activityIsHover)
            this.displayIsOver = true;
        }
    }
}
</script>