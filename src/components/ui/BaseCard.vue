<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<style scoped>
.card {
    margin-top: 50px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 670px;
    width: 420px;
    border: 1px solid;
    border-radius: 20px;
    background-color: white;
    justify-content: center;
}

@media (min-width: 375px) and (max-width: 430px) {
    .card {
        width: 98%;
    }
}

@media screen and (max-width: 375px) {
    .card {
        width: 96%;
    }
}
</style>