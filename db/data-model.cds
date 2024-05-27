namespace my.bookshop;

using {cuid} from '@sap/cds/common';


entity Books : cuid {

  ISBN          : String;
  title         : String;
  quantity      : Integer;
  author        : String;
  genre         : String;
  publisher     : String;
  language      : String;
  price         : Integer;
  availability  : String;
  // users        : Association to Users;
  activeLoan_ID : Composition of many ActiveLoans
                    on activeLoan_ID.bookId = $self

}

entity Users : cuid {
  userName    : String;
  password    : String;
  email       : String;
  phoneNumber : Integer;
  Address     : String;
  // books       : Association to many Books
  //                 on books.users = $self;
  userType    : String;
  activeLoans : Association to ActiveLoans

}

entity ActiveLoans : cuid {
  bookId    : Association to Books;
  userId    : Association to Users;
  issueDate : Date;
  dueDate   : Date
}
