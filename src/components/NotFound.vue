<template>
    <section>
        <base-card class="card-not-found">
            <h2>Page non trouvée</h2>
            <p>Cette page ne peut pas être trouvée - essaie peut-être de te connecter grâce au QR code utilisateur.
            </p>
        </base-card>
    </section>
</template>

<style scoped>
.card-not-found {
    height: 250px !important;
    width: 380px !important;
    padding: 25px;
    position: relative;
}

.card-not-found::before {
    background-image: url("@/assets/error.svg");
    display: block;
    content: "";
    background-repeat: no-repeat;
    background-position: 50% 14px;
    background-size: 100%;
    position: absolute;
    top: 0;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0.4;
}

.card-not-found h2 {
    margin-bottom: 30px;
}

.card-not-found p {
    font-size: 18px;
    z-index: 1 !important;
}

.card-not-found a {
    text-decoration: none;
    color: #2c3e50;
    cursor: pointer;
}

@media (min-width: 375px) and (max-width: 430px) {
    .card-not-found {
        width: 85% !important;
    }
}

@media screen and (max-width: 375px) {
    .card-not-found {
        width: 80% !important;
    }
}
</style>