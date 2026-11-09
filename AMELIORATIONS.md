# Améliorations à faire

Liste issue d'une relecture complète du code, classée par priorité.
À traiter de haut en bas : les premiers points sont bloquants, les derniers sont du confort.

---

## 1. Sécurité — à faire en premier

### 1.1 Fermer les règles de la Realtime Database

La base accepte actuellement des lectures sans authentification. Tant que les règles
sont ouvertes, tout le reste de cette liste est secondaire : la protection ne peut pas
venir du code de l'application.

À faire dans la console Firebase → Realtime Database → Règles :

```json
{
  "rules": {
    "activity": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('user').child(auth.uid).child('isAdmin').val() === true"
    },
    "user": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid",
        "isAdmin": { ".write": false }
      }
    }
  }
}
```

Point important : `isAdmin` doit être en écriture interdite depuis le client, sinon
n'importe qui peut se donner les droits administrateur sur son propre profil.
Le flag se met à la main dans la console, ou via un *custom claim* Firebase Auth.

### 1.2 Envoyer le jeton d'authentification sur chaque requête

Aucun appel réseau du projet n'envoie de jeton (aucune occurrence de `Authorization`
ou `getIdToken` dans `src/`). Une fois les règles fermées, toutes les requêtes
échoueront tant que ce point n'est pas fait.

```js
const token = await getAuth().currentUser.getIdToken();
await fetch(`${BASE_URL}/activity.json?auth=${token}`, { method: 'POST', body: ... });
```

### 1.3 Protéger les routes d'administration

`src/router.js:14-15` — `/createactivity` et `/allactivities` n'ont aucune garde, alors
que ce sont les pages de création, édition et suppression.

```js
{ path: '/allactivities',  component: Accueil,       meta: { requiresAuth: true, requiresAdmin: true } },
{ path: '/createactivity', component: CreerActivite, meta: { requiresAuth: true, requiresAdmin: true } },
```

Puis vérifier `requiresAdmin` dans le `beforeEach`. À retenir : le `if (this.userIsAdmin)`
présent dans les composants sert à masquer des boutons, pas à protéger des données.

---

## 2. Bugs fonctionnels

### 2.1 Le score n'est jamais enregistré

`src/pages/Jouer/AfficherActivite.vue:118` — il y a une espace dans l'URL, entre l'id et
`/.json`. L'écriture part donc sur une clé encodée `%20` et jamais sur le bon utilisateur.
Les points et `isDone` ne sont pas réellement persistés, alors que l'interface affiche
la fin de l'activité comme si tout s'était bien passé.

```diff
- fetch(`${BASE_URL}/user/${this.userToSend.id} /.json`, activityIsHover)
+ const res = await fetch(`${BASE_URL}/user/${this.userToSend.id}/.json`, activityIsHover);
+ if (!res.ok) { /* afficher une erreur, ne pas passer displayIsOver à true */ }
```

### 2.2 Remplacer les `setTimeout` par de vraies attentes

