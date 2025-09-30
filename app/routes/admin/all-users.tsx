import { Header } from "components"
import { GridComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-grids"
import { cn } from "~/lib/utils"
import { getAllUsers } from "~/appwrite/auth"
import type { Route } from "./+types/all-users"
import { formatDate } from "~/lib/utils"



export const clientLoader = async () => {
    const result = await getAllUsers(10, 0)
    const { rows: users, total } = result
    return { users, total }
}

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
    const { users } = loaderData
    return (
        <main className="all-users wrapper">
            <Header
                title={'Manage Users'}
                description={'Filter, sort and access detailed user profiles'}
            />
            <GridComponent gridLines="None" dataSource={users}>
                <ColumnsDirective>
                    <ColumnDirective template={(props: UserData) => (
                        <div className="flex items-center gap-1.5 px-4">
                            <img src={props?.imageUrl ? props.imageUrl : '/assets/images/david.webp'} alt="user" className="rounded-full size-8 aspect-ratio" />
                            <span className="">{props.name}</span>
                        </div>
                    )} field="name" headerText="Name" width="200" textAlign="Left" />
                    <ColumnDirective field="email" headerText="Email" width="200" textAlign="Left" />
                    <ColumnDirective field="$createdAt" template={({ $createdAt }: { $createdAt: string }) => formatDate($createdAt)} headerText="Date Joined" width="120" textAlign="Left" />
                    <ColumnDirective field="status" headerText="Type" width="140" textAlign="Left" template={(props: UserData) => (
                        <article className={cn('status-column', props.status === 'admin' ? 'bg-success-50' : 'bg-light-300')}>
                            <div className={cn('size-1.5 rounded-full', props.status === 'user' ? 'bg-success-500' : 'bg-gray-500')} />
                            <h3 className={cn('font-inter text-xs font-medium', props.status === 'user' ? 'text-success-700' : 'text-gray-500')}>{props.status}</h3>
                        </article>
                    )} />
                </ColumnsDirective>
            </GridComponent>
        </main>
    )
}

export default AllUsers