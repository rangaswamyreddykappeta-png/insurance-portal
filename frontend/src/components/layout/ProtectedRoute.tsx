"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRole?: "admin" | "customer";
};

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (allowedRole && user.role !== allowedRole) {
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [router, allowedRole]);

  if (!authorized) {
    return <div className="p-6 text-gray-500">Checking access...</div>;
  }

  return <>{children}</>;
}