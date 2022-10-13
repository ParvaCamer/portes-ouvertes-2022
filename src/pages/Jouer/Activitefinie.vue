<template>
    <base-card class="card-over">
        <div class="div-over">
            <h1>Tu as fini cette activité ! Félicitations à toi !</h1>
            <h2>Continue de chercher les autres activités qui sont dans la caserne !</h2>
        </div>
    </base-card>
</template>

<style scoped>
@media (min-width: 376px) and (max-width: 430px) {
    .card-over {
        background-position: 100px 215px !important;
    }
}

@media screen and (max-width: 375px) {
    .card-over {
        background-size: 90% !important;
        background-position: 55px 215px !important;
    }
}
.card-over {
    height: 400px !important;
    background-image: url('@/assets/card-over.svg');
    background-repeat: no-repeat;
    background-position: 110px 200px;
    background-size: 80%;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
}

.div-over {
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
</style>