'use client'
import { useMyContexts } from "../layout"
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { formatPhone } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    const { unverifiedUsers, currentUser } = useMyContexts();

    if (!currentUser?.isAdmin) {
        router.push('/');
    };

    const handleApprove = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { status: 'verified' });
        } catch (err) {
            console.error('Ошибка подтверждения:', err);
        };
    };

    return (
        <div className="unverified">
            <h1 className="text-2xl text-white font-bold mb-4">Unverified Users</h1>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {unverifiedUsers.map((user) => (
                    <div
                        key={user.uid}
                        className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700 text-white flex flex-col gap-2"
                    >
                        <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        {user.phoneNumber && <p className="text-sm text-gray-400">{formatPhone(user.phoneNumber)}</p>}
                        <button
                            onClick={() => handleApprove(user.uid)}
                            className="mt-3 bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white text-sm font-medium"
                        >
                            Approve
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};