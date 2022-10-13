<template>
    <base-card class="base-card-user">
        <div class="div-user">
            <h1>Bravo ! Tu es connecté(e) !</h1>
            <h3>Tu peux maintenant commencer ton aventure ! Pars à la recherche du prochain QR code caché dans la caserne. Une fois trouvé, scanne le et réponds juste pour gagner des points !</h3>
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
}

@media screen and (max-width: 375px) {
    .base-card-user {
        background-size: 100%;
    }
}
</style>