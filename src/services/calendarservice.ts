import { auth } from "../firebase/firebase";
import { apiFetch } from "./api";

export async function connectGoogleCalendar() {
  console.log("Calendar clicked");
    const uid = auth.currentUser?.uid;
    console.log("UID:", uid);
    if (!uid){
        console.log("User not logged in");
        return;
    }
    console.log("Calling login endpoint");
    const response = await apiFetch(

        `/calendar/login?uid=${uid}`

    );
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log(data);
    window.location.href = data.url;
}


export async function getCalendarStatus(uid: string) {
  const response = await apiFetch(`/calendar/status/${uid}`);
  return response.json();
}

const API = import.meta.env.VITE_API_BASE_URL;

// export function connectGoogleCalendar() {
//   window.location.href =
//     `${API}/calendar/login/${auth.currentUser?.uid}`;
// }