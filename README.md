# Aplikacja Szybkie Notatki (Firebase & Markdown)

W pełni funkcjonalna aplikacja do notatek (CRUD) zbudowana w czystym JavaScript, wykorzystująca **Firebase Firestore** jako bazę danych w czasie rzeczywistym oraz bibliotekę **Marked.js** do renderowania Markdown.

---

### 🛑 Ważna informacja o uruchomieniu

Publiczna wersja na GitHub Pages **nie jest funkcjonalna**.

Kod w tym repozytorium zawiera zastępcze klucze API (np. `YOUR_API_KEY`) ze względów bezpieczeństwa. Aby przetestować projekt, należy go sklonować i uruchomić lokalnie, postępując zgodnie z poniższą instrukcją.

---

## 🚀 Funkcje

* **Pełen CRUD:** Tworzenie, Odczyt, Aktualizacja i Usuwanie notatek.
* **Baza danych w czasie rzeczywistym:** Wykorzystanie **Firebase Firestore** do natychmiastowej synchronizacji danych.
* **Wsparcie dla Markdown:** Notatki są renderowane przy użyciu biblioteki `Marked.js`. Użytkownicy mogą używać składni Markdown (np. `**pogrubienie**`, `*kursywa*`, listy) do formatowania tekstu.
* **Wyszukiwanie/Filtrowanie:** Dynamiczne filtrowanie notatek podczas pisania w polu wyszukiwania.
* **Nowoczesny UI:** Ciemny motyw, responsywny design i modal (okno dialogowe) do edycji i tworzenia.

---

## 🛠️ Użyte Technologie

* **HTML5** (Semantyczny, `<dialog>`)
* **CSS3** (Zmienne CSS, Flexbox, Grid, Dark Mode)
* **JavaScript (ES6+):**
    * Manipulacja DOM
    * Async/Await
    * Obsługa zdarzeń
* **Firebase (Firestore):**
    * Jako back-end NoSQL (BaaS)
    * Operacje CRUD
* **Marked.js:**
    * Do parsowania Markdown po stronie klienta.

---

## 🏁 Uruchomienie lokalne (Setup)

Aby uruchomić ten projekt, musisz skonfigurować własną, darmową bazę danych Firebase.

1.  Sklonuj to repozytorium na swój komputer.
2.  Wejdź na [Firebase](https://console.firebase.google.com/) i stwórz nowy, darmowy projekt.
3.  W swoim projekcie Firebase stwórz nową **Bazę Danych Firestore** (Firestore Database).
4.  Podczas konfiguracji Firestore, w zakładce **"Rules" (Reguły)**, ustaw je na tryb testowy (na czas developmentu):
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true; // UWAGA: Tylko do testów!
        }
      }
    }
    ```
5.  W ustawieniach projektu (`Project Settings`) znajdź i skopiuj swój obiekt konfiguracyjny (`firebaseConfig`).
6.  Otwórz plik `script.js` w sklonowanym repozytorium.
7.  Znajdź obiekt `const firebaseConfig = { ... }` na samej górze pliku i **zastąp go** swoim własnym obiektem skopiowanym z Firebase.
8.  Otwórz plik `index.html` w przeglądarce. Aplikacja połączy się teraz z Twoją bazą danych.