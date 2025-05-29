import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/cloud-services';

export interface User {
  id: string;
  email: string;
  displayName: string;
  reputation: number;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private auth = getAuth();

  async register(email: string, password: string, displayName: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const { user } = userCredential;

    const userData: User = {
      id: user.uid,
      email: user.email!,
      displayName,
      reputation: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  }

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const { user } = userCredential;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as User;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;

    return userDoc.data() as User;
  }

  async updateUserReputation(userId: string, newReputation: number) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      reputation: newReputation,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
}

export const authService = new AuthService(); 