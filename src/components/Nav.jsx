"use client";
import { auth, db } from "@/lib/firebase";
import { deleteCookie } from "cookies-next";
import { doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useMyContexts } from "@/app/layout";

export default function Navbar() {

    const {currentUser} = useMyContexts();

    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const router = useRouter();

    const handleUnload = async () => {
        const user = auth.currentUser
        if (user) {
            deleteCookie('firebase_token');
            deleteCookie('user_status');
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, { isActive: false });
            } catch (err) {
                console.error('Failed to update isActive:', err);
            };
            try {
                await auth.signOut();
            } catch (err) {
                console.warn('signOut error:', err);
            };
            router.push('/');
        };
    };

    useEffect(() => {
        setUserDropdownOpen(false);
    }, []);

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                />
                            </svg>
                        </button>
                        <Link href="/dashboard" className="flex ms-2 md:me-24">
                            <Image src="https://flowbite.com/docs/images/logo.svg" alt="Logo" width={32} height={32} className="me-3" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                Flowbite
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="relative ms-3">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open user menu</span>
                                {currentUser?.img ? (
                                    <Image
                                        className="w-8 h-8 rounded-full"
                                        src={currentUser.img}
                                        alt={currentUser.firstName || 'User'}
                                        width={32}
                                        height={32}
                                    />
                                ) : (
                                    <AccountCircleIcon className="text-gray-500 w-full h-full" style={{ fontSize: 32 }} />
                                )}
                            </button>
                            {userDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <div className="px-4 py-3">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {currentUser?.firstName} {currentUser?.lastName}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                                            {currentUser?.email}
                                        </p>
                                    </div>
                                    <ul className="py-1">
                                        <li>
                                            <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                                Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/my-tasks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                                My Tasks
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                                onClick={handleUnload}
                                            >
                                                Sign out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};