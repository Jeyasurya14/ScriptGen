import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-border bg-surface",
        onClick ? "cursor-pointer transition hover:border-border2" : "",
        className,
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`border-b border-border px-5 py-4 ${className}`}>{children}</div>;
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`border-t border-border px-5 py-4 ${className}`}>{children}</div>;
}
