
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Medicine } from '../types';

interface EnquiryContextType {
  enquiryList: Medicine[];
  addToEnquiry: (medicine: Medicine) => void;
  removeFromEnquiry: (medicineId: string) => void;
  isInEnquiry: (medicineId: string) => boolean;
  clearEnquiry: () => void;
}

export const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

const ENQUIRY_KEY = 'pharma_enquiry_list';

export const EnquiryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enquiryList, setEnquiryList] = useState<Medicine[]>([]);

  useEffect(() => {
    try {
      const storedList = localStorage.getItem(ENQUIRY_KEY);
      if (storedList) {
        setEnquiryList(JSON.parse(storedList));
      }
    } catch (e) {
      console.error("Failed to load enquiry list from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRY_KEY, JSON.stringify(enquiryList));
    } catch (e) {
      console.error("Failed to save enquiry list to localStorage", e);
    }
  }, [enquiryList]);

  const addToEnquiry = useCallback((medicine: Medicine) => {
    setEnquiryList(prevList => {
      if (!prevList.some(item => item.id === medicine.id)) {
        return [...prevList, medicine];
      }
      return prevList;
    });
  }, []);

  const removeFromEnquiry = useCallback((medicineId: string) => {
    setEnquiryList(prevList => prevList.filter(item => item.id !== medicineId));
  }, []);

  const isInEnquiry = useCallback((medicineId: string) => {
    return enquiryList.some(item => item.id === medicineId);
  }, [enquiryList]);

  const clearEnquiry = useCallback(() => {
    setEnquiryList([]);
  }, []);

  const value = {
    enquiryList,
    addToEnquiry,
    removeFromEnquiry,
    isInEnquiry,
    clearEnquiry,
  };

  return (
    <EnquiryContext.Provider value={value}>
      {children}
    </EnquiryContext.Provider>
  );
};
