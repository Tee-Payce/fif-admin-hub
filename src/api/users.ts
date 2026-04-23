import client from './client';

export const getUsers = () => client.get('/admin/users');
export const updateUser = (id: string, data: any) => client.patch(`/admin/users/${id}`, data);
export const deleteUser = (id: string) => client.delete(`/admin/users/${id}`);
