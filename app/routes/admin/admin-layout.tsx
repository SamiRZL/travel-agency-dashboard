import { Outlet, redirect } from "react-router"
import { NavItems, MobileSidebar } from "components"
import { SidebarComponent } from "@syncfusion/ej2-react-navigations"
import { account } from "~/appwrite/client"
import { getExistingUser, storeUserData, getGooglePicture } from "~/appwrite/auth"
export async function clientLoader() {
    try {

        const user = await account.get()
        if (!user.$id) return redirect('/sign-in')
        const existingUser = await getExistingUser(user.$id)
        if (existingUser?.status === 'user') {
            return redirect('/')
        }
        return existingUser?.accountId ? existingUser : await storeUserData()
    } catch (e) {
        console.error(e)
        return redirect('/sign-in')
    }
}
const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <MobileSidebar />
            <aside className="w-full max-w-[270px] hidden lg:block">
                <SidebarComponent width={270} enableGestures={false}>
                    <NavItems />
                </SidebarComponent>
            </aside>
            <aside className="children"><Outlet /></aside>
        </div>
    )
}

export default AdminLayout