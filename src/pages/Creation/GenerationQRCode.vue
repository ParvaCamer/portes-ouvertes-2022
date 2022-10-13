<template>
    <base-card class="card-qr-code">
        <h1>Activité créée !</h1>
        <h3>Titre de l'activité : {{activity.title}}</h3>
        <img class="img" :src='url' />
    </base-card>
</template>

<script>
export default {
    props: ['activity', 'nameActivity'],
    emits: ['emit-qrcode'],
    data() {
        return {
            url: null
        }
    },
    async created() {
        this.url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://portes-ouvertes-2022.netlify.app/playanactivity/${this.nameActivity.name}`;
        this.$emit('emit-qrcode', this.url);
    }
}
</script>

<style scoped>
.card-qr-code {
    height: 400px !important;
}

.img {
    width: 50%;
    margin-bottom: 55px;
}
</style>