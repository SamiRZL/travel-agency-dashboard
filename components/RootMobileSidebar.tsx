
import { SidebarComponent } from "@syncfusion/ej2-react-navigations"
import { Link, NavLink, useNavigate } from "react-router"
import { useRef } from "react"
import { logoutUser } from "~/appwrite/auth"
const RootMobileSidebar = () => {

    const sidebar = useRef<SidebarComponent | null>(null)
    const toggleSidebar = () => {
        console.log("here is the sidebar", sidebar)
        sidebar.current?.toggle()
    }
    const hideSidebar = () => {
        sidebar.current?.hide()
    }
    const navigate = useNavigate()
    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in')
    }
    return (
        <div className="mobile-sidebar wrapper">
            <header className="">
                <Link to='/' className="link-logo">
                    <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                    <h1>Tourvisto</h1>
                </Link>
                {/* @ts-ignore */}
                <button onClick={toggleSidebar}></button>
                <img onClick={toggleSidebar} src="/assets/icons/menu.svg" alt="menu" className="size-7" />
            </header>
            <SidebarComponent
                //@ts-ignore
                width={270}
                // @ts-ignore 
                ref={sidebar}
                created={hideSidebar}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="over"
            >
                <section className="nav-items">
                    <Link to='/' className="link-logo">
                        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                        <h1>Tourvisto</h1>
                    </Link>
                    <div className="container">
                        <nav>
                            <NavLink to='/dashboard' >
                                <div className='group nav-item'>
                                    Admin Panel
                                </div>
                            </NavLink>
                            <NavLink to='/' >
                                <div className='group nav-item'>
                                    Logout
                                    <button onClick={handleLogout} className="cursor-pointer">
                                        <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
                                    </button>
                                </div>
                            </NavLink>


                        </nav>

                    </div>
                </section>
            </SidebarComponent>

        </div>
    )
}

export default RootMobileSidebar