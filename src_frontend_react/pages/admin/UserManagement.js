import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import "./UserManagement.css";

function UserManagement() {
  const { users, fetchAllUsers, deleteUser, loading } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
    const matchSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "ALL" || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleDeleteUser = async (userId, userName) => {
    try {
      await deleteUser(userId);
      alert(`User "${userName}" deleted successfully`);
      setDeleteConfirm(null);
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-header">
        <h1>User Management</h1>
        <p>Manage all customer and seller accounts</p>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="role-filter"
        >
          <option value="ALL">All Roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="SELLER">Sellers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users">
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={`role-${user.role?.toLowerCase()}`}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {deleteConfirm === user.id ? (
                      <div className="delete-confirm">
                        <span>Confirm delete?</span>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                          className="btn-confirm"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(null)}
                          className="btn-cancel"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeleteConfirm(user.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
