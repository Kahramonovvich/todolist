'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'

export default function WaitPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return;

            const userDocRef = doc(db, 'users', user.uid)

            const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const status = docSnap.data().status;
                    if (status === 'verified') {
                        setCookie('user_status', status);
                        router.push('/dashboard');
                    } else {
                        setChecking(false);
                    };
                } else {
                    setChecking(false);
                };
            });

            return () => unsubscribeSnapshot();
        });

        return () => unsubscribeAuth();
    }, [router]);

    return (
        <div className="wait absolute w-full min-h-screen z-50 bg-black top-0 left-0 flex items-center justify-center">
            <p className="text-2xl text-white animate-pulse">
                {checking ? 'Checking status...' : 'Please wait until admin verifies your account'}
            </p>
        </div>
    );
};