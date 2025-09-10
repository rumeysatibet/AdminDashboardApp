import { useState, useCallback, memo, useMemo } from 'react';
import { Input } from './Input';
import { Button } from '../common';
import type { CreateUserRequest } from '../../types';

interface QuickUserFormProps {
  onSubmit: (data: CreateUserRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const QuickUserFormComponent = ({ onSubmit, onCancel, isSubmitting }: QuickUserFormProps) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    username: '',
    email: '',
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (formData.name.trim() && formData.username.trim() && formData.email.trim()) {
      onSubmit(formData);
    }
  }, [formData, onSubmit]);

  const isValid = useMemo(() => 
    formData.name.trim() && formData.username.trim() && formData.email.trim(),
    [formData.name, formData.username, formData.email]
  );

  return (
    <div className="space-y-4">
      <Input
        key="name-input"
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter user's full name"
        autoFocus={true}
        required
      />
      <Input
        key="username-input"
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Enter unique username"
        required
      />
      <Input
        key="email-input"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="valid@email.com"
        required
      />
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Adding...' : 'Add User'}
        </Button>
      </div>
    </div>
  );
};

export const QuickUserForm = memo(QuickUserFormComponent);