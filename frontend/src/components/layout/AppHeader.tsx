"use client";

import LogoutButton from "./LogoutButton";
import { getUser } from "@/lib/auth";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  const user = getUser();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        {user?.fullName && (
          <p className="text-sm text-gray-500 mt-1">
            Signed in as {user.fullName} ({user.role})
          </p>
        )}
      </div>
      <LogoutButton />
    </div>
  );
}