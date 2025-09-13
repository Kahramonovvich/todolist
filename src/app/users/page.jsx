'use client'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Image from "next/image"
import { jobs } from "@/constants/constants"
import { useMyContexts } from '../layout'
import { formatPhone } from '@/utils/utils'

export default function Page() {

    const { users } = useMyContexts();

    return (
        <div className="users">
            <h1 className="text-3xl font-bold text-white mb-6">User Profiles</h1>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {users.map((user) => (
                    <div
                        key={user.uid}
                        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-blue-500 transition duration-300 flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 relative flex items-center justify-center rounded-full overflow-hidden border-4 border-blue-500 shadow-md mb-4">
                            {user.img ? (
                                <Image
                                    fill
                                    src={user.img}
                                    alt={user.firstName || 'User'}
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <AccountCircleIcon className="text-gray-500 w-full h-full" style={{ fontSize: 96 }} />
                            )}
                        </div>

                        <div className="text-white text-xl font-semibold">
                            {user.firstName} {user.lastName || ''}
                        </div>

                        <div className="text-gray-400 text-sm mt-1">{user.email}</div>
                        {user.phoneNumber && <div className="text-gray-400 text-sm">📞 {formatPhone(user.phoneNumber)}</div>}

                        <div className="flex items-center justify-center gap-2 mt-1">
                            {user.telegram && (
                                <a
                                    href={`https://t.me/${user.telegram}`}
                                    className="text-blue-400 hover:underline text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @Telegram
                                </a>
                            )}
                            {user.instagram && (
                                <a
                                    href={`https://instagram.com/${user.instagram}`}
                                    className="text-pink-400 hover:underline text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @Instagram
                                </a>
                            )}
                        </div>

                        <span className="bg-blue-600 mt-3 text-white px-3 py-1 rounded-full text-xs">
                            {jobs.find((job) => job.id === user.job)?.label || "Неизвестно"}
                        </span>

                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {user.status === 'verified' ? (
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">✔ Verified</span>
                            ) : (
                                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">⏳ Pending</span>
                            )}
                            {user.isActive ? (
                                <span className="bg-emerald-700 text-white px-3 py-1 rounded-full text-xs">🟢 Online</span>
                            ) : (
                                <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs">⚫ Offline</span>
                            )}
                        </div>

                        {user.createdAt && (
                            <div className="text-gray-500 text-xs mt-3 italic">
                                With us since {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};