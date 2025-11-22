#!/bin/bash

pdflatex main.tex && biber main && pdflatex main.tex && pdflatex main.tex

rm -f *.aux *.log *.bcf *.blg *.bbl *.run.xml

echo -e "\n\n¡Compilación finalizada! El archivo PDF main.pdf ¡se ha generado con éxito!\n"

mv main.pdf docs/taller_de_integración_hito_N.pdf

echo -e "El archivo se encuentra alojado en docs como: taller_de_integración_hito_N.pdf\n"