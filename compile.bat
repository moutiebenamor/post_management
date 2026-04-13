@echo off
echo Compilation du rapport LaTeX...
echo.

REM Compilation principale
pdflatex -interaction=nonstopmode rapport_projet.tex

REM Compilation pour les references croisees
pdflatex -interaction=nonstopmode rapport_projet.tex

REM Nettoyage des fichiers temporaires
del *.aux *.log *.toc *.lof *.lot *.out *.fdb_latexmk *.fls *.synctex.gz 2>nul

echo.
echo Compilation terminee. Le fichier PDF a ete genere : rapport_projet.pdf
pause
