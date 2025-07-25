import { persisted } from 'svelte-persisted-store';

export const keyId = persisted<string>('fest:keyId', '');
