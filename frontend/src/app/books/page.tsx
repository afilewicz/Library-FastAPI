import React from 'react';
import BooksView from '@/components/BooksList';
import MyNavbar from '@/components/MyNavbar';

export default function BooksPage() {
  return (
    <div>
        <MyNavbar/>
        <BooksView/>
    </div>
  );
}