import { ui, uiConfig } from '../firebase/auth';
import React, { useEffect } from 'react';

export const SignInWithFirebase = () => {
  useEffect(() => {
    ui.start('#firebaseui-auth-container', uiConfig);
  }, []);

  return <div id="firebaseui-auth-container" />;
};
