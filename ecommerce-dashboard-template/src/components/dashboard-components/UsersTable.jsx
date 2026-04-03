import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAdmin, updateUserRoleAdmin, fetchAllUsers } from "../../store/slices/adminSlice";

const UsersTable = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin || {});
  const { user: currentUser } = useSelector((state) => state.auth || {});

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading users...</p>;
  }

  if (!users || users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>;
  }

  const handleRoleToggle = async (targetUser) => {
    const userId = targetUser.id || targetUser._id;
    const newRole = targetUser.role === "Admin" ? "User" : "Admin";
    try {
      await dispatch(updateUserRoleAdmin({ userId, role: newRole })).unwrap();
      dispatch(fetchAllUsers());
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (targetUser) => {
    const userId = targetUser.id || targetUser._id;
    if (currentUser && currentUser.id === userId) {
      return;
    }
    if (!window.confirm(`Delete user ${targetUser.email}?`)) {
      return;
    }
    try {
      await dispatch(deleteUserAdmin(userId)).unwrap();
      dispatch(fetchAllUsers());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-card p-4 rounded-xl shadow-md mt-4">
      <h3 className="text-lg font-semibold text-card-foreground mb-3">Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Joined</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userId = user.id || user._id;
              const isCurrent = currentUser && currentUser.id === userId;
              const toggleLabel = user.role === "Admin" ? "Demote" : "Promote";

              return (
                <tr key={userId} className="border-b border-gray-100">
                  <td className="px-3 py-2">{user.name || "-"}</td>
                  <td className="px-3 py-2">{user.email || "-"}</td>
                  <td className="px-3 py-2">{user.role || "-"}</td>
                  <td className="px-3 py-2">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => handleRoleToggle(user)}
                      disabled={isCurrent || loading}
                      className="px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-80 disabled:opacity-50"
                    >
                      {toggleLabel}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={isCurrent || loading}
                      className="px-2 py-1 rounded bg-destructive text-destructive-foreground hover:opacity-80 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
