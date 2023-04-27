<h1 align='center'>Biketrace Shop - backend | MERN mobile application</h1>
<br />

## Project information

<p align='center'>My goal with this project was to create something meanigful for the company where I did my internship. The CEO & Founder of the company Biketrace, Mauro Pereira, and I, had a mutual agreement about that it was perfectly fine that I did my Thesis Project at Biketrace. He mentioned to me that he needed a mobile application where he could sell his product and magazines. The application was created with React Native, Express, Node, and MongoDB. The idea is that I am going to build the boilerplate, create some of the advanced functionalities, and that future employees of the company and future students are going to work further with this app and finally launch it on App Store and Google Play. A user can browse throguh the products, with filter method, and also type the specific name of the product or the authors name of the product. A user can ADD, DELETE whereas an admin in the future is supposed to ADD, POST, UPDATE, and CREATE. </p>
<br />

<h4>Project links</h4>
<a href="https://github.com/onurkayhann/bookfinity-eCommerce-frontend/tree/master" target="_blank">Frontend Repo for the App</a> | <a href="bookfinity-eCommerce-backend" target="_blank">Backend Repo for the App</a> | <a href="#" target="_blank">Figma work</a> | <a href="https://docs.google.com/document/d/1nj10ZCLyjz71Fj5kOzgAPagk4aVeViotq3MK20dJlLY/edit" target="_blank">Interviews</a> | <a href="https://docs.google.com/document/d/1dzh42ionl98aSxwSjv6g-yKMxyIjbsMO15JAyofy2CE/edit" target="_blank">Backlog</a> | <a href='bookfinity-eCommerce-backend/projects?query=is%3Aopen' target='_blank'>Sprints</a>

### Used languages to create this App

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [CSS](https://css-tricks.com/)
- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Routes and navigation

| Path                                                              | Type    | Access  |
| ----------------------------------------------------------------- | ------- | ------- |
| **Products/Magazines**                                                      |
| Get all camps: <br /> `${api}/books`                              | GET     | Public  |
| Get products based belt degree: <br /> `${api}/books/{id}`        | GET     | Public  |
| **Admin**                                                         |
| Create a product: <br /> `${api}/books/{id}`                      | POST    | Admin   |
| Delete a product: <br /> `/${api}/books/{id}`                     | DELETE  | Admin   |
| Update a product: <br /> `${api}/books/{id}`                      | PUT     | Admin   |
| Update a user: <br /> `/api/user/admin/{userId}`                  | PATCH   | Admin   |
| Delete a user: <br /> `/api/user/{userId}`                        | DELETE  | Admin   |
| **User**                                                          |         |
| Register: <br /> `${api}/users/register`                          | POST    | Public  |
| Login: <br /> `${api}/users/login`                                | POST    | Private |
| Logout: <br /> `/api/users/logout`                                | GET     | Private |
| User purchases: <br /> `${api}/orders`                            | POST    | Private |

## Deployment

Will be deployed in the future, stay tuned.

## How to get starting with the app

### Installation steps

1. Clone the repo
   ```sh
   git clone https://github.com/onurkayhann/bookfinity-eCommerce-backend
   ```
2. Install NPM packages (In the client and server folders)
   ```sh
   npm install
   ```
3. Create your .env
   ```JS
   API_URL = Create your URL
   SECRET = Your secret auth
   CONNECTION_STRING = Your connection string to MongoDB
   ```
4. Run
   ```sh
   npm start
   ```

## Fulfilled requirements

- RESTful API
- Responsiveness
- User Register, Login, and Logout
- User can search in the search field
- User can filter through prices and products
- Users will be able to use PayPal or VISA to pay for their shopping in the future

## Sitemap for backend

<img src='./public/uploads/sitemap_backend.png' alt='sitemap' />

## Test
I used Mocha, Mocha-Http, Chai, and Chai-Http to test some important routes on the backend. Everything is documentated and can be reached in the test map, on the backend.

## License

MIT license

## About Biketrace
Biketrace is a startup company, and funded by Mauro Pereira at 2020. They're at the early stage of their development, they don't earn money. The company depends on students, and the valueable help from them. The idea is to create smart locks for Bikecycles.
[Visit Biketrace here](https://www.biketrace.se/eng/index.html) 

## Thanks to providers

I am super grateful that some people from the UX Designer program participated in my pre-work, as well as experienced App Developers and allowed me, to interview them. Thank you Denise, Rahim, Deniz, Nadin, and Behjat.

## About the Author

My name is Onur, I am born and raised in Sweden, Stockholm. I am a code geek that always wants to learn about the coding, algorithms, and everything related to code. On my spare time I love reading books, learn Brazilian Jiu-Jitsu, travel, and explore different cultures.

## Get in touch with me

Email - onur.kayhan@chasacademy.se
<br />
LinkedIn: [Onur Kayhan](https://www.linkedin.com/in/onur-kayhan-02b770234/)
<br />
[My website](https://onur-portfolio.netlify.app/)
