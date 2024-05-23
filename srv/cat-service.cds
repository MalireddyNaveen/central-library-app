using my.bookshop as my from '../db/data-model';
@path: '/BooksSRV'
service CatalogService {
   entity Books as projection on my.Books;
   entity Users as projection on my.Users;
}
