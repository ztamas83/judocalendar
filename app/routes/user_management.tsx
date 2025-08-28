// import React, { useEffect, useState } from "react";

// function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/users") // Adjust endpoint as needed
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data);
//         setLoading(false);
//       });
//   }, []);

//   const handleRoleChange = (userId, newRole) => {
//     fetch(`/api/users/${userId}/role`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ role: newRole }),
//     }).then(() => {
//       setUsers(
//         users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
//       );
//     });
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>User Role Management</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>User</th>
//             <th>Role</th>
//             <th>Change Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.username}</td>
//               <td>{user.role}</td>
//               <td>
//                 <select
//                   value={user.role}
//                   onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="moderator">Moderator</option>
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AdminUserRoles;
