import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAdXiJoOICOA3yvR7iDHLEMvRICkz7M2S0',
	authDomain: 'lancie-web.firebaseapp.com',
	projectId: 'lancie-web',
	storageBucket: 'lancie-web.appspot.com',
	messagingSenderId: '947335385519',
	appId: '1:947335385519:web:463cf8c1eabed222b89f5a',
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
