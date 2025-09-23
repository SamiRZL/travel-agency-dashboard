
import { SidebarComponent } from "@syncfusion/ej2-react-navigations"
import { Link } from "react-router"
import NavItems from "./NavItems"
import { useRef } from "react"
const MobileSidebar = () => {
    const sidebar = useRef<SidebarComponent | null>(null)
    const toggleSidebar = () => {
        console.log("here is the sidebar", sidebar)
        sidebar.current?.toggle()
    }
    const hideSidebar = () => {
        sidebar.current?.hide()
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
                <NavItems handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    )
}

export default MobileSidebar