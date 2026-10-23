# Site du Collège Sainte-Famille — La Grande Rencontre des Générations

Site vitrine responsive en HTML, CSS et JavaScript, sans installation nécessaire.

## Lancer le site sur votre ordinateur

1. Décompressez `sainte_famille_site.zip`.
2. Ouvrez le dossier `sainte_famille_site`.
3. Double-cliquez sur `index.html`. Le site s'ouvre dans votre navigateur.
4. Cliquez sur **Entrer dans la fête** pour afficher la page.

Pour un aperçu local plus fiable, vous pouvez aussi ouvrir le dossier dans VS Code et utiliser l'extension Live Server. Le site ne nécessite ni npm ni serveur pour fonctionner.

## Modifier la date, l'heure, le lieu et les contacts

Ouvrez `script.js` dans un éditeur de texte. Au début du fichier, modifiez l'objet `CONFIG` :

```js
const CONFIG = {
  eventDateTime: "2026-12-20T10:00:00+03:00",
  displayDate: "Dimanche 20 décembre 2026",
  displayTime: "10 h 00",
  venue: "Nom du terrain",
  address: "Adresse officielle, ville, pays",
  organizer: "Nom de l'organisateur",
  contact: "Téléphone ou e-mail",
  whatsappNumber: "2567XXXXXXXX",
  googleFormAction: "",
  googleFormFields: {
    name: "", category: "", participation: "", companions: "", contact: ""
  }
};
```

**Important :** l'exemple de date et de numéro ci-dessus est illustratif. Remplacez-les par les vraies informations. Gardez `eventDateTime` vide jusqu'à ce que la date et l'heure soient confirmées. Utilisez un fuseau horaire explicite, par exemple `+03:00` pour l'heure d'Afrique de l'Est.

## Ajouter vos photos

Placez vos photos dans le dossier `photos` avec ces noms, ou modifiez les chemins dans `index.html` :

- `souvenir-1.jpg`
- `souvenir-2.jpg`
- `souvenir-3.jpg`
- `souvenir-4.jpg`
- `souvenir-5.jpg`

En l'absence de photos, des emplacements illustrés s'affichent automatiquement. Utilisez uniquement des photos que vous avez le droit de publier et obtenez l'accord des personnes photographiées, particulièrement des élèves mineurs.

## Connecter le formulaire à Google Forms

Le site ne prétend pas enregistrer les inscriptions tant qu'un service de réception n'est pas configuré. Sans connexion, il prépare un message WhatsApp contenant les informations saisies.

Une option pratique est d'utiliser Google Forms :
1. Créez un formulaire Google avec les mêmes champs : Nom et prénom, Catégorie, Type de participation, Nombre d'accompagnants, Contact.
2. Dans le formulaire, utilisez le menu de préremplissage ou inspectez le formulaire publié pour identifier les identifiants d'entrée `entry.XXXXXXXX`.
3. L'URL de réception se termine habituellement par `/formResponse`. Mettez cette URL dans `googleFormAction`.
4. Dans `googleFormFields`, remplacez chaque valeur vide par l'identifiant exact du champ correspondant, par exemple `"name": "entry.123456789"`.
5. Testez avec une réponse d'essai et vérifiez qu'elle apparaît bien dans Google Forms.

**Limite technique :** l'envoi HTML vers Google Forms depuis un autre site peut être soumis à des restrictions du navigateur et le mode `no-cors` ne permet pas de vérifier une confirmation serveur fiable. Pour une confirmation rigoureuse, utilisez un backend ou un service de formulaire tiers qui renvoie un succès vérifiable. Ne collectez pas de données personnelles sans informer les participants et les responsables du traitement.

## Publier gratuitement avec GitHub Pages

1. Créez ou connectez-vous à un compte sur https://github.com/.
2. Créez un nouveau dépôt, par exemple `sainte-famille-rencontre`.
3. Téléversez `index.html`, `style.css`, `script.js`, `README.md` et le dossier `photos`.
4. Ouvrez **Settings → Pages**.
5. Dans **Build and deployment**, choisissez **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`.
6. Enregistrez. GitHub affichera l'adresse publique après le déploiement.

## Publier gratuitement avec Vercel

1. Créez ou connectez-vous à https://vercel.com/.
2. Importez le dépôt GitHub qui contient le site, ou utilisez l'option de déploiement depuis votre dossier si elle est disponible.
3. Aucun framework n'est nécessaire : c'est un site statique. Gardez les réglages de build vides si Vercel le permet et le dossier racine comme dossier de sortie.
4. Cliquez sur **Deploy** et utilisez l'adresse fournie.

## Notes

- Le site est responsive pour téléphone, tablette et ordinateur.
- Le compte à rebours reste en attente tant que `eventDateTime` est vide.
- Le bouton Google Maps n'est actif que si `address` est renseignée.
- Les boutons WhatsApp ouvrent le partage avec un message préparé ; l'utilisateur doit encore confirmer l'envoi dans WhatsApp.
- Le lien copié est celui de la page actuellement ouverte. Après publication, il s'agit de l'adresse publique.
- Le site respecte la préférence système de réduction des animations.
