
import { useContext } from 'react';
import { MedicinesContext } from '../context/MedicinesProvider';

export const useMedicines = () => {
  const context = useContext(MedicinesContext);
  if (context === undefined) {
    throw new Error('useMedicines must be used within a MedicinesProvider');
  }
  return context;
};
