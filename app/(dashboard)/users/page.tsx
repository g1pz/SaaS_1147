import UsersTable from "@/components/tables/UsersTable"

export default function UsersPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and search through registered users</p>
      </div>
      <UsersTable />
    </div>
  )
}
