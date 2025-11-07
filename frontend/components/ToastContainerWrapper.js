'use client';

import { useToast } from '../contexts/ToastContext';
import { ToastContainer as BaseToastContainer } from '../components/Toast';

const ToastContainerWrapper = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <BaseToastContainer 
      toasts={toasts} 
      onRemove={removeToast} 
    />
  );
};

export default ToastContainerWrapper;