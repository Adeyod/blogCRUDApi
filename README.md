# blogCRUDApi

I created the entry point which is index.js. I install packages such as:

1. Bcryptjs for hashing password. This will ensure more secured password.
2. cookie-parser: This gives me the opportunity to access the cookies from the request.
3. cors: This allows for Cross-Origin Resource Sharing. I added this because frontend developers might want to use the API.
4. dotenv: This is to keep secret keys like that jsonwebtoken, nodemailer.
5. jsonwebtoken: This is to authenticate and authorize users. This ensures that it is actual users that have access to their personal resource.
6. mongoose: To allow for me to use mongoDb Atlas as my database
7. nodemailer: This is what i used to send verification email to users.
8. nodemon: To auto reload my terminal to avoid manual reloading.

After creating the index file, i imported the dependencies. I first ensured that my app is listening on the environment port and if there is no environment port, it will revert back to port 5000.

I created a config folder where i created my database and i connected it to the root file. I created post, token, user models. Post model handles all posts in the database, user model handles all the user information in the database and token model handles tokens for email verification.

Then i created post and auth routes. Post route handles all post requests and auth routes handles all authentication request.

I also created Post and Auth controllers where all the request logics are done.

I have utils folder where i created nodemailer file which handle the logic for sending verification email. Another file that handles token generation and token verification for user authentication and authorization.

In the user registration logic inside auth controller, i validate the input field to ensure that user filled all fields, i also ensure that the password length is not less than 6 characters. i also ensure that password and confirm password matches. Then i also check if such user already exist and it will return with a message telling the user that user already exist, else i use bcrypt to hash the password before saving the user in the database.

Then i generate token with the user id and also token which i used crypto(an inbuilt function of nodejs) to generate a token. I saved the token inside the database. I generate a link to send verification email to the user just to prevent people using email that does not exist. When user want to login, i make sure that it is only verified users that can login to the application.

I have a verify user API which gets the token and id of the user from req.params and if the id matches id in the database, the user will be verified, the database will be updated and if not, Invalid link message will be sent.

During login, i check for email and password if it matches anyone in the database, i also check if the user is already a verified user. If is not verified, i check if a valid token is still with the user and i tell the user to confirm the email with the sent mail. If the mail has expired, i generate new one and send for user to confirm. If a confirmed user, then it will show a successful login.

The logout API is also there which gets token from the cookies, check if there is token and clear the cookie of the token. if there is no token in the cookie, it returns Invalid token.

There is also Get user API logic which gets the user using the req.params.id.

In the post controller, i ensure that all the APIs are protected such that it is only login user that can do CRUD operations.

I have the createPost API which allow login user to create post which when saving to database, i attached the user's id and email so that i can fetch the posts based on different users. I ensure that a user can only post if it is logged in and if not i send message that please login to create post.

I have API that gets all the blog posts in the database for all users to view.

There is the API that gets all the posts of a particular user which i used the id of the user from the req.user to fetch and display to the particular user.

I also have API that fetches a single post of the logged in user provided the id from req.user matches the user id saved with the post.

Delete post ensures that a user can only delete their post.

Also there is Update post which ensures that a user can only update the post that was initially created by them.
