import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { useNavigate } from 'react-router-dom';
import { SpecialCreationForm as FormData } from '../../types';

const schema = z.object({
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  priorityLevel: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Please select a priority level'
  }),
  specialInstructions: z.string().min(5, 'Special instructions are required')
});

const SpecialCreationForm: React.FC = () => {
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
      department: user.department || 'Special',
      type: 'special_creation',
      status: 'pending',
      formData: data
    });

    navigate('/dashboard');
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Mail ID Creation</h1>
          <p className="text-gray-600">Request a special purpose email ID</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <textarea
              {...register('purpose')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Describe the specific purpose and use case for this special email ID"
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                <label key={priority} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    {...register('priorityLevel')}
                    type="radio"
                    value={priority}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[priority]}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            {errors.priorityLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.priorityLevel.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions *
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Provide any special instructions, security requirements, or specific configuration needs"
            />
            {errors.specialInstructions && (
              <p className="mt-1 text-sm text-red-600">{errors.specialInstructions.message}</p>
            )}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">Special Email Examples:</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Project-specific emails (project.name@ongc.co.in)</li>
              <li>• Event or campaign emails (event.name@ongc.co.in)</li>
              <li>• System or application emails (system.alerts@ongc.co.in)</li>
              <li>• External communication emails (pr@ongc.co.in)</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-900 mb-2">⚠️ Important:</h3>
            <p className="text-sm text-amber-800">
              Special email requests require additional approval and may take longer to process. 
              High priority and urgent requests will be reviewed first.
            </p>
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

export default SpecialCreationForm;