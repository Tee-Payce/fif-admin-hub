import client from './client';

export const getComments = () => client.get('/admin/comments');
export const deleteComment = (id: string) => client.delete(`/comments/${id}`);

export const getReviews = () => client.get('/admin/reviews');
export const deleteReview = (id: string) => client.delete(`/reviews/${id}`);
