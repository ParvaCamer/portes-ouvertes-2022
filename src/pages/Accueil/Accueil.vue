<template>
    <div class="grid-container">
        <afficher-cartes  
            v-for="(cards, index) in cardsArray" 
            :key="cards.key"
            :id="cards.id"
            :index="index" 
            :title="cards.title"
            :url="cards.url"
            :question="cards.question"
            :propositions="cards.propositions"
            :QRcode="cards.QRcode"
            :image="cards.image"

            @delete-card="deleteCard"
        >
        </afficher-cartes>
    </div>
</template>

<script>
import AfficherCartes from './AfficherCartes.vue';
import firebase from 'firebase/compat/app';

export default {
    components: {
        AfficherCartes
    },
    data() {
        return {
            cardsArray: [],
            i: 0,
        }
    },
    async mounted() {
        const response = await fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity.json`)
        const responseData = await response.json();
        this.formatCards(responseData)
        this.loadImage();
    },
    methods: {
        deleteCard(value) {
            for (let i = 0; i < this.cardsArray.length; i++) {
                if (this.cardsArray[i].id === value) {
                    this.cardsArray.splice(i, 1)
                }
            }
            this.$forceUpdate();
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
                self.cardsArray[self.i].url = `https://firebasestorage.googleapis.com/v0/b/porte-ouverte-3be77.appspot.com/o/${self.cardsArray[self.i].image}?alt=media`
                self.i++
            })
        },
        formatCards(cardData) {
            for (let key in cardData) {
                this.cardsArray.push({...cardData[key], id: key})
            }
        }
    }
}
</script>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 40px;
}

@media (min-width: 941px) and (max-width:1025px){
    .grid-container {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 940px) {
    .grid-container {
        grid-template-columns: 1fr;
    }
}
</style>