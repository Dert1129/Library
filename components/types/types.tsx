import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
export type ClickState = { [isbn: string]: boolean };

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

export type Errors = {
    title: string;
    category: string;
    isbn: string;
    authorName: string;
    publisher: string;
    genre: string;
    copies: string;
  };

export type RootStackParamList = {
    Home: { 
        refresh?: boolean;
        searchPress?: () => void; 
    };
    BookInformation: { isbn: string, refresh?: boolean };
    Scan: undefined;
    AddBook: undefined;
    EditBook: {item: Book};
};

export type BookInformationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookInformation'>;
export type BookInformationRouteProp = RouteProp<RootStackParamList, 'BookInformation'>;
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
    navigate: BookInformationNavigationProp;
}

export type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
export interface HomeScreenProps {
  navigation: HomeNavigationProp;
  route: HomeRouteProp;
}

export type ScanNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Scan'>;
export type ScanRouteProp = RouteProp<RootStackParamList, 'Scan'>;
export interface ScanScreenProps {
    navigation: ScanNavigationProp;
    route: ScanRouteProp;
  }

  export type AddBookNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBook'>;
  export type AddBookRouteProp = RouteProp<RootStackParamList, 'AddBook'>;
export interface AddBookProps {
    navigation: AddBookNavigationProp;
    route: AddBookRouteProp;
}

export type EditBookNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditBook'>;
export type EditBookRouteProp = RouteProp<RootStackParamList, 'EditBook'>;
export interface EditBookProps {
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
    navigate: EditBookNavigationProp;
    route: EditBookRouteProp;
  }