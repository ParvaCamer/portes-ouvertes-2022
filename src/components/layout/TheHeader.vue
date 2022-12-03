<template>
  <nav role="navigation">
    <div id="menuToggle">
      <input type="checkbox" />
      <span></span>
      <span></span>
      <span></span>
      <ul id="menu">
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
            <path fill-rule="evenodd"
              d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
          </svg>
          <router-link to="/allactivities">Toutes les activités</router-link>
        </li>
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools"
            viewBox="0 0 16 16">
            <path
              d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z" />
          </svg>
          <router-link to="/createactivity">Créer une activité</router-link>
        </li>
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-joystick"
            viewBox="0 0 16 16">
            <path
              d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2z" />
            <path
              d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23z" />
          </svg>
          <router-link to="/playanactivity">Jouer</router-link>
        </li>
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill"
            viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
          <router-link to="/user">Utilisateur</router-link>
        </li>
        <div class="btn-connexion" @mouseenter="mouseEnter" @mouseleave="mouseLeave" @click="handleSignOut">
          <button class="btn-user">Se déconnecter</button>
          <div class="padlock">
            <div class="lock" :class="rotation" :style="upLock"></div>
            <div class="square"></div>
          </div>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
export default {
  props: ['isLoggedIn'],
  data() {
    return {
      rotation: null,
      upLock: null,
      logIn: null,
      classMenu: null,
      user: [],
      userId: '',
      userLoggedIn: {},
      userIsAdmin: false
    }
  },
  created() {
    let auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid
      }
    });
    axios.get(`https://porte-ouverte-3be77-default-rtdb.europe-west1.firebasedatabase.app/user.json`).then((response) => {
      for (let key in response.data) {
        this.user.push(response.data[key])
      }
    })

    setTimeout(() => {
      this.userLoggedIn = this.user.find(user => user.userId === this.userId)
      this.userIsAdmin = this.userLoggedIn.isAdmin;
    }, 500);
  },
  watch: {
    isLoggedIn(value) {
      if (value == false) {
        this.rotation = null;
        this.upLock = 'height: 12px';
      }
      this.logIn = value
    }
  },
  methods: {
    useRotation() {
      this.rotation = 'rotate-180'
    },
    mouseEnter() {
      this.upLock = 'height: 14px'
    },
    mouseLeave() {
      this.upLock = 'height: 12px'
    },
    handleSignOut() {
      this.useRotation();
      setTimeout(() => {
        let auth = getAuth();
        signOut(auth).then(() => {
          this.$router.push({ path: '/user' })
        })
      }, 500)

    }
  }
}
</script>

<style scoped>
.btn-connexion {
  width: 165px;
  display: flex;
  right: 40px;
  top: 58px;
  margin-left: 1rem;
  border-radius: 30px;
  border: 1px solid #CC0000;
  transition: 150ms ease-in;
}

.btn-user {
  letter-spacing: 1px;
  padding: 15px;
  color: #CC0000;
  background-color: transparent;
  position: relative;
  transition: 250ms ease-in;
  border: none;
}

.btn-connexion:hover {
  background: #cc00000e;
  transition: 250ms ease-out;
}

@media screen and (min-width: 1023px) {
  #menuToggle input {
    display: none;
  }

  /* Header */
  header {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  header a {
    text-decoration: none;
    color: #CC0000;
    font-size: 17px;
    display: inline-block;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid transparent;
    transition: 250ms ease-in;
  }

  li {
    margin: 0 0.7rem;
    transition: 100ms ease-in;
    cursor: pointer;
  }

  li:active,
  a.router-link-active {
    border: 1px solid #CC0000 !important;
    transition: 250ms ease-out;
    transform: scale(108%);
  }

  li:hover {
    transition: 300ms ease-out;
    transform: scale(108%);
  }

  h1 a {
    color: white;
    margin: 0;
  }

  h1 a:hover,
  h1 a:active,
  h1 a.router-link-active,
  a:hover {
    border-color: transparent;
  }

  header ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bi {
    position: relative;
    left: 20px;
    top: 2px;
    color: #cc000094;
  }
}

