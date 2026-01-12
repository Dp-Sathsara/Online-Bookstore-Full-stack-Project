export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
  keywords: string[]; // මේක තමයි අලුත් attribute එක
}