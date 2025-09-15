'use client'
import './globals.css';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Nav";
import NextTopLoader from "nextjs-toploader";
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingModal from '@/components/LoadingModal';

const NewContext = createContext();

export const useMyContexts = () => useContext(NewContext);

export default function RootLayout({ children }) {

  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser({ ...docSnap.data() });
          };
        });

        return () => unsubscribeDoc();
      };
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ ...doc.data() }));
      const unverified = users.filter(u => u.status !== 'verified');
      setUsers(users);
      setUnverifiedUsers(unverified);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        <NextTopLoader
          color="#fff"
          height={3}
          showSpinner={false}
        />
        <NewContext.Provider value={{
          users,
          unverifiedUsers,
          currentUser,
          isLoading,
          setIsLoading,
        }}>
          <LoadingModal />
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 mt-14 sm:ml-64">{children}</main>
          </div>
        </NewContext.Provider>
      </body>
    </html>
  );
};