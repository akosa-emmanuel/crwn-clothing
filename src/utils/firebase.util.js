import { initializeApp } from "firebase/app";
import { 
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { 
    getFirestore,
    doc,
    getDoc,
    setDoc 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSnW9D_tJ6O7f9CjrRRYJcAHKfEvTqPh4",
  authDomain: "crwn-clothing-db-90204.firebaseapp.com",
  projectId: "crwn-clothing-db-90204",
  storageBucket: "crwn-clothing-db-90204.firebasestorage.app",
  messagingSenderId: "347270817552",
  appId: "1:347270817552:web:a02c8f1da279b2fc1ee795"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

//force user users to select and account with the provider - specific to google
googleProvider.setCustomParameters({
    prompt : "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth,googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth,googleProvider)

export const db = getFirestore();

export const createUserDocumentFromAuth = async(userAuth, additionalInformation={})=>{
    if(!userAuth) return
   const userDocRef = doc(db, 'users', userAuth.uid);
//    console.log(userDocRef); 
   const userSnapshot = await getDoc(userDocRef);
//    console.log(userSnapshot);
//    console.log(userSnapshot.exists());

   if(!userSnapshot.exists()){
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try{
            await setDoc(userDocRef,{
                displayName,
                email,
                createdAt,
                ...additionalInformation
            })
        }catch(error){
            console.log("error creating the user",error.message)
        }

   }

   return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password)=>{
    if(!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthUserWithEmailAndPassword = async (email, password)=>{
    if(!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async() => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback)