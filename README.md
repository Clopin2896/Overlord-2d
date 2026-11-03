# La Dette du Roi — La porte des ingrats

Premier niveau jouable d’un jeu d’action et de commandement en vue de côté, entièrement en français. Phaser 3, JavaScript et Vite. Un seigneur déchu, trois larbins et un percepteur beaucoup trop bien équipé.

## Jouer

Sur PC : **Q/D ou ←/→** pour courir, **Espace** pour sauter, **J** pour l’épée, **K** pour envoyer la troupe sur la cible dorée, **L** pour rappeler immédiatement, **Échap** pour la pause. Le menu de pause permet de couper le son et de recommencer.

Sur Android : ouvrez le jeu dans Chrome ou Samsung Internet et tournez le téléphone en paysage. Déplacements à gauche, rappel/envoi/saut/épée à droite. Plusieurs doigts peuvent agir simultanément. Une rotation en portrait affiche une invitation à revenir en paysage. Le jeu se met en pause si l’onglet perd le focus.

### Le niveau

1. Franchissez les ruines avec votre troupe. Les larbins sautent et se regroupent automatiquement s’ils restent bloqués.
2. Approchez de la barricade. Le marqueur doré indique la cible de **K / Envoyer**. Les larbins démolissent le bois ; votre épée seule ne suffit pas.
3. Les coups de face rebondissent sur le bouclier du Percepteur. Envoyez au moins deux larbins pour l’abaisser, puis frappez.
4. Quand le garde lève sa masse et que la zone rouge apparaît, **rappelez les larbins et reculez**. Vous disposez de 1,8 seconde avant l’écrasement. Le rappel interrompt immédiatement leur tâche.
5. Battez le garde : la herse s’ouvre et la victoire termine ce premier chapitre.

Vous perdez si vos cinq points de vie ou vos trois larbins sont épuisés. Le bouton de nouvelle partie relance immédiatement tout le niveau. Aucun autre niveau n’est inclus.

## Développement dans le cloud

Aucune installation sur le PC du joueur. Dans l’environnement cloud, depuis `/workspace/Overlord-2d` :

```sh
npm ci
npm run dev
```

Node.js 22 ou 24. Le serveur de développement écoute sur le port 5173. Compilation :

```sh
npm run build
npm run preview -- --port 4173 --base=/Overlord-2d/
```

Les fichiers publiables sont dans `dist/`. La base Vite est relative (`./`) : le jeu fonctionne sous `/Overlord-2d/` et ne dépend d’aucune URL absolue de ressource. Dessins pixel par pixel générés par Canvas dans `src/art.js`, sons de synthèse originaux générés par Web Audio dans `src/audio.js`. Tout est livré dans le bundle ; aucun CDN, compte ou service externe n’est utilisé en jeu. Le son est activé par le bouton de démarrage, conformément aux règles des navigateurs mobiles.

## Vérification

```sh
npm run build
npm test
```

Playwright utilise Chromium installé dans le cloud (`/usr/bin/chromium`) s’il est disponible, sinon son navigateur téléchargé avec `npx playwright install --with-deps chromium`. Les tests lancent le **jeu compilé sous `/Overlord-2d/`**, effectuent de vraies entrées clavier/tactiles et observent un instantané en lecture seule de l’état. Ils couvrent le parcours, la barricade, les rebonds du bouclier, les attaques, le rappel, la victoire, la défaite, la pause et le redémarrage. Le scénario mobile simule un écran paysage de 851 × 393 pixels CSS avec densité 2,75 et multitouch ; ce n’est pas un essai sur un appareil Samsung physique.

À vérifier sur le Galaxy A56 : fluidité, volume sonore, confort des pouces, jeu simultané à plusieurs doigts, rotation et reprise après changement d’onglet dans Chrome/Samsung Internet. Les dimensions CSS peuvent varier selon les barres du navigateur et les réglages d’affichage Android.

## Publication GitHub Pages

Le workflow `.github/workflows/deploy.yml` compile et teste avant de publier. Dans le navigateur GitHub :

1. Ouvrez le dépôt → **Settings → Pages**.
2. Dans **Build and deployment → Source**, choisissez **GitHub Actions**.
3. Ouvrez **Actions → Publier le jeu sur GitHub Pages → Run workflow → main → Run workflow** si nécessaire.
4. Attendez que `build` et `deploy` soient verts. Le lien est affiché dans l’environnement `github-pages`.

Adresse prévue une fois la publication réussie : `https://clopin2896.github.io/Overlord-2d/`.

La compilation et les tests sont exécutés sur les machines cloud de GitHub Actions. Ce projet ne demande aucune commande sur votre PC.
