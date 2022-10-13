<template>
    <div>
        <div class="flex-play-card">
            <h1>Utilisateur :</h1>
            <base-card class="card-play">
                <div class="card-qr-code">
                    <h2>Connexion</h2>
                    <h3>Scanne moi pour te connecter</h3>
                    <img class="qr-code-image" :src="url" />
                </div>
            </base-card>
            <h1>Activités :</h1>
        </div>
        <div class="grid-play-card">
            <base-card class="card-play" v-for="cards in cardsArray" :key="cards.id">
                <router-link class="router-qr-code" :to="`/portes-ouvertes-2022/playanactivity/${cards.id}`">
                    <div class="div-card-play">
                        <h2>{{ cards.title }}</h2>
                        <h3>Scanne moi et accède au quizz</h3>
                        <img class="qr-code-image" :src="cards.QRcode" />
                        <br />
                    </div>
                </router-link>
            </base-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cardsArray: [],
            url: null,
        }
    },
    created() {
        this.url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://parvacamer.github.io/portes-ouvertes-2022/user`;
    },
    async mounted() {
        const response = await fetch(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/activity.json`);
        const responseData = await response.json();
        this.formatCards(responseData);
    },
    methods: {
        formatCards(cardData) {
            for (let key in cardData) {
                this.cardsArray.push({ ...cardData[key], id: key })
            }
        }
    }
}
</script>

<style scoped>
h1 {
    margin-top: 40px;
}

h2 {
    margin-top: 40px;
}

.flex-play-card {
    display: flex;
    flex-direction: column;
}

.card-qr-code {
    position: relative;
    top: -20px;
}

.router-qr-code {
    text-decoration: none;
    color: #2c3e50;
    position: relative;
    top: -20px;
}

.grid-play-card {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 40px;
}

.card-play {
    height: 400px !important;
    margin-top: 20px !important;
}

.qr-code-image {
    position: relative;
    margin-top: 25px;
    width: 50%;
    height: 50%;
}

@media (min-width: 941px) and (max-width:1025px){
    .grid-play-card {
        grid-template-columns: 1fr 1fr;
        row-gap: 30px;
    }
}

@media (max-width: 800px) {
    .grid-play-card {
        grid-template-columns: 1fr;
        row-gap: 30px;
    }
}
</style>