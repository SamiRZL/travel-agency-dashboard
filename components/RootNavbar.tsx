import { Link, useLoaderData, useLocation, useParams } from "react-router"
import { logoutUser } from "~/appwrite/auth";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";

const RootNavbar = () => {
    const user = useLoaderData();
    console.log("image user in navbar", user.imageUrl)
    const location = useLocation()
    const params = useParams();
    const navigate = useNavigate()
    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in')
    }

    const [isOutOfHero, setIsOutOfHero] = useState(false);

    useEffect(() => {
        if (location.pathname !== "/") return; // Only apply on the home page

        const heroSection = document.querySelector("#hero-section");
        if (!heroSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // If hero is not intersecting, navbar is out of it
                setIsOutOfHero(!entry.isIntersecting);
            },
            { threshold: 0.1 } // Adjust sensitivity
        );

        observer.observe(heroSection);

        return () => observer.disconnect();
    }, [location.pathname]);


    return (
        <div className="">
            <nav className={cn(location.pathname === `/travel/${params.tripId}` ? 'bg-white' : 'glassmorphism', 'hidden  z-99  !fixed !w-full lg:flex !items-center !justify-between px-[5rem] ')}>
                <Link to='/' className="link-logo !py-7 !border-none">
                    <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                    <h1>Tourvisto</h1>
                </Link>
                <div className="flex gap-7 !items-center">
                    <Link to='/dashboard' className={cn('text-base font-normal transition-colors duration-300', isOutOfHero ? 'text-black' : 'text-white', { "text-dark-100": location.pathname.startsWith('/travel') })}>
                        <figure className="flex gap-3 items-center">
                            <figcaption className="font-semibold">
                                Admin Panel
                            </figcaption>
                            <img referrerPolicy="no-referrer"
                                src={user?.imageUrl} alt="user photo" className="rounded-full size-8 aspect-ratio" />
                        </figure>
                    </Link>
                    <button onClick={handleLogout} className="cursor-pointer bg-white bg:opacity-50 z-4 py-2 pr-3 pl-2 rounded-full">
                        <img src="/assets/icons/logout.svg" alt="logout" className="size-6 z-5 text-blue-500" />
                    </button>
                </div>
            </nav>

        </div>
    )
}

export default RootNavbar