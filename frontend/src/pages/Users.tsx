import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { 
  Button, 
  Modal, 
  ConfirmationModal
} from '../components/common';
import { DataTable } from '../components/lists';
import { Input } from '../components/forms';
import { UserService } from '../services/userService';
import { useToastContext } from '../hooks/useToastContext';
import { useDataRefresh } from '../hooks/useDataRefresh';
import type { User, CreateUserRequest, TableColumn } from '../types';

/**
 * Professional Users Management Page
 * Full CRUD operations with professional UI
 */
export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    username: '',
    email: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToastContext();
  const { triggerRefresh, refreshTrigger } = useDataRefresh();

  // Load users data
  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
    });
    setFormErrors({});
    setSelectedUser(null);
  };

  // Handle add user
  const handleAddUser = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const newUser = await UserService.createUser(formData);
      setUsers(prev => [newUser, ...prev]);
      toast.success('User added successfully');
      setIsAddModalOpen(false);
      resetForm();
      triggerRefresh(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error('Error adding user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
    });
    setIsEditModalOpen(true);
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!selectedUser || !validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const updatedUser = await UserService.updateUser(selectedUser.id, formData);
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, ...updatedUser } : user
      ));
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      triggerRefresh(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Error updating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await UserService.deleteUser(selectedUser.id);
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      triggerRefresh(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Error deleting user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table columns configuration
  const columns: TableColumn<User>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-secondary-900">{String(value)}</span>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      render: (value) => (
        <span className="text-primary-600">@{String(value)}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (value) => (
        <span className="text-secondary-700">{String(value)}</span>
      ),
    },
  ];

  // Form handlers - stable callbacks
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, username: e.target.value }));
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
  }, []);

  // Render the form directly in JSX
  const renderUserForm = (title: string, onSubmit: () => void) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          key="user-name-input"
          label="Full Name *"
          value={formData.name}
          onChange={handleNameChange}
          error={formErrors.name}
          placeholder="John Doe"
          fullWidth
        />
        
        <Input
          key="user-username-input"
          label="Username *"
          value={formData.username}
          onChange={handleUsernameChange}
          error={formErrors.username}
          placeholder="johndoe"
          fullWidth
        />
      </div>
      
      <Input
        key="user-email-input"
        label="Email *"
        type="email"
        value={formData.email}
        onChange={handleEmailChange}
        error={formErrors.email}
        placeholder="john@example.com"
        fullWidth
      />
      
      <div className="sticky bottom-0 bg-white flex justify-end space-x-3 pt-4 pb-2 border-t border-gray-200 mt-6 -mx-6 px-6">
        <Button
          variant="secondary"
          onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : title}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            User Management
          </h1>
          <p className="text-secondary-600 mt-1">
            View and manage system users
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New User
          </Button>
        </div>
      </div>

      {/* Users Data Table */}
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="No users found yet"
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New User"
        size="large"
      >
        {renderUserForm("Add User", handleAddUser)}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit User"
        size="large"
      >
        {renderUserForm("Update", handleUpdateUser)}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isSubmitting}
      />
    </div>
  );
}