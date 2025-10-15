
import { useContext } from 'react';
import { EnquiryContext } from '../context/EnquiryProvider';

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};
