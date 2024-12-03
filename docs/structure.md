# Project Folder Structure

api/

-   app.py
-   config.py
-   database/
    -   **init**.py
    -   firestore.py
    -   reservations.py
-   exceptions.py
-   routes/
    -   **init**.py
    -   authenticate.py
    -   edit_parking.py
    -   reservations.py
-   typedef.py
-   wrappers.py

src/

-   App.jsx
-   assets/
    -   campus-map.png
    -   parking_bg.jpg
    -   vite.svg
-   components/
    -   AuthContext.jsx
    -   CampusMap.jsx
    -   Components.jsx
    -   CreateReservation.jsx
    -   FutureDateTimePicker.jsx
    -   NavBar.jsx
    -   PrivateRoute.jsx
    -   ReservationsList.jsx
    -   RightSide.jsx
    -   ThemeProvider.tsx
    -   TimeGrid.jsx
    -   date-picker.jsx
    -   time-picker.jsx
    -   ui/
        -   alert.tsx
        -   button.tsx
        -   calendar.tsx
        -   card.tsx
        -   checkbox.tsx
        -   datetimepicker.tsx
        -   dropdown-menu.tsx
        -   icons.tsx
        -   input.tsx
        -   label.tsx
        -   mode-toggle.tsx
        -   popover.tsx
        -   scroll-area.tsx
        -   select.tsx
        -   skeleton.tsx
        -   time-picker/
            -   date-segment.jsx
            -   time-field.jsx
            -   time-picker.jsx
    -   useReservations.jsx
-   hooks/
    -   use-toast.ts
-   lib/
    -   utils.ts
-   main.jsx
-   pages/
    -   AuthenticationPages.jsx
    -   DashboardPage.jsx
    -   LandingPage.jsx
    -   SigninPage.jsx
    -   SignupPage.jsx
-   scripts/
    -   api.js
    -   auth.js
    -   firebaseConfig.js
    -   types.js
    -   utils.js
-   styles/
    -   example.css
    -   index.css

tests/

-   api.test.js
-   auth.test.js
-   setup.js

Config files are in root
