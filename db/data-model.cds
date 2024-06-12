namespace my.bookshop;

using {cuid} from '@sap/cds/common';

using {reusable.types as types} from './resuable_types';
entity Books : cuid {

  ISBN          : String;
  title         : String;
  quantity      : Integer;
  author        : String;
  genre         : String;
  publisher     : String;
  language      : String;
  price         : Integer;
  user:Association to Users;
  availability  : Integer;
  activeLoan_ID : Composition of many ActiveLoans
                    on activeLoan_ID.bookId = $self

}

entity Users : cuid {
  userName    : String not null;
  password    : String not null;
  email       : types.Email not null;
  phoneNumber : types.PhoneNumber not null;
  Address     : String not null;
  // books       : Association to many Books
  //                 on books.users = $self;
  userType    : String;
  exsist:Boolean;
  book:Association to many Books on book.user=$self;
  activeLoans : Association to many ActiveLoans
                  on activeLoans.userId = $self;
  issueBooks  : Association to many IssueBooks
                  on issueBooks.user = $self;
  

}

entity ActiveLoans : cuid {
  bookId    : Association to Books;
  userId    : Association to Users;
  issueDate : Date;
  dueDate   : Date;
  notify:String
}

entity IssueBooks : cuid {
  book         : Association to Books;
  user         : Association to Users;
  reservedDate : Date
}
