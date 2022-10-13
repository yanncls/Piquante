#Piquante 

##Une application web d'avis gastronomiques dont une API à construire from scratch. 

###Réalisé avec #javascript #nodejs #mongodb

L'utilisateur va pouvoir se connecter ou créer un compte, un token sécurisé lui sera envoyé par l'API pour sa navigation.

![Screenshot 2022-10-13 at 09 25 26](https://user-images.githubusercontent.com/91957898/195529872-9c11caf3-1209-4b66-ae93-41dd42c66a57.png)

L'utilisateur va pouvoir accéder à toutes les sauces mises en ligne par les autres utilisateurs, 

![Screenshot 2022-10-13 at 09 27 11](https://user-images.githubusercontent.com/91957898/195530269-6bbb7e09-4ad6-4174-93a8-c406b49e8be2.png)

L'utilisateur peut accéder à une sauce et voir ses détails, il peut like/dislike une seule fois, 

![Screenshot 2022-10-13 at 09 29 48](https://user-images.githubusercontent.com/91957898/195530837-8d908d3e-1698-47ac-b4fc-6f6fbf18e842.png)

L'utilisateur peut créer une sauce, l'API vérifie la validité des données dont une image puis doit sauvegarder tous les attributs des champs inputs sur le serveur mongoDB si
tout est valide

![Screenshot 2022-10-13 at 09 31 11](https://user-images.githubusercontent.com/91957898/195531173-b17bc982-d664-4072-89b0-e4ad7aa845bc.png)

L'utilisateur peut modifier ou supprimer sa sauce, l'API vérfie que l'utilisateur qui souhaite modifier ou supprimer dispose bien du token et id valide,
L'utilisateur peut aussi se déconnecter, ce qui va supprimer le token du localstorage

![Screenshot 2022-10-13 at 09 34 41](https://user-images.githubusercontent.com/91957898/195531805-a2014082-c416-4166-93ee-46c45701126c.png)
