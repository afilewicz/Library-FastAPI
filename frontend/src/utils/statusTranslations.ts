export const statusTranslations: { [key: string]: string } = {
  Reserved: "Zarezerwowana",
  Loaned: "Wypożyczona",
  Returned: "Zwrócona",
};

export const translateStatus = (status: string): string => {
  return statusTranslations[status] || status;
};
