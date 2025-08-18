import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg  bg-gray-900/50 ${className}`}>{children}</div>
  );
};

export const CardHeader: React.FC<CardProps> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-lg font-semibold text-letter ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
};
