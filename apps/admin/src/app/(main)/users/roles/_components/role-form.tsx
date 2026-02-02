"use client";

import { createRole, updateRole } from "@/actions/roles";
import { useMutation } from "@/hooks/use-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PermissionDto, RoleDto } from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
import { Checkbox } from "@repo/ui/components/ui-kit/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui-kit/field";
import { Input } from "@repo/ui/components/ui-kit/input";
import { Switch } from "@repo/ui/components/ui-kit/switch";
import { cn } from "@repo/ui/lib/utils";
import { Activity, CheckCircle2, Info, LayoutGrid, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissionIds: z
    .array(z.number())
    .min(1, "At least one permission is required"),
  isActive: z.boolean(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: RoleDto;
  permissions: PermissionDto[];
  onOpenChange?: (open: boolean) => void;
}

export function RoleForm({
  initialData,
  permissions,
  onOpenChange,
}: RoleFormProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: (initialData?.name as string) || "",
      description: initialData?.description || "",
      permissionIds: initialData?.permissions.map((p) => p.id) || [],
      isActive: initialData?.isActive ?? true,
    },
  });

  const groupedPermissions = permissions.reduce(
    (acc, p) => {
      const category = p.name.split(":")[1] || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(p);
      return acc;
    },
    {} as Record<string, PermissionDto[]>,
  );

  const { action, isPending } = useMutation(
    initialData?.id ? updateRole : createRole,
    {
      onSuccess() {
        toast.success(
          initialData?.id
            ? "Role updated successfully"
            : "Role created successfully",
        );
        onOpenChange?.(false);
      },

      onError({ error }) {
        if (error?.type === "VALIDATION_ERROR") {
          toast.error("Please fix the validation errors and try again.");
          form.trigger();
          return;
        }

        toast.error(
          initialData?.id ? "Failed to update role" : "Failed to create role",
        );
      },
    },
  );

  const permissionIds = form.watch("permissionIds");
  const isActive = form.watch("isActive");

  return (
    <form className="space-y-8" action={action}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}
        <input
          type="hidden"
          name="isActive"
          value={isActive ? "true" : "false"}
        />
        {permissionIds.length > 0 &&
          permissionIds.map((id) => (
            <input key={id} type="hidden" name="permissionIds" value={id} />
          ))}

        <FieldGroup className="space-y-8">
          {/* Header Section */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="name"
                      className="flex items-center gap-2 text-neutral-700"
                    >
                      <Shield className="text-primary size-4" />
                      Role Name
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="name"
                        placeholder="e.g. Administrator, Editor, Viewer"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="h-11 bg-neutral-50/50 transition-colors focus:bg-white"
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="description"
                      className="flex items-center gap-2 text-neutral-700"
                    >
                      <Info className="text-primary size-4" />
                      Description
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="description"
                        placeholder="Describe what users with this role can do..."
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="h-11 bg-neutral-50/50 transition-colors focus:bg-white"
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
            <div>
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Field className="group/status hover:border-primary/30 hover:shadow-primary/5 h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Activity
                            className={cn(
                              "size-4 transition-colors",
                              field.value ? "text-primary" : "text-neutral-400",
                            )}
                          />
                          <FieldLabel
                            htmlFor="isActive"
                            className="text-base font-bold text-neutral-800"
                          >
                            Active Status
                          </FieldLabel>
                        </div>
                        <span className="max-w-[140px] text-xs leading-relaxed text-neutral-500">
                          Enable this role to make it available for assignment.
                        </span>
                      </div>
                      <Switch
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2">
                      <div
                        className={cn(
                          "size-2 rounded-full",
                          field.value
                            ? "bg-primary animate-pulse"
                            : "bg-neutral-300",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[11px] font-bold tracking-wider uppercase",
                          field.value ? "text-primary" : "text-neutral-500",
                        )}
                      >
                        {field.value
                          ? "Currently Active"
                          : "Currently Inactive"}
                      </span>
                    </div>
                  </Field>
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between border-b pb-3.5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="text-primary size-5" />
                <h3 className="text-lg font-semibold text-neutral-800">
                  Role Permissions
                </h3>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                {form.watch("permissionIds").length} Selected
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {Object.entries(groupedPermissions).map(
                ([category, perms], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
                  >
                    <div className="border-b bg-neutral-50/80 px-4 py-2.5">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-700 capitalize">
                        <div className="bg-primary size-1.5 rounded-full" />
                        {category}
                      </h4>
                    </div>
                    <div className="space-y-1 p-3">
                      {perms.map((p) => (
                        <Controller
                          key={p.id}
                          name="permissionIds"
                          control={form.control}
                          render={({ field }) => {
                            const isChecked = field.value.includes(p.id);
                            return (
                              <label
                                className={cn(
                                  "group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-all outline-none",
                                  isChecked
                                    ? "bg-primary/5 text-primary"
                                    : "text-neutral-600 hover:bg-neutral-50",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, p.id]
                                        : field.value.filter(
                                            (id: number) => id !== p.id,
                                          );
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {p.name.split(":")[0]}
                                    </span>
                                    <AnimatePresence>
                                      {isChecked && (
                                        <motion.span
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{
                                            opacity: 1,
                                            height: "auto",
                                          }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="text-[10px] opacity-80"
                                        >
                                          Permission granted
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                                {isChecked && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  >
                                    <CheckCircle2 className="size-4" />
                                  </motion.div>
                                )}
                              </label>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ),
              )}
            </div>
            <Controller
              name="permissionIds"
              control={form.control}
              render={({ fieldState }) => (
                <FieldError errors={[fieldState.error]} className="mt-2" />
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-8">
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="shadow-primary/20 min-w-[160px] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>
                {isPending
                  ? "Saving Changes..."
                  : initialData
                    ? "Update Role"
                    : "Create Role"}
              </span>
            </Button>
          </div>
        </FieldGroup>
      </motion.div>
    </form>
  );
}
