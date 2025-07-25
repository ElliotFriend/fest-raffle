import { persisted } from 'svelte-persisted-store';

export const contractAddress = persisted<string>('fest:contractAddress', '');
