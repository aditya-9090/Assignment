import { useAuth } from "../Context/AuthContext";

export function usePermission(action) {
  const { user } = useAuth();

  const permissions = {
    admin: ["view", "edit", "delete", "add"],
    student: ["view"],
  };

  if (!user?.role) return false;
  return permissions[user.role]?.includes(action);
}
