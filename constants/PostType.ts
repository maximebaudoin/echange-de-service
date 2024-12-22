export type PostType = 'search' | 'proposition';

export const postTypes: { [key in PostType]: string; } = {
    'proposition': 'Proposition',
    'search': 'Recherche',
};