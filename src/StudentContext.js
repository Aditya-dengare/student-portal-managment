import React, { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const setStudent = (student) => {
    setSelectedStudent(student);
  };

  const clearStudent = () => {
    setSelectedStudent(null);
  };

  return (
    <StudentContext.Provider value={{ selectedStudent, setStudent, clearStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};