`TheHeader.vue:86`, `AfficherCartes.vue:62`, `CreerActivite.vue:116` — le même motif est
répété : lancer `onAuthStateChanged` et un `axios.get` en parallèle, puis lire le résultat
après 500 ou 1000 ms. Si le réseau est plus lent (téléphone en 4G dans une caserne,
exactement le cas d'usage), `userLoggedIn` vaut `undefined` et la lecture de `.isAdmin`
lève une `TypeError`.

Le bon pattern est déjà écrit dans le projet : `getCurrentUser()` dans `src/router.js:23-34`
enveloppe `onAuthStateChanged` dans une promesse. Il suffit de le réutiliser.

```js
const user = await getCurrentUser();
const { data } = await axios.get(`${BASE_URL}/user.json`);
this.userIsAdmin = Object.values(data ?? {})
  .find(u => u.userId === user?.uid)?.isAdmin ?? false;
```

À retenir : un `setTimeout` n'attend rien, il espère. Un `await` sait *quand*.

### 2.3 Créer une activité sans image fait planter

`src/pages/Creation/CreerActivite.vue:162` — `onUpload()` est appelé sans condition, alors
que `imageData` vaut `null` si aucun fichier n'a été choisi. `onUpload()` lit
`this.imageData.name` et lève une `TypeError`.

`EditerCarte.vue:111` fait déjà la bonne vérification (`if (this.uploadImage)`) : le
correctif existe dans une copie du code mais pas dans l'autre.

```diff
- this.onUpload();
+ if (this.imageData) this.onUpload();
```

Au passage, `response.ok` n'est jamais vérifié après le POST ligne 157 : en cas d'échec,
`nameActivity` n'a pas de `.name` et le QR code généré pointe vers `activity/undefined`.

### 2.4 Les images peuvent être associées à la mauvaise carte

`src/pages/Accueil/Accueil.vue:50-65` et `AfficherActivite.vue:76-90` — l'index `self.i`
est incrémenté à chaque `getDownloadURL()` résolu. Ces appels partent en parallèle via
`forEach`, et leur ordre de retour n'a aucun rapport avec l'ordre de `cardsArray`.
Il faut faire la correspondance sur une donnée réelle, pas sur un compteur :

```js
displayImage(imageRef) {
  const card = this.cardsArray.find(c => c.image === imageRef.name);
  if (card) card.url = `${STORAGE_URL}/o/${card.image}?alt=media`;
}
```

### 2.5 Ne plus avaler les erreurs

Plusieurs écritures partent sans `await` ni `catch`, et l'interface se met à jour avant de
savoir si l'opération a réussi :

- `AfficherCartes.vue:88-100` — `delete-card` est émis avant confirmation : la carte
  disparaît de l'écran mais reste en base si la requête échoue.
- `EditerCarte.vue:111-120` — `close-edit` émis immédiatement, même problème.
- `Creation.vue:63` et `Utilisateur.vue:93` — POST non attendus : le compte peut exister
  dans Firebase Auth mais être absent de `/user`.
- `CreerActivite.vue:181` et `EditerCarte.vue:152` — les erreurs d'upload finissent dans
  un `console.log`. Le composant a déjà `showDialog` / `errorDialog` : autant s'en servir.

### 2.6 Redirection 404 et paramètre de route

- `src/router.js:42` — `next("/:notFound(.*)")` navigue vers ce motif pris au pied de la
  lettre. Ça tombe par accident sur la route catch-all, mais affiche une URL absurde.
  Nommer la route et faire `next({ name: 'NotFound' })`.
- `AfficherActivite.vue:42` — `this.$route.params.id` n'est lu qu'une fois dans `mounted`.
  Vue Router réutilise l'instance quand seul le paramètre change, donc passer d'une
  activité à une autre garde les anciennes données. À mettre dans un `watch` sur
  `route.params.id` avec `immediate: true`.

---

## 3. Qualité du code Vue

### 3.1 Les `:key` de `v-for` valent tous `undefined`

`PlayCard.vue:12` et `EditerCarte.vue:64` utilisent `:key="proposition.id"`, mais les
propositions créées dans `ajoutPropositions()` n'ont que `{ name, mode, answer }` — il n'y
a jamais d'`id`. Vue ne peut donc plus distinguer les éléments après un `push` ou un
`splice`, et l'état d'une réponse peut se retrouver sur une autre.

Soit générer un identifiant à la création (`id: crypto.randomUUID()`), soit utiliser
l'index (`:key="value"`), suffisant ici car la liste n'est pas réordonnée.

### 3.2 Ne pas modifier les props

- `PlayCard.vue:38-47` — `this.propositions[id].mode = 'selected'` et
  `this.propositions.splice(id, 1)` modifient directement le tableau du parent.
- `EditerCarte.vue:97` — `propositions: this.propositions` dans `data()` copie la
  *référence*, pas les données : les `push` et `splice` suivants modifient le parent.

Il faut cloner dans `data()` (`structuredClone(this.propositions)`) et remonter les
changements au parent par un `emit`. C'est aussi la seule erreur que ESLint signale déjà
(`vue/no-mutating-props`).

### 3.3 Les formulaires de connexion cassent l'application

`Connexion.vue:4-16` et `Creation.vue:4-19` — chaque champ est dans son propre `<form>`,
aucun n'a `@submit.prevent`, et le bouton est en dehors des deux. Appuyer sur `Entrée`
dans un champ déclenche la soumission native et recharge toute la page : saisie perdue,
état Vue détruit.

```html
<form class="input-container" @submit.prevent="register">
  <!-- les deux champs -->
  <button class="btn-auth" type="submit">Connexion</button>
</form>
```

### 3.4 Ne pas lire le DOM à la main

`CreerActivite.vue:138` et `EditerCarte.vue:127` — `document.querySelector('input[name="reponse"]:checked')`
contourne la réactivité et plante si rien n'est coché (pas de `?.`). Un `v-model` sur le
groupe de boutons radio fait le travail.

### 3.5 Se désabonner de `onAuthStateChanged`

`App.vue:26`, `TheHeader.vue:75`, `AfficherCartes.vue:50`, `AfficherActivite.vue:49` —
la fonction de désabonnement renvoyée n'est jamais conservée ni appelée. `AfficherCartes`
est rendu une fois par carte dans un `v-for`, donc chaque carte ajoute son écouteur global
sans jamais le retirer. À stocker et appeler dans `unmounted()`.

### 3.6 Une requête par carte au lieu d'une seule

`AfficherCartes.vue:56-60` — chaque instance refait un `axios.get(/user.json)` complet pour
calculer `userIsAdmin`. Avec N cartes, c'est N requêtes identiques. À récupérer une fois
dans `Accueil.vue` et passer en prop.

---

## 4. Accessibilité

- **Ajouter un `alt` aux images** : `PlayCard.vue:8`, `EditerCarte.vue:60`,
  `Jouer.vue:9` et `:20`, `GenerationQRCode.vue:5`. Les QR codes en particulier, puisque
  c'est le point d'entrée de l'application.
- **Rendre les éléments cliquables utilisables au clavier** : `Utilisateur.vue:6` est un
  `<p>` cliquable (à remplacer par un `<button type="button">`), et les icônes `<svg>` de
  suppression dans `PlayCard.vue:16-20` ne sont ni focusables ni nommées.
- **Nommer la case du menu mobile** : `TheHeader.vue:4` — ajouter
  `aria-label="Ouvrir le menu de navigation"`.
- **Corriger la structure des listes** : le `v-for` est posé sur le `<ul>` lui-même, ce qui
  produit plusieurs `<ul>` d'un seul élément, sans `<li>`. Mettre le `v-for` sur un `<li>`.

---

## 5. Dépendances et configuration

- **Mettre à jour `firebase` et `axios`** : `npm audit` remonte 68 vulnérabilités dont 7
  critiques. La majorité vient des outils de développement, mais `firebase` 9.x et `axios`
  1.1 sont livrés aux utilisateurs. Commencer par ces deux-là.
- **Charger la police en HTTPS** : `App.vue:39` importe
  `http://fonts.cdnfonts.com/...` — contenu mixte, bloqué ou dégradé par le navigateur
  sur un site servi en HTTPS.
- **Activer de vraies règles ESLint** : la configuration étend `vue3-essential` mais
  `rules: {}` est vide. Passer à `vue3-recommended` ferait remonter une bonne partie des
  points de la section 3 automatiquement. Il y a déjà 20 erreurs à corriger
  (`npx eslint . --ext .vue,.js`), dont des imports inutilisés.
- **Dé-obfusquer `src/firebase.js`** : le fichier est passé dans un obfuscateur et ne
  contient en réalité que la configuration Firebase. Cette configuration est publique par
  conception — la clé API web n'est pas un secret, la sécurité vient des règles de la
  section 1. L'obfuscation ne protège donc rien et rend seulement le fichier illisible.
  À réécrire en clair avec des variables `VUE_APP_*`.
- **Supprimer l'image du Storage à la suppression d'une activité** :
  `AfficherCartes.vue:88-100` ne retire que l'entrée en base. `deleteObject` est d'ailleurs
  importé ligne 24 mais jamais utilisé — l'intention était là.

---

## 6. Structure

- **Factoriser `CreerActivite.vue` et `EditerCarte.vue`** : `ajoutPropositions`, `onUpload`
  et la gestion de l'aperçu d'image sont quasi identiques dans les deux fichiers. Le bug 2.3
  en est la démonstration : une copie a reçu le correctif, l'autre pas. À extraire dans un
  composable `useActivityForm()`.
- **Uniformiser les conventions** : Options API partout sauf `Connexion.vue` et
  `Creation.vue` en `<script setup>` ; SDK Firebase `compat` pour le Storage et modulaire
  pour l'Auth. Choisir `<script setup>` et le SDK modulaire pour la suite.
- **Nettoyer** : `console.log` restants (`App.vue:29`, `AfficherActivite.vue:96-104`),
  `$forceUpdate()` inutile (`Accueil.vue:48` — `splice` déclenche déjà la réactivité),
  variables non utilisées remontées par ESLint.

---

## Ce qui est déjà bien

À ne pas perdre en refactorisant :

- L'arborescence `components/ui`, `components/layout`, `pages/<feature>` est celle qu'on
  retrouve sur des projets d'équipe.
- Les composants de base réutilisables (`BaseButton`, `BaseDialog`, `BaseSpinner`,
  `BaseCard`) montrent le bon réflexe de factorisation.
- `getCurrentUser()` dans `router.js:23-34` est exactement le bon pattern pour attendre
  Firebase Auth, avec le `unsubscribe()` immédiat. C'est la solution au problème 2.2.
- Route 404 catch-all, garde d'authentification, `_redirects` pour le SPA, ESLint en place :
  l'outillage n'a pas été bâclé.
