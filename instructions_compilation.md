# Instructions de Compilation du Rapport LaTeX

## 🌐 Option 1: Compilation en ligne (RAPIDE)

### Overleaf (Recommandé)
1. Allez sur **https://overleaf.com**
2. Créez un compte gratuit
3. Cliquez sur "New Project" → "Upload Project"
4. Uploadez le fichier `rapport_projet.tex`
5. Le PDF se génère automatiquement !

### ShareLaTeX
1. Allez sur **https://sharelatex.com** 
2. Créez un projet et collez le contenu du fichier
3. Compilation automatique

## 💻 Option 2: Installation locale (Windows)

### Étape 1: Installer MiKTeX
1. Téléchargez depuis **https://miktex.org/download**
2. Installez avec les options par défaut
3. Redémarrez votre ordinateur

### Étape 2: Installer un éditeur LaTeX
**TeXstudio** (Recommandé):
- Téléchargez: **https://texstudio.org**
- Installation simple avec interface intuitive

**Texmaker** (Alternative):
- Téléchargez: **https://xm1math.net/texmaker**

### Étape 3: Compiler
1. Ouvrez `rapport_projet.tex` dans l'éditeur
2. Appuyez sur **F5** ou cliquez "Compile"
3. Le PDF apparaît automatiquement

## 📱 Option 3: Applications mobiles

### Android/iOS
- **Overleaf app** - Édition et compilation en ligne
- **LaTeX Editor** - Édition locale basique

## 🚀 Compilation rapide avec script

Une fois LaTeX installé, utilisez:
```batch
compile.bat
```

## ❗ Résolution de problèmes

### Erreur "pdflatex not recognized"
- LaTeX n'est pas installé
- Redémarrez après installation
- Vérifiez le PATH système

### Packages manquants
- MiKTeX les télécharge automatiquement
- Acceptez les téléchargements lors de la première compilation

### Erreurs de compilation
- Vérifiez les accents et caractères spéciaux
- Assurez-vous que le fichier est en UTF-8

## 📄 Résultat attendu

Le rapport généré contiendra:
- ✅ 20+ pages professionnelles
- ✅ Table des matières interactive
- ✅ Chapitres numérotés automatiquement
- ✅ Figures et tableaux
- ✅ Bibliographie formatée
- ✅ Annexes techniques

## 🎯 Personnalisation rapide

Avant compilation, remplacez:
- `[Nom de l'étudiant]` → Votre nom
- `[Nom de l'encadrant]` → Nom de votre encadrant
- `[Nom de l'entreprise]` → Nom de l'entreprise
- `[Nom de l'université/école]` → Votre établissement

Le document est prêt à compiler tel quel !
