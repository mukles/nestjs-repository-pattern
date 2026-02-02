import { getPermissions, getRoles } from "@/actions/roles";
import { CreateRoleModal } from "./_components/create-role-modal";
import { RoleList } from "./_components/role-list";

export default async function RolesPage() {
  const [rolesResult, permissionsResult] = await Promise.all([
    getRoles(),
    getPermissions(),
  ]);

  if (!rolesResult.success || !permissionsResult.success) {
    const errorMsg =
      (!rolesResult.success ? rolesResult.error?.message : "") ||
      (!permissionsResult.success ? permissionsResult.error?.message : "") ||
      "Failed to load roles or permissions.";

    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-destructive text-xl font-semibold">Error</h2>
          <p className="text-muted-foreground">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Roles & Permissions
            </h2>
            <p className="text-muted-foreground">
              Manage system roles and their associated permissions.
            </p>
          </div>
          <CreateRoleModal permissions={permissionsResult.data!} />
        </div>
      </div>
      <div className="mt-8 flex-1">
        <RoleList
          roles={rolesResult.data!}
          permissions={permissionsResult.data!}
        />
      </div>
    </div>
  );
}
