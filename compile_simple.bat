@echo off
echo Compilation du rapport LaTeX simplifie...
echo.

REM Compilation principale
pdflatex -interaction=nonstopmode rapport_simple.tex

REM Compilation pour les references croisees
pdflatex -interaction=nonstopmode rapport_simple.tex

REM Nettoyage des fichiers temporaires
del *.aux *.log *.toc *.lof *.lot *.out *.fdb_latexmk *.fls *.synctex.gz 2>nul

echo.
echo Compilation terminee. Le fichier PDF a ete genere : rapport_simple.pdf
echo.
echo Pour visualiser le PDF, tapez: start rapport_simple.pdf
pause