@media (max-width: 1023px) {
  .btn-user {
    letter-spacing: 1px;
    padding: 15px;
    color: #CC000094;
    background-color: transparent;
    position: relative;
    transition: 250ms ease-in;
    border: none;
  }

  .btn-connexion {
    width: 165px;
    display: flex;
    margin-left: 1rem;
    border-radius: 30px;
    border: 1px solid #CC000094;
    transition: 150ms ease-in;
    position: absolute;
    top: 20px;
  }

  .btn-connexion:hover {
    background: #cc00000e;
    transition: 250ms ease-out;
  }

  #menuToggle {
    display: block;
    position: relative;
    z-index: 2;
    -webkit-user-select: none;
    user-select: none;
  }

  #menuToggle a {
    text-decoration: none;
    color: #232323;

    transition: color 0.3s ease;
  }

  #menuToggle input {
    display: block;
    width: 40px;
    height: 32px;
    position: absolute;
    left: 27px;
    top: -35px;

    cursor: pointer;

    opacity: 0;
    z-index: 3;

    -webkit-touch-callout: none;
  }

  #menuToggle span {
    display: block;
    width: 33px;
    height: 4px;
    left: 40px;
    top: -25px;
    margin-bottom: 5px;
    position: relative;

    background: #cc000094;
    border-radius: 3px;

    z-index: 2;

    transform-origin: 4px 0px;

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0),
      opacity 0.55s ease;
  }

  #menuToggle span:first-child {
    transform-origin: 0% 0%;
  }

  #menuToggle span:nth-last-child(2) {
    transform-origin: 0% 100%;
  }

  #menuToggle input:checked~span {
    opacity: 1;
    transform: rotate(45deg) translate(-2px, -1px);
    background: #2c3e50;
  }

  #menuToggle input:checked~span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }

  #menuToggle input:checked~span:nth-last-child(2) {
    transform: rotate(-45deg) translate(0, -1px);
  }

  #menu {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    position: absolute;
    height: 250px;
    width: 100%;
    margin: -90px 0 0 -30px;
    padding-top: 50px;

    background: linear-gradient(to top,
        #cc0000b7 0%,
        #d33636 1.3%,
        hsl(0, 64.12%, 61.58%) 4.9%,
        hsl(0, 64.12%, 69.78%) 10.4%,
        hsl(0, 64.12%, 76.72%) 17.5%,
        hsl(0, 64.12%, 82.51%) 25.9%,
        hsl(0, 64.12%, 87.25%) 35.2%,
        hsl(0, 64.12%, 91.05%) 45%,
        hsl(0, 64.12%, 94%) 55%,
        hsl(0, 64.12%, 96.22%) 64.8%,
        hsl(0, 64.12%, 97.81%) 74.1%,
        hsl(0, 64.12%, 98.88%) 82.5%,
        hsl(0, 64.12%, 99.53%) 89.6%,
        hsl(0, 64.12%, 99.86%) 95.1%,
        hsl(0, 64.12%, 99.98%) 98.7%,
        hsl(0, 0%, 100%) 100%);
    list-style-type: none;
    -webkit-font-smoothing: antialiased;

    transform-origin: 0% 0%;
    transform: translate(-100%, 0);

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0);
  }

  #menuToggle li {
    font-size: 22px;
    display: flex;
    justify-content: center;
    text-align: center;
    z-index: 2;
  }

  #menuToggle a:hover {
    transition: 250ms ease-in;
    transform: scale(108%);
    color: #cc0000;
  }

  li a.router-link-active {
    transform: scale(108%);
    border-bottom: 1px solid #CC0000;
  }

  #menuToggle input:checked~ul {
    transform: none;
  }

  .bi {
    position: relative;
    left: -15px;
    top: 2px;
    color: #cc000094;
  }
}



/* cadenas */
.padlock {
  position: relative;
  left: -5px;
  bottom: -5px;
  cursor: pointer;
}

.lock {
  position: relative;
  left: 1px;
  bottom: -4px;
  width: 12px;
  height: 12px;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  border: 2px solid #cc0000b7;
  border-bottom: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.square {
  height: 13px;
  width: 13px;
  border: 1px solid #CC0000;
  background-color: #cc0000;
  border-radius: 2px;
}

.rotate-180 {
  transition: 350ms ease-out;
  transform: rotateY(-180deg) translateX(-10px);
}
</style>