import { FC } from 'react';

// Declaration for the LoginModal component
declare const LoginModal: FC<{
  isVisible: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}>;

export default LoginModal; 