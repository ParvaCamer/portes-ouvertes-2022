<template>
    <div class="div-input-submit">
        <input class="input-submit" type="submit" value="Valider" />
    </div>
</template>

<style scoped>
.div-input-submit {
    height: 50px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.input-submit {
    cursor: pointer;
    position: relative;
    width: 50%;
    border-color: #2c3e50;
    border-radius: 20px;
    background-color: #ffffff;
    color: #2c3e50;
    transition: 200ms ease-in;
}

.input-submit:hover,
.input-submit:active {
    background-color: #cc000094;
    box-shadow: 0 0 1.5em #cc00006b;
    border: none;
    transform: scale(103%);
    -webkit-transition: 350ms ease-out;
    -ms-transition: 350ms ease-out;
    transition: 350ms ease-out;
}

.input-submit:active {
    top: 0.1em;
}
</style>