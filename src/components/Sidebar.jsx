"use client";
import Link from "next/link";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useMyContexts } from "@/app/layout";

export default function Sidebar() {

    const router = useRouter();
    const { unverifiedUsers, currentUser } = useMyContexts();

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

    return (
        <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    {[
                        {
                            href: "dashboard",
                            label: "Dashboard",
                            icon: (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "projects",
                            label: "Projects",
                            icon: (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Z" />
                                    <path d="M6.143 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "inbox",
                            label: "Inbox",
                            badge: "3",
                            icon: (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.418 3.623a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "users",
                            label: "Users",
                            icon: (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "unverified",
                            label: "Unverified",
                            badge: unverifiedUsers?.length > 0 && unverifiedUsers?.length,
                            isAdmin: currentUser?.isAdmin,
                            icon: (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "designs",
                            label: "Designs",
                            icon: (
                                <BrushRoundedIcon />
                            ),
                        },
                        {
                            href: "settings",
                            label: "Settings",
                            icon: (
                                <TuneRoundedIcon />
                            ),
                        },
                    ].map(({ href, label, icon, badge, isAdmin }) => (
                        <li key={label} className={`${!isAdmin && href === 'unverified' && 'hidden'}`}>
                            <Link
                                href={href}
                                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group
                                    `}
                            >
                                <span className="text-gray-500 flex dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                    {icon}
                                </span>
                                <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
                                {badge && (
                                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button
                    className={`flex items-center font-medium p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                    onClick={handleUnload}
                >
                    <span className="text-gray-500 flex dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 18 16" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                        </svg>
                    </span>
                    <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                </button>
            </div>
        </aside >
    );
};