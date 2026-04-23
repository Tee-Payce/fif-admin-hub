import client from './client';

export const getPricing = () => client.get('/pricing');
export const updatePricing = (id: string, price: number) => client.patch(`/pricing/${id}`, { price });
