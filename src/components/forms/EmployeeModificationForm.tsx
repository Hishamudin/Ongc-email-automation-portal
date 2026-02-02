import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { useNavigate } from 'react-router-dom';
import { EmployeeModificationForm as FormData } from '../../types';

const schema = z.object({
  currentEmail: z.string().email('Please enter a valid email address'),
  requestedChange: z.string().min(5, 'Please describe the requested change'),
  reason: z.string().min(10, 'Reason must be at least 10 characters')
});

const EmployeeModificationForm: React.FC = () => {
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
      department: user.department || 'Unknown',
      type: 'employee_modification',
      status: 'pending',
      formData: data
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Mail ID Modification</h1>
          <p className="text-gray-600">Request modification to an existing email ID</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Current Email Address *
            </label>
            <input
              {...register('currentEmail')}
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="current.email@ongc.co.in"
            />
            {errors.currentEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.currentEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="requestedChange" className="block text-sm font-medium text-gray-700 mb-2">
              Requested Change *
            </label>
            <textarea
              {...register('requestedChange')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Describe what changes you want to make (e.g., change email format, add alias, etc.)"
            />
            {errors.requestedChange && (
              <p className="mt-1 text-sm text-red-600">{errors.requestedChange.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change *
            </label>
            <textarea
              {...register('reason')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Provide detailed reason for the modification request"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Email modifications may take 24-48 hours to process</li>
              <li>• Some changes may require additional approvals</li>
              <li>• Old email aliases will be maintained for 30 days</li>
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

export default EmployeeModificationForm;