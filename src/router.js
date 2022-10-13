import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Accueil from './pages/Accueil/Accueil.vue';
import CreerActivite from './pages/Creation/CreerActivite.vue';
import Jouer from './pages/Jouer/Jouer.vue';
import Utilisateur from './pages/users/Utilisateur.vue';
import AfficherActivite from './pages/Jouer/AfficherActivite.vue';
import NotFound from './components/NotFound.vue';

const router = createRouter({
    mode: 'history',
    history: createWebHistory('/portes-ouvertes-2022/'),
    routes: [
        { path: '/', redirect: '/portes-ouvertes-2022/user' },
        { path: '/portes-ouvertes-2022/allactivities', component: Accueil },
        { path: '/portes-ouvertes-2022/createactivity', component: CreerActivite },
        { path: '/portes-ouvertes-2022/playanactivity', component: Jouer},
        { path: '/portes-ouvertes-2022/playanactivity/:id', component: AfficherActivite, meta: { requiresAuth: true }},
        { path: '/portes-ouvertes-2022/user', component: Utilisateur},
        { path: '/portes-ouvertes-2022/:notFound(.*)', component: NotFound}
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