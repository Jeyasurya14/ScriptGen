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
        "rounded-3xl border border-border bg-[linear-gradient(180deg,rgba(20,24,38,0.96),rgba(14,18,32,0.98))]",
        "shadow-[0_24px_80px_rgba(5,7,16,0.32)]",
        onClick ? "cursor-pointer transition hover:border-accent/30" : "",
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
  return <div className={`border-b border-border px-6 py-5 ${className}`}>{children}</div>;
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`border-t border-border px-6 py-5 ${className}`}>{children}</div>;
}
