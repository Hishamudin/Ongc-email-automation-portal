export const generateEmailSuggestions = (name: string, department: string): string[] => {
  const firstName = name.split(' ')[0].toLowerCase();
  const lastName = name.split(' ').slice(-1)[0].toLowerCase();
  const deptShort = department.toLowerCase().replace(/[^a-z]/g, '').substring(0, 3);
  
  return [
    `${firstName}.${lastName}@ongc.co.in`,
    `${firstName}${lastName}@ongc.co.in`,
    `${firstName[0]}${lastName}@ongc.co.in`,
    `${firstName}.${lastName}.${deptShort}@ongc.co.in`,
    `${firstName}${lastName[0]}@ongc.co.in`
  ];
};

export const checkEmailAvailability = (email: string): boolean => {
  // In a real app, this would check against the database
  const existingEmails = [
    'admin@ongc.co.in',
    'hr@ongc.co.in',
    'info@ongc.co.in'
  ];
  return !existingEmails.includes(email);
};