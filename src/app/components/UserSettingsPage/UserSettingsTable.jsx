import React from 'react';
import { Pencil, Trash2, User } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No users found</p>
        <p className="text-gray-400 text-sm mt-2">Add users to see them listed here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Picture</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.User_ID} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.User_ID}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.Name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.Email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={user.Profile_Picture || 'https://via.placeholder.com/40'}
                  alt={user.Name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.User_Address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.Status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.Status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user.User_ID)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
