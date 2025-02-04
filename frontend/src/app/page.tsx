"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/utils/authUtils";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.push("/books");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null; // Nie renderujemy nic na stronie głównej
}
