export interface User {
  id: string;
  name: string;
  email: string;
  role: 'requester' | 'admin';
  department?: string;
  designation?: string;
}

export interface EmailRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  type: 'employee_creation' | 'employee_modification' | 'group_creation' | 'special_creation';
  status: 'pending' | 'approved' | 'rejected';
  assignedEmailId?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  formData: any;
}

export interface EmployeeCreationForm {
  name: string;
  designation: string;
  department: string;
  phone: string;
  justification: string;
}

export interface EmployeeModificationForm {
  currentEmail: string;
  requestedChange: string;
  reason: string;
}

export interface GroupCreationForm {
  groupName: string;
  membersList: string;
  purpose: string;
  department: string;
}

export interface SpecialCreationForm {
  purpose: string;
  priorityLevel: 'low' | 'medium' | 'high' | 'urgent';
  specialInstructions: string;
}

export type FormData = EmployeeCreationForm | EmployeeModificationForm | GroupCreationForm | SpecialCreationForm;