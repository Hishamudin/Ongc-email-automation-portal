import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail,
  Users,
  Star,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { requests, getUserRequests } = useRequests();
  
  const userRequests = user?.role === 'admin' ? requests : getUserRequests(user?.id || '');
  
  const stats = {
    total: userRequests.length,
    pending: userRequests.filter(r => r.status === 'pending').length,
    approved: userRequests.filter(r => r.status === 'approved').length,
    rejected: userRequests.filter(r => r.status === 'rejected').length
  };

  const formTypes = [
    {
      type: 'employee_creation',
      title: 'Employee Mail ID Creation',
      description: 'Create new email ID for employees',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-blue-500',
      count: userRequests.filter(r => r.type === 'employee_creation').length
    },
    {
      type: 'employee_modification',
      title: 'Employee Mail ID Modification',
      description: 'Modify existing employee email ID',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-green-500',
      count: userRequests.filter(r => r.type === 'employee_modification').length
    },
    {
      type: 'group_creation',
      title: 'Group Mail ID Creation',
      description: 'Create group/department email ID',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500',
      count: userRequests.filter(r => r.type === 'group_creation').length
    },
    {
      type: 'special_creation',
      title: 'Special Mail ID Creation',
      description: 'Create special purpose email ID',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-orange-500',
      count: userRequests.filter(r => r.type === 'special_creation').length
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-blue-100 text-lg">
          {user?.role === 'admin' 
            ? 'Manage and review email requests from across the organization' 
            : 'Submit and track your email ID requests'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Types / Quick Actions */}
      {user?.role === 'requester' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit New Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formTypes.map((form) => (
              <Link
                key={form.type}
                to={`/form/${form.type}`}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${form.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {form.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {form.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{form.description}</p>
                    {form.count > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{form.count} previous requests</p>
                    )}
                  </div>
                  <PlusCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Admin Quick Actions */}
      {user?.role === 'admin' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/requests"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Review Requests
                  </h3>
                  <p className="text-gray-600 text-sm">Manage pending requests</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Analytics
                  </h3>
                  <p className="text-gray-600 text-sm">View reports and statistics</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          {userRequests.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No requests found</p>
              {user?.role === 'requester' && (
                <p className="text-sm text-gray-400 mt-2">Submit your first request to get started</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userRequests.slice(0, 5).map((request) => (
                <Link
                  key={request.id}
                  to={user?.role === 'admin' ? `/admin/request/${request.id}` : `/request/${request.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        request.status === 'pending' ? 'bg-yellow-100' :
                        request.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {request.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                        {request.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {request.status === 'rejected' && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.type.replace(/_/g, ' ').toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user?.role === 'admin' ? `By ${request.userName}` : `Request #${request.id}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;