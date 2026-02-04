import React from 'react';
import { useAOS } from '@/hooks/useAOS';

const AOSProvider: React.FC = () => {
  useAOS();
  return null;
};

export default AOSProvider;
