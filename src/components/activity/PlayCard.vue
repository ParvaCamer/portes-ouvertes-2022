<template>
    <div class="play-card">
        <base-spinner v-if="isLoading"></base-spinner>
        <div class="card-content" v-else>
            <h1>{{ title }}</h1>
            <div class="bordure"></div>
            <div class="card-image">
                <img :src="url" />
            </div>
            <h4>{{ question }}</h4>
            <div class="div-ul-prop">
                <ul class="ul-prop" v-for="(proposition, value) in propositions" :key="proposition.id">
                    <proposition-answer class="proposition" @click="addType(value)" :type="proposition.mode">
                        {{ proposition.name }}
                    </proposition-answer>
                    <svg v-if="previsualisation" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" @click="deleteProp(value)" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path
                            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                </ul>
            </div>
            <validate-button @click="getCorrectAnswer"></validate-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'url', 'question', 'propositions', 'previsualisation', 'userToSend', 'getCorrectAnswer'],
    data() {
        return {
            score: 0,
            isLoading: false
        }
    },
    methods: {
        addType(id) {
            if (this.propositions[id].mode === 'nonSelected') {
                this.propositions[id].mode = 'selected'
            } else if (this.propositions[id].mode === 'selected') {
                this.propositions[id].mode = 'nonSelected'
            }
        },
        deleteProp(id) {
            this.propositions.splice(id, 1)
        }
    }
}
</script>

<style scoped>
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
.play-card {
    margin: 0 50px 0 50px;
    z-index: 1;
    position: relative;
}

.play-card::before {
    background-image: url("@/assets/embleme.png");
    display: block;
    content: "";
    background-repeat: no-repeat;
    background-position: 50% 140px;
    background-size: 100%;
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

h4 {
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
    height: 280px;
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
</style>