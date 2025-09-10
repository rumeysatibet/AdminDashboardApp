import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { 
  Button, 
  Modal, 
  ConfirmationModal
} from '../components/common';
import { DataTable } from '../components/lists';
import { Input, TextArea, Select } from '../components/forms';
import { PostService } from '../services/postService';
import { UserService } from '../services/userService';
import { useToastContext } from '../hooks/useToastContext';
import { useDataRefresh } from '../hooks/useDataRefresh';
import type { Post, User, CreatePostRequest, TableColumn } from '../types';
import type { SelectOption } from '../components/forms';

/**
 * Professional Posts Management Page
 * Full CRUD operations with user relationship
 */
export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreatePostRequest>({
    userId: 0,
    title: '',
    body: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToastContext();
  const { triggerRefresh, refreshTrigger } = useDataRefresh();

  // Load posts and users data
  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData] = await Promise.all([
        PostService.getAllPosts(),
        UserService.getAllUsers(),
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get user name by ID
  const getUserName = (userId: number): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User #${userId}`;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.userId || formData.userId <= 0) {
      errors.userId = 'User selection is required';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.body.trim()) {
      errors.body = 'Content is required';
    } else if (formData.body.length < 10) {
      errors.body = 'Content must be at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userId: 0,
      title: '',
      body: '',
    });
    setFormErrors({});
    setSelectedPost(null);
  };

  // Handle add post
  const handleAddPost = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const newPost = await PostService.createPost(formData);
      setPosts(prev => [newPost, ...prev]);
      toast.success('Post added successfully');
      setIsAddModalOpen(false);
      resetForm();
      triggerRefresh(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Error adding post:', err);
      toast.error('Error adding post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit post
  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      userId: post.userId,
      title: post.title,
      body: post.body,
    });
    setIsEditModalOpen(true);
  };

  // Handle update post
  const handleUpdatePost = async () => {
    if (!selectedPost || !validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const updatedPost = await PostService.updatePost(selectedPost.id, formData);
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id ? { ...post, ...updatedPost } : post
      ));
      toast.success('Post updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      triggerRefresh(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error('Error updating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view post
  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  // Handle delete post
  const handleDeletePost = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete post
  const confirmDeletePost = async () => {
    if (!selectedPost) return;
    
    try {
      setIsSubmitting(true);
      await PostService.deletePost(selectedPost.id);
      setPosts(prev => prev.filter(post => post.id !== selectedPost.id));
      toast.success('Post deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
      triggerRefresh(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Error deleting post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // User options for select
  const userOptions: SelectOption[] = users.map(user => ({
    value: user.id,
    label: `${user.name} (@${user.username})`,
  }));

  // Table columns configuration
  const columns: TableColumn<Post>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-secondary-900 line-clamp-2">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'userId',
      header: 'Author',
      sortable: true,
      render: (value) => (
        <span className="text-primary-600">
          {getUserName(Number(value))}
        </span>
      ),
    },
  ];

  // Form handlers - stable callbacks
  const handleUserIdChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, userId: Number(e.target.value) }));
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleBodyChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, body: e.target.value }));
  }, []);

  // Render the form content only
  const renderFormContent = () => (
    <div className="space-y-4">
      <Select
        key="post-user-select"
        label="Author *"
        value={formData.userId || ''}
        onChange={handleUserIdChange}
        options={userOptions}
        placeholder="Select user"
        error={formErrors.userId}
        fullWidth
      />
      
      <Input
        key="post-title-input"
        label="Title *"
        value={formData.title}
        onChange={handleTitleChange}
        error={formErrors.title}
        placeholder="Enter post title"
        fullWidth
      />
      
      <TextArea
        key="post-body-textarea"
        label="Content *"
        value={formData.body}
        onChange={handleBodyChange}
        error={formErrors.body}
        placeholder="Enter post content..."
        rows={4}
        fullWidth
      />
    </div>
  );

  // Render footer buttons
  const renderFormFooter = (title: string, onSubmit: () => void) => (
    <>
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
    </>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Post Management
          </h1>
          <p className="text-secondary-600 mt-1">
            View and manage system posts
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Posts Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-primary-600">
              {posts.length}
            </p>
            <p className="text-sm text-secondary-600">Total Posts</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-success-600">
              {users.length}
            </p>
            <p className="text-sm text-secondary-600">Active Authors</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-warning-600">
              {users.length > 0 ? Math.round(posts.length / users.length) : 0}
            </p>
            <p className="text-sm text-secondary-600">Average/Author</p>
          </div>
        </div>
      </div>

      {/* Posts Data Table */}
      <DataTable
        data={posts}
        columns={columns}
        loading={loading}
        emptyMessage="No posts found yet"
        onView={handleViewPost}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />

      {/* Add Post Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Post"
        size="large"
        footer={renderFormFooter("Add Post", handleAddPost)}
      >
        {renderFormContent()}
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Post"
        size="large"
        footer={renderFormFooter("Update", handleUpdatePost)}
      >
        {renderFormContent()}
      </Modal>

      {/* View Post Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPost(null);
        }}
        title="Post Details"
        size="large"
      >
        {selectedPost && (
          <div className="space-y-4">
            <div>
              <label className="form-label">Author</label>
              <p className="text-primary-600 font-medium">
                {getUserName(selectedPost.userId)}
              </p>
            </div>
            
            <div>
              <label className="form-label">Title</label>
              <h3 className="text-lg font-semibold text-secondary-900">
                {selectedPost.title}
              </h3>
            </div>
            
            <div>
              <label className="form-label">Content</label>
              <div className="prose prose-sm max-w-none">
                <p className="text-secondary-700 leading-relaxed">
                  {selectedPost.body}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => handleEditPost(selectedPost)}
              >
                Edit
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message={`Are you sure you want to delete post "${selectedPost?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isSubmitting}
      />
    </div>
  );
}