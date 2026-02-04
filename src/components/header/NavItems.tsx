import React from 'react';

export interface NavItem {
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { label: 'How It Works', path: '/#how-it-works' },
  { label: 'Pricing', path: '/#pricing' },
  { label: 'About', path: '/about' },
];
