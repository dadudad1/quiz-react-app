# Quiz Biologie - Aplicație React

O aplicație React pentru testarea și învățarea cunoștințelor de biologie.

## Instalare

Pentru a rula aplicația local, urmați acești pași:

1. Clonați acest repository
2. Instalați dependințele folosind:
```
npm install
```
3. Copiați fișierul `intrebari_raspunsuri_direct.json` în folderul `public` și redenumiți-l în `questions.json`
4. Porniți aplicația în mod de dezvoltare:
```
npm start
```

## Funcționalități

- Încărcarea dinamică a întrebărilor din fișierul JSON
- Afișarea întrebărilor în mod aleatoriu sau secvențial
- Posibilitatea de a marca întrebări favorite
- Căutare în baza de întrebări
- Răspunsuri cu selecție multiplă
- Verificare automată a răspunsurilor
- Statistici privind performanța

## Tehnologii utilizate

- React 18
- React Hooks (useState, useEffect)
- CSS pentru stilizare

## Structura proiectului

- `components/` - Componentele React
  - `QuizContainer.js` - Containerul principal al quiz-ului
  - `QuestionDisplay.js` - Componenta pentru afișarea întrebărilor
  - `Statistics.js` - Componenta pentru statistici
  - `LoadingOverlay.js` - Componenta pentru afișarea stării de încărcare
- `styles/` - Fișierele CSS pentru componente
- `App.js` - Componenta principală a aplicației
- `index.js` - Punctul de intrare al aplicației

## Utilizare

După pornirea aplicației, utilizatorul poate:

1. Selecta modul de afișare a întrebărilor (aleatoriu, secvențial, favorite, căutare)
2. Marca întrebări favorite pentru revizuire ulterioară
3. Căuta întrebări după conținut
4. Selecta multiple variante de răspuns (A, B, C, D, E)
5. Verifica răspunsurile și primi feedback imediat
6. Vizualiza statistici despre performanță 