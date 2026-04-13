# Rapport de Projet - Système de Gestion des Prêts

Ce document présente un rapport LaTeX complet sur le développement d'un système de gestion des prêts, incluant l'étude fonctionnelle, conceptuelle et la réalisation.

## Structure du Rapport

Le rapport suit la structure demandée avec les sections suivantes :

- **Sommaire** (Table des matières automatique)
- **Remerciements**
- **Introduction Générale**
- **Présentation de l'entreprise**
- **Chapitre 1 : Études fonctionnelles**
  - Introduction
  - Description du projet
  - Identification des acteurs
  - Analyse des besoins (fonctionnels et non fonctionnels)
  - Conclusion
- **Chapitre 2 : Études conceptuelle (côté client)**
  - Introduction
  - Langage de modélisation
  - Conception (diagrammes UML)
  - Conclusion
- **Chapitre 3 : Réalisation du système (côté client)**
  - Introduction
  - Environnement de travail
  - Description complète du système avec toutes les interfaces
  - Conclusion
- **Conclusion Générale**
- **Bibliographie**
- **Annexes**

## Fichiers Inclus

- `rapport_projet.tex` : Document LaTeX principal
- `compile.bat` : Script de compilation pour Windows
- `images/` : Dossier pour les figures et captures d'écran
- `README.md` : Ce fichier de documentation

## Compilation

### Prérequis
- Installation de LaTeX (MiKTeX, TeX Live, ou autre distribution)
- Les packages LaTeX suivants : babel, geometry, fancyhdr, graphicx, hyperref, listings, etc.

### Compilation automatique (Windows)
Exécutez le script de compilation :
```batch
compile.bat
```

### Compilation manuelle
```bash
pdflatex rapport_projet.tex
pdflatex rapport_projet.tex  # Seconde compilation pour les références croisées
```

## Personnalisation

Pour adapter ce rapport à votre projet :

1. **Remplacez les placeholders** :
   - `[Nom de l'étudiant]`
   - `[Nom de l'encadrant]`
   - `[Nom de l'entreprise]`
   - `[Nom de l'université/école]`

2. **Ajoutez vos images** :
   - Placez vos captures d'écran dans le dossier `images/`
   - Les noms de fichiers attendus sont référencés dans le document

3. **Personnalisez le contenu** :
   - Modifiez les sections selon votre projet spécifique
   - Ajustez les technologies et outils utilisés
   - Adaptez les fonctionnalités décrites

## Fonctionnalités LaTeX Incluses

- **Mise en page professionnelle** avec geometry et fancyhdr
- **Support du français** avec babel
- **Liens hypertexte** dans la table des matières
- **Coloration syntaxique** pour le code source
- **Numérotation automatique** des chapitres, sections et figures
- **Bibliographie** formatée
- **Annexes** avec diagrammes et scripts SQL

## Structure des Chapitres

Le rapport couvre tous les aspects d'un projet informatique :

1. **Analyse fonctionnelle** : Besoins, acteurs, spécifications
2. **Conception** : Modélisation UML, architecture
3. **Réalisation** : Technologies, interfaces, fonctionnalités

Chaque chapitre inclut des introductions, développements détaillés et conclusions.

## Images et Figures

Le document référence plusieurs types d'images :
- Captures d'écran des interfaces utilisateur
- Diagrammes UML (cas d'utilisation, classes)
- Graphiques et tableaux de bord

Assurez-vous d'ajouter ces images dans le dossier `images/` pour une compilation complète.