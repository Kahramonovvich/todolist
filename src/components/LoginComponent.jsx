'use client'
import Image from "next/image"
import { auth } from '@/lib/firebase'
import { signInWithPopup, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { jobs } from "@/constants/constants"
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFlip } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-flip';
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { setCookie } from "cookies-next"

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export default function LoginComponent() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [job, setJob] = useState('');
    const [swiper, setSwiper] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loginRef = useRef(null);
    const registerRef = useRef(null);
    const router = useRouter();

    const handleLogin = async (provider) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await signInWithPopup(auth, provider);
            const user = auth.currentUser;
            const token = await user.getIdToken();
            await setCookie('firebase_token', token);
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);
            if (!userSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email || '',
                    firstName: user.displayName?.split(' ')[0] || '',
                    lastName: user.displayName?.split(' ')[1] || '',
                    job: '',
                    isActive: true,
                    status: 'unverified',
                    createdAt: new Date(),
                    isAdmin: false
                });
                await setCookie('user_status', 'unverified');
                router.push('/wait');
            } else {
                await updateDoc(userDocRef, { isActive: true });
                const userData = userSnap.data();
                await setCookie('user_status', userData.status);
                router.push('/dashboard');
            };
        } catch (err) {
            console.error('OAuth error:', err);
        } finally {
            setIsLoading(false);
        };
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            const token = await user.getIdToken();
            await setCookie('firebase_token', token);
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);
            await updateDoc(userDocRef, { isActive: true });
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const status = userData.status;
                await setCookie('user_status', status);
            };
            router.push('/dashboard');
        } catch (err) {
            console.error('Email login error:', err)
        } finally {
            setIsLoading(false);
        };
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email,
                firstName,
                lastName,
                job,
                isActive: true,
                isAdmin: false,
                status: 'unverified',
                createdAt: new Date()
            });
            const token = await auth.currentUser.getIdToken();
            setCookie('firebase_token', token);
            setCookie('user_status', 'unverified');
            router.push('/wait');
            setEmail('');
            setFirstName('');
            setLastName('');
            setPassword('');
        } catch (err) {
            console.error('Ошибка регистрации:', err);
            setIsLoading(false);
        };
    };

    useEffect(() => {
        if (!swiper) return;
        const updateHeight = () => {
            const activeIndex = swiper.activeIndex;
            const activeRef = activeIndex === 0 ? loginRef.current : registerRef.current;
            if (activeRef) {
                const height = activeRef.scrollHeight;
                swiper.el.style.height = height + 'px';
            };
        };

        swiper.on('slideChangeTransitionEnd', updateHeight);

        setTimeout(() => {
            updateHeight();
        }, 50);

        return () => {
            swiper.off('slideChangeTransitionEnd', updateHeight);
        };
    }, [swiper]);


    return (
        <div className="login absolute flex items-center justify-center py-5 top-0 left-0 z-50 w-full min-h-screen bg-fixed bg-[url(/images/office.jpg)] bg-no-repeat bg-cover bg-center">
            <div className="container relative h-full">
                <div className="box w-full h-full flex flex-col items-center justify-center">
                    <div className="logo flex items-center justify-center mb-5">
                        <Image src="https://flowbite.com/docs/images/logo.svg" alt="Logo" width={32} height={32} className="me-3 aspect-square" />
                        <span className="self-center md:text-3xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white leading-none">
                            Flowbite
                        </span>
                    </div>
                    <Swiper
                        effect="flip"
                        allowTouchMove={false}
                        modules={[EffectFlip]}
                        onSwiper={(swiper) => setSwiper(swiper)}
                        className="w-full max-w-[450px] !overflow-hidden transition-all duration-300"
                    >
                        <SwiperSlide>
                            <div ref={loginRef} className="box bg-gray-800 rounded-2xl text-white p-6 md:w-[450px] shadow-2xl backdrop-blur-sm bg-opacity-90">
                                <div className="top text-center">
                                    <h1 className="text-3xl font-bold mb-5">Sign in to your account</h1>
                                </div>

                                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        className="px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition px-4 py-3 rounded-lg text-white font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Sign in with Email'}
                                    </button>
                                </form>

                                <div className="mt-2 text-right text-sm">
                                    <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
                                </div>

                                <div className="mb-5 mt-2 text-center text-sm text-gray-400">or sign in with</div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleLogin(googleProvider)}
                                        className="flex items-center justify-center gap-3 bg-white text-black font-medium rounded-lg px-4 py-3 hover:bg-gray-100 shadow"
                                    >
                                        <FcGoogle size={22} /> Sign in with Google
                                    </button>

                                    <button
                                        onClick={() => handleLogin(githubProvider)}
                                        className="flex items-center justify-center gap-3 bg-black text-white font-medium rounded-lg px-4 py-3 hover:bg-gray-900 shadow"
                                    >
                                        <FaGithub size={22} /> Sign in with GitHub
                                    </button>
                                </div>

                                <div className="mt-6 text-center text-sm text-gray-400">
                                    Don't have an account? <span
                                        className="text-blue-400 hover:underline cursor-pointer"
                                        onClick={() => !isLoading && swiper?.slideNext()}
                                    >
                                        Register
                                    </span>
                                </div>

                                <div className="mt-2 text-center text-xs text-gray-400">
                                    By signing in, you agree to our <span className="underline">terms of use</span>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div ref={registerRef} className="box bg-gray-800 rounded-2xl text-white p-6 md:w-[450px] shadow-2xl backdrop-blur-sm bg-opacity-90">
                                <div className="top text-center">
                                    <h1 className="text-3xl font-bold mb-5">Register</h1>
                                </div>

                                <form onSubmit={handleRegistration} className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        name="firstName"
                                        required
                                        placeholder="Enter first name"
                                        className="px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        name="lastName"
                                        required
                                        placeholder="Enter last name"
                                        className="px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        className="px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="px-4 py-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        name="job"
                                        id="job"
                                        className="rounded-lg px-4 py-3 border border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setJob(e.target.value)}
                                        value={job}
                                        required
                                    >
                                        <option value="">Select your job</option>
                                        {jobs.map((job) => (
                                            <option
                                                key={job.id}
                                                value={job.id}
                                            >
                                                {job.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition px-4 py-3 rounded-lg text-white font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Register'}
                                    </button>
                                </form>

                                <div className="my-5 text-center text-sm text-gray-400">or sign in with</div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleLogin(googleProvider)}
                                        className="flex items-center justify-center gap-3 bg-white text-black font-medium rounded-lg px-4 py-3 hover:bg-gray-100 shadow"
                                    >
                                        <FcGoogle size={22} /> Sign in with Google
                                    </button>

                                    <button
                                        onClick={() => handleLogin(githubProvider)}
                                        className="flex items-center justify-center gap-3 bg-black text-white font-medium rounded-lg px-4 py-3 hover:bg-gray-900 shadow"
                                    >
                                        <FaGithub size={22} /> Sign in with GitHub
                                    </button>
                                </div>

                                <div className="mt-6 text-center text-sm text-gray-400">
                                    Already have an account? <span
                                        className="text-blue-400 hover:underline cursor-pointer"
                                        onClick={() => !isLoading && swiper?.slidePrev()}
                                    >
                                        Sign in
                                    </span>
                                </div>

                                <div className="mt-2 text-center text-xs text-gray-400">
                                    By signing in, you agree to our <span className="underline">terms of use</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    );
};