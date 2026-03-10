import { ImageURISource } from 'react-native';

export interface Blog {
  categoryTitle: string;
  image: ImageURISource;
  title: string;
  address: string;
  from: string;
  to: string;
}