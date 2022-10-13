<template>
    <button class="name noselect">
        <slot></slot>
    </button>
</template>

<style scoped>
.noselect {
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
		-webkit-tap-highlight-color: transparent;
}

button {
	width: 150px;
	height: 50px;
	font-size: 20px;
	font-weight: bold;
	background: white;
	border: 2px solid #cc0000;
	box-shadow: 5px 5px 0 #cc0000,
		-5px -5px 0 #cc0000,
		-5px 5px 0 #cc0000,
		5px -5px 0 #cc0000;
	transition: 500ms ease-in-out;
}

button:hover {
	border: 2px solid #cc000094;
	box-shadow: 20px 5px 0 #cc000094, -20px -5px 0 #cc000094;
}

button:focus {
	outline: none;
}
</style>