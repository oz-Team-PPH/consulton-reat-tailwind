import { useState } from 'react';
import { LogIn } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogIn className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          전문가 컨설팅에 로그인하세요
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          또는{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            새 계정을 만드세요
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <SocialLoginButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;