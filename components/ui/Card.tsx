import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => {
  return (
    <div
      className={`bg-surface border border-surface2 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${onClick ? "hover:border-accent/40 cursor-pointer active:scale-[0.99]" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-surface2 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-t border-surface2 bg-surface2/30 ${className}`}>
    {children}
  </div>
);
