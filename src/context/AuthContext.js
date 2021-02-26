import {createContext,useState,useEffect} from 'react';
import {auth} from '../firebaseConfig';

export const AuthContext = createContext();

const AuthContextProvider =({children})=>{
    const [currentUser,seUser]=useState(null);
    const [loading,setLoading] = useState(true);
    function signup(email,password){
        return auth.createUserWithEmailAndPassword(email,password)
    }
    function signin(email,password){
        return auth.signInWithEmailAndPassword(email,password);
    }

    function signout(){
        return auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email){
        return currentUser.updateEmail(email);
    }

    function updatePassword(password){
        return currentUser.updatePassword(password);
    }

    useEffect(()=>{
        const unsub=auth.onAuthStateChanged(user=>{
            seUser(user);
            setLoading(false);
        });

        return unsub
    },[])

    const value = {
        signup,signin,signout,resetPassword,updateEmail,updatePassword,currentUser
    }
    return (
        <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    )  
}

export default AuthContextProvider