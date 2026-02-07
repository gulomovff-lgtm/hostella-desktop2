import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAoVj92dmnl5gBB7zYul0iG2Ekp5cbmkp0",
  authDomain: "hostella-app-a1e07.firebaseapp.com",
  projectId: "hostella-app-a1e07",
  storageBucket: "hostella-app-a1e07.firebasestorage.app",
  messagingSenderId: "826787873496",
  appId: "1:826787873496:web:51a0c6e42631a28919cdad"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, "hostella");

export const APP_ID = 'hostella-multi-v4';
export const PUBLIC_DATA_PATH = ['artifacts', APP_ID, 'public', 'data'];
