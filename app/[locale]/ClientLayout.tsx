"use client";
import React, { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 