import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmailRequest, FormData } from '../types';

interface RequestContextType {
  requests: EmailRequest[];
  addRequest: (request: Omit<EmailRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequest: (id: string, updates: Partial<EmailRequest>) => void;
  getUserRequests: (userId: string) => EmailRequest[];
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

// Mock initial data
const initialRequests: EmailRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@ongc.co.in',
    department: 'IT',
    type: 'employee_creation',
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    formData: {
      name: 'John Doe',
      designation: 'Software Engineer',
      department: 'IT',
      phone: '+91-9876543210',
      justification: 'New employee joining the team'
    }
  }
];

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<EmailRequest[]>(initialRequests);

  useEffect(() => {
    const savedRequests = localStorage.getItem('ongc_requests');
    if (savedRequests) {
      const parsed = JSON.parse(savedRequests);
      // Convert date strings back to Date objects
      const requestsWithDates = parsed.map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt)
      }));
      setRequests(requestsWithDates);
    }
  }, []);

  const saveToStorage = (updatedRequests: EmailRequest[]) => {
    localStorage.setItem('ongc_requests', JSON.stringify(updatedRequests));
  };

  const addRequest = (request: Omit<EmailRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: EmailRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    saveToStorage(updatedRequests);
  };

  const updateRequest = (id: string, updates: Partial<EmailRequest>) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, ...updates, updatedAt: new Date() } : req
    );
    setRequests(updatedRequests);
    saveToStorage(updatedRequests);
  };

  const getUserRequests = (userId: string) => {
    return requests.filter(req => req.userId === userId);
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateRequest, getUserRequests }}>
      {children}
    </RequestContext.Provider>
  );
};