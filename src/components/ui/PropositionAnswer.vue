<template>
    <div class="props" :class="type">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['type']
}
</script>

<style scoped>
.props {
    border: 1px solid;
    border-radius: 5px;
    padding: 0.55em;
    color: white;
    background-color: #cc0000b7;
    border-color: #cc0000b7;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 250ms ease-in;
}

.selected {
    transition: background-color 300ms ease-out;
    background-color: #cc0000;
}

@media screen and (max-width: 320px) {
    .props {
        font-size: 14px;
    }
}
</style>