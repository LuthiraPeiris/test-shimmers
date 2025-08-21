import React, { useState, useEffect } from 'react';

const UserSettingsForm = ({ setting, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    type: 'profile',
    description: '',
    isEnabled: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (setting) {
      setFormData({
        name: setting.name || '',
        value: setting.value || '',
        type: setting.type || 'profile',
        description: setting.description || '',
        isEnabled: setting.isEnabled !== undefined ? setting.isEnabled : true,
      });
    }
  }, [setting]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Setting name is required';
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'Setting value is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Setting type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving setting:', error);
    } finally {
      setLoading(false);
    }
  };

  const settingTypes = [
    { value: 'profile', label: 'Profile' },
    { value: 'notification', label: 'Notification' },
    { value: 'privacy', label: 'Privacy' },
    { value: 'security', label: 'Security' },
    { value: 'preference', label: 'Preference' },
    { value: 'system', label: 'System' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Setting Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Email Notifications"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
          Setting Value *
        </label>
        <input
          type="text"
          id="value"
          name="value"
          value={formData.value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.value ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., enabled"
        />
        {errors.value && (
          <p className="mt-1 text-sm text-red-600">{errors.value}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Setting Type *
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {settingTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Brief description of this setting..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isEnabled"
          name="isEnabled"
          checked={formData.isEnabled}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-900">
          Enable this setting
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : setting ? 'Update Setting' : 'Create Setting'}
        </button>
      </div>
    </form>
  );
};

export default UserSettingsForm;
