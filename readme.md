# Projet DAT
Le projet DAT (Domain Administration Tool) est une application qui permet de gérer les domaines et les infrastructures administrés par la société UpClear.
Parmis ces fonctionnalités on retrouve notamment l’ajout et la suppression de domaines et d’utilisateurs, la gestion des droits d’administrateurs, la gestion des serveurs et des bases de données.
Il s'agit d'une version développée pour l'entreprise et qui n'est pas encore déployé sur leur domaine.


![image](https://github.com/mickael99/PISTL/assets/57686550/bc04fba3-7c9c-4578-899c-b02e93b24808)


Ce projet prend la forme d’une application web composé d’un frontend développé avec la technologie Angular et d’une API Rest développé avec le framework .NET. Le frontend communique
avec le backend à l’aide de requêtes HTTP sur le port 5050 de l’API, tandis que le backend est connecté à une base de donnée déployée sur un Azure SQL Server. La communication entre l’API
et la base de donnée se fait à l’aide du protocole TCP sur le port 1433.

## Pré-requis
#### Environnement : Docker
Il faut avoir une version stable et à jour de Docker pour déployer l'application.

#### Backend : .NET
L'API est développé avec le framework .NET et le package Entity Framework. Il est aussi recommandé d'ajouter le package NUnit

#### Frontend : Node.js, Angular
Pour démarrer l'application il faut avoir préalablement installé Node.js, Angular

---

## Installation
### Azure Database
Vous devez avoir un Azure SQL Server actif avec une base de donnée azure déployée. Il vous faut ensuite récupérer la Conection_String de la database et la copier à différents endroits du code.
 - Dans le fichier Docker-compose situé à la racine du projet : remplacer la String associée à `ConnectionStrings__AzureDatabase` par la votre.
 - Dans le fichier `appsetting.json` situé dans le dossier `PISTL/Project/backend/src/` : remplacer la String associée à `ConnectionStrings__AzureDatabase` par la votre.
 - Dans le fichier DatContext situé dans le dossier `PISTL/Project/backend/src/Models/`  : à la ligne 68, remplacer la String présente dans le builder.UseSQLServer() par la votre.
   
### Build avec Docker
Rendez-vous à la racine du projet. 
Vous pouvez lancer la commande 
```bash
cd PISTL/Project
docker compose up
```
Cette commande va générer les images docker ainsi que les container backend et frontend. Vous pouvez suivre les opérations sur le terminal.
Une fois que le container frontend et backend sont prêt et en cours d'execution, vous pouvez vous connecter à l'application.

---

## Ouverture de l'application
Rendez-vous sur le port 4200 de votre server local ou avec l'URL :
###### http://localhost:4200

---

## Lancer les Tests
> Backend tests
```bash
cd PISTL/Project/backend
dotnet test
```

> End-to-end tests
```bash
cd PISTL/Project/frontend
npm run cypress:open
```

