import client from './client';

export const getStories = () => client.get('/stories');
export const createStory = (formData: FormData) => client.post('/stories', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteStory = (id: string) => client.delete(`/stories/${id}`);
