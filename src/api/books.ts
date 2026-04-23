import client from './client';

export const getBooks = () => client.get('/books');
export const createBook = (formData: FormData) => client.post('/books', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteBook = (id: string) => client.delete(`/books/${id}`);
