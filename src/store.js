import { BehaviorSubject } from "rxjs";

// skapa en store för tokens
export const token$ =
    new BehaviorSubject(window.localStorage.getItem('token') || null);
// då token sparas och laddas från localStorage

export function updateToken(newToken) {

    if (!newToken) { // om är null
        window.localStorage.removeItem('token'); // udvika auto logain igen
    } else {
        //  uppdatera token när användaren loggar in
        window.localStorage.setItem('token', newToken);
    }

    //  uppdatera tokens värde
    token$.next(newToken);
}