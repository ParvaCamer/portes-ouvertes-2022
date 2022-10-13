<template>
    <teleport to="body">
        <div v-if="show" @click="$emit('close');" class="backdrop"></div>
        <transition name="dialog">
            <dialog open v-if="show">
                <header>
                    <slot name="header">
                        <h2>{{ title }}</h2>
                    </slot>
                </header>
                <section>
                    <slot name="error">
                        <h3> {{ error }}</h3>
                    </slot>
                </section>
                <menu class="dialog-menu">
                    <slot name="actions">
                        <button class="dialog-button" @click="$emit('close');">Fermer</button>
                    </slot>
                </menu>
            </dialog>
        </transition>
    </teleport>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: false,
        },
        error: {
            type: String,
            required: false
        }
    },
    emits: ['close'],
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: #1a1a1a41;
    z-index: 10;
}

dialog {
    position: fixed;
    top: 20vh;
    left: 10%;
    width: 80%;
    z-index: 100;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: white;
}

header {
    background-color: #cc000094;
    color: white;
    width: 100%;
    padding: 1rem;
}

header h2 {
    margin: 0;
}

section {
    display: flex;
    text-align: center;
    justify-content: center;
    padding: 10px;
}

section h3 {
    color: #2c3e50;
}
menu {
    padding: 1rem;
    margin: 0;
}

.dialog-menu {
    height: 50px;
    display: flex;
    justify-content: center;
}

.dialog-button {
    cursor: pointer;
    position: relative;
    width: 30%;
    height: 100%;
    border-radius: 20px;
    border: 1px solid #494c6d;
    background-color: #494c6d;
    color: #aeaeb6;
    transition: 200ms ease-in;
}

.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
    transform: scale(0.8)
}

.dialog-enter-active {
    transition: all 0.3s ease-out
}

.dialog-leave-active {
    transition: all 0.3s ease-in
}

.dialog-enter-to,
.dialog-leave-from {
    opacity: 1;
    transform: scale(1);
}

@media (min-width: 768px) {
    dialog {
        left: calc(50% - 20rem);
        width: 40rem;
    }
}
</style>