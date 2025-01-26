import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
export type ClickState = { [isbn: string]: boolean };

export type Book = {
    id: number;
    read: number;
    copies: number;
    category: string;
    publisher: string;
    title: string;
    isbn: string;
    authorName: string;
    genreList: string[];
    imageLink: string;
    isRead: boolean;
    description: string;
    startDate: Date;
    endDate: Date;
    review: string;
    rating: number;
};

export type Errors = {
    title: string;
    category: string;
    isbn: string;
    authorName: string;
    publisher: string;
    genre: string;
    copies: string;
    startDate: string;
    endDate: string;
    rating: string;
  };

export type RootStackParamList = {
    Home: { 
        refresh?: boolean;
        showSearchBar?: boolean;
    };
    BookInformation: { id: number, refresh?: boolean };
    Scan: undefined;
    AddBook: {item: Book | null};
    EditBook: {item: Book};
};

export type BookInformationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookInformation'>;
export type BookInformationRouteProp = RouteProp<RootStackParamList, 'BookInformation'>;
  export interface BookInformationProps{
    id: number;
    title: string;
    authorName: string;
    isbn: string;
    description: string;
    genreList: string[];
    imageLink: string;
    category: string;
    publisher: string;
    copies: number;
    read: number;
    startDate: Date;
    endDate: Date;
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
    params: {
        item?: Book;
    }
}

export type EditBookNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditBook'>;
export type EditBookRouteProp = RouteProp<RootStackParamList, 'EditBook'>;
export interface EditBookProps {
    title: string;
    authorName: string;
    isbn: string;
    description: string;
    genreList: string[];
    imageLink: string;
    category: string;
    publisher: string;
    copies: number;
    read: number;
    startDate: Date;
    endDate: Date;
    navigate: EditBookNavigationProp;
    route: EditBookRouteProp;
  }