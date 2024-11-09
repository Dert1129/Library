import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type Book = {
    read: number;
    copies: number;
    category: string;
    publisher: string;
    title: string;
    isbn: string;
    authorName: string;
    genre: string;
    imageLink: string;
    isRead: boolean;
    description: string;
};

export type RootStackParamList = {
    Home: {refresh?: boolean};
    BookInformation: { item: Book };
    Scan: undefined;
  };
  

  export interface BookInformationProps{
    title: string;
    authorName: string;
    isbn: string;
    description: string;
    genre: string;
    imageLink: string;
    category: string;
    publisher: string;
    copies: number;
    read: number;
    route: BookInformationRouteProp;
}

export type ClickState = { [isbn: string]: boolean };

export interface BookListProps {
    setBookAsRead: any;
    books: Book[];
    clickState: any,
    navigation: BookInformationNavigationProp;
}
export type HomeScreenProps = {
    navigation: HomeNavigationProp;
}

export type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type BookInformationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookInformation'>;
export type BookInformationRouteProp = RouteProp<RootStackParamList, 'BookInformation'>;


