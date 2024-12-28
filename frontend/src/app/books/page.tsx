"use client";
import React, {useEffect, useState} from 'react';
import BooksView from '@/components/BooksList';
import {useRouter} from "next/navigation";

export default function BooksPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
        <BooksView/>
    </div>
  );
}