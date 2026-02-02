import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { useNavigate } from 'react-router-dom';
import { GroupCreationForm as FormData } from '../../types';

const schema = z.object({
  groupName: z.string().min(3, 'Group name must be at least 3 characters'),
  membersList: z.string().min(10, 'Please provide a detailed members list'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  department: z.string().min(2, 'Department is required')
});

const GroupCreationForm: React.FC = () => {
  const { user } = useAuth();
  const { addRequest } = useRequests();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    addRequest({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      department: data.department,
      type: 'group_creation',
      status: 'pending',
      formData: data
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Mail ID Creation</h1>
          <p className="text-gray-600">Create a group or department email ID</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              {...register('groupName')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter group or team name"
            />
            {errors.groupName && (
              <p className="mt-1 text-sm text-red-600">{errors.groupName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              {...register('department')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Department</option>
              <option value="IT">Information Technology</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Legal">Legal</option>
              <option value="Security">Security</option>
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="membersList" className="block text-sm font-medium text-gray-700 mb-2">
              Members List *
            </label>
            <textarea
              {...register('membersList')}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="List all members who should be part of this group email (names, designations, and existing email IDs)"
            />
            {errors.membersList && (
              <p className="mt-1 text-sm text-red-600">{errors.membersList.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <textarea
              {...register('purpose')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Explain the purpose and intended use of this group email ID"
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Group Email Guidelines:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Group emails are typically named after the department or function</li>
              <li>• All listed members will receive emails sent to this address</li>
              <li>• A group administrator will be designated to manage members</li>
              <li>• Changes to group membership require separate requests</li>
            </ul>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupCreationForm;