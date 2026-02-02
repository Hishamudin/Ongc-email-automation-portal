import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  Mail, 
  Building,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { downloadPDF } from '../utils/pdfGenerator';

const RequestDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, updateRequest } = useRequests();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [assignedEmail, setAssignedEmail] = useState('');

  const request = requests.find(r => r.id === id);
  
  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Request not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
    const updates: any = { status, comments: comment };
    if (status === 'approved' && assignedEmail) {
      updates.assignedEmailId = assignedEmail;
    }
    updateRequest(request.id, updates);
  };

  const handleDownloadPDF = () => {
    downloadPDF(request);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Request #{request.id}
              </h1>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Requested by</p>
                  <p className="font-medium">{request.userName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{request.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{request.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-medium">{format(request.createdAt, 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {request.type.replace(/_/g, ' ').toUpperCase()} Details
              </h3>
              <div className="space-y-4">
                {Object.entries(request.formData).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-gray-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {request.assignedEmailId && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Assigned Email ID</h4>
                <p className="text-green-800 font-mono">{request.assignedEmailId}</p>
              </div>
            )}

            {request.comments && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
                <p className="text-gray-700">{request.comments}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="flex items-center space-x-3">
              {request.status === 'pending' && <Clock className="w-6 h-6 text-yellow-500" />}
              {request.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {request.status === 'rejected' && <XCircle className="w-6 h-6 text-red-500" />}
              <span className="font-medium capitalize">{request.status}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Last updated: {format(request.updatedAt, 'dd/MM/yyyy HH:mm')}
            </p>
          </div>

          {/* Admin Actions */}
          {user?.role === 'admin' && request.status === 'pending' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Email ID (for approval)
                  </label>
                  <input
                    type="email"
                    value={assignedEmail}
                    onChange={(e) => setAssignedEmail(e.target.value)}
                    placeholder="new.email@ongc.co.in"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Add comments for the requester"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={!assignedEmail}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline (placeholder for future enhancement) */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Request Submitted</p>
                  <p className="text-xs text-gray-500">{format(request.createdAt, 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
              {request.status !== 'pending' && (
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium capitalize">Request {request.status}</p>
                    <p className="text-xs text-gray-500">{format(request.updatedAt, 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;