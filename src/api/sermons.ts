import client from './client';

export const getSermons = () => client.get('/sermons');
export const createSermon = (data: any) => client.post('/sermons', data);
