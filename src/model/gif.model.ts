export interface Gif {
  id: string;
  src: string;
  title: string;
  tags: string[];
  user: {
    avatar: string;
    name: string;
  };
}
