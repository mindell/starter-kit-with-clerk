import { StrapiBaseFields } from './base';

export interface StrapiCategory extends StrapiBaseFields {
    name: string;
    slug: string;
    description: string;
}
