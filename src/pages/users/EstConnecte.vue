<template>
    <base-card class="base-card-user">
        <div class="div-user">
            <h1>Bravo ! Tu es connecté(e) !</h1>
            <h3>Tu peux maintenant commencer ton aventure !</h3>
            <h3>Les règles du jeu sont simples : trouve le QR code caché dans la caserne, scanne le et réponds au quizz. Mais attention ! Si tu réponds faux à la question, tu perdras un point. Prends ton temps avant de valider ta réponse.</h3>
        </div>
    </base-card>
</template>

<style scoped>
.base-card-user {
    background-image: url("@/assets/IMG_3460.png");
    background-position-y: bottom;
    background-size: 440px;
    background-repeat: no-repeat;
    pointer-events: none;
    -webkit-user-select:none;
    -moz-user-select:none;
    user-select:none;
}

.div-user {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

@media (min-width: 375px) and (max-width: 430px) {
    .base-card-user {
        background-size: 100%;
    }

    h1 {
        font-size: 24px;
    }

    h3 {
        font-size: 17px;
    }
}

@media screen and (max-width: 375px) {
    .base-card-user {
        background-size: 100%;
    }

    h1 {
        font-size: 20px;
    }

    h3 {
        font-size: 16px;
    }
}
</style>