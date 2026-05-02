import slugify from 'slugify';

export const createSlug = (text: string): string => {
  return slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
};