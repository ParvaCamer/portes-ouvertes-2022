<template>
    <transition name="scale">
        <base-card id="card-previsualisation" v-if="activity.title || activity.question || (activity.propositions.length > 0) || activity.image">
            <h5>Prévisualisation: </h5>
            <play-card 
            :title="activity.title" 
            :question="activity.question" 
            :url="urlImage"
            :propositions="activity.propositions" 
            :previsualisation="true">
            </play-card>
        </base-card>
    </transition>
</template>

<script>
export default {
    props: ['activity', 'imageData', 'getImage'],
    data() {
        return {
            urlImage: null
        }
    },
    methods: {
        getFileImage(image) {
            this.urlImage = URL.createObjectURL(image);
            return this.urlImage;
        }
    },
    watch: {
        getImage() {
            this.getFileImage(this.imageData) 
        }
    }
}
</script>

<style scoped>
h5 {
    float: left;
    opacity: 50%;
    position: absolute;
    margin: 0;
    padding: 5px;
}

.scale-enter-from {
    opacity: 0;
    transform: scale(0.8)
}

.scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.scale-enter-active {
    transition: all 0.3s ease-out;
}

.scale-leave-active {
    transition: all 0.2s ease-in;
}

.scale-enter-to,
.scale-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>