export interface Book {
  id: number;
  publisher: string;
  price: number;
  is_available: boolean;
  title: string;
  author: string;
  date_of_publication: string;
  is_permanently_unavailable: boolean;
}

export interface Loan {
    id: number;
    book_title: string;
    book_author: string;
    user_username: string;
    loan_date: string;
    return_date: string | null;
    status: string;
}