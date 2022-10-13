import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Accueil from './pages/Accueil/Accueil.vue';
import CreerActivite from './pages/Creation/CreerActivite.vue';
import Jouer from './pages/Jouer/Jouer.vue';
import Utilisateur from './pages/users/Utilisateur.vue';
import AfficherActivite from './pages/Jouer/AfficherActivite.vue';
import NotFound from './components/NotFound.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/portes-ouvertes-2022/user' },
        { path: '/allactivities', component: Accueil },
        { path: '/createactivity', component: CreerActivite },
        { path: '/playanactivity', component: Jouer},
        { path: '/playanactivity/:id', component: AfficherActivite, meta: { requiresAuth: true }},
        { path: '/user', component: Utilisateur},
        { path: '/:notFound(.*)', component: NotFound}
    ]
})

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        )
    })
};

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            next();
        } else {
            alert("Vous n'avez pas les droits !");
            next("/:notFound(.*)");
        }
    } else {
        next();
    }
})

export default router;