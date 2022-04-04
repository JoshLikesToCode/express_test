const express = require('express');
const cookieParser = require('cookie-parser'); // for parsing cookies
const app = express();

app.use(cookieParser());
// enable urlencoded request bodies
app.use(express.urlencoded({extended: false}));
// enable json middle ware
app.use(express.json());

// register middleware
// the next function tells express what middleware to invoke next
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});

const users = [
    {name: 'Josh', age: 33}
]

const posts = [
    {title: 'My favorite foods'},
    {title: 'DIY Projects', post: 'This project was so simple'}
]

app.get('/', (req, res) => {
    res.send({
        msg: 'Hello!',
        user: { }
    });
});

app.post('/', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).send('Created User');
});

app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/users/:name', (req, res) => {
    const { name } = req.params; // contains user object
    const user = users.find((user) => user.name == name);
    if(user) {
        // user was found
        res.status(200).send(user);
    }
    else // user not found
    {
        res.status(404).send('Not found');
    }
});

app.get('/posts', (req, res) => {
    // console.log(req.query);
    const { title } = req.query;
    if(title) // find post based off title
    {
        const post = posts.find((post) => post.title == title);
        if(post) // found post
            res.status(200).send(post);
        else // not found
            res.status(404).send('Post not found.');
    }
    else
        res.send('No title');
});


// this validation function would typically be in its own file and imported
function validateAuthToken(req, res, next)
{
    const { authorization } = req.headers; 
    if(authorization && authorization === '123')
    {
        next();
    }
    else
        res.status(403).send({msg: 'Forbidden, incorrect credentials'});
}

// we connect the middleware above by adding validAuthToken parameter
app.post('/posts', validateAuthToken, (req, res) => {
    const post = req.body;
    console.log(post);
    posts.push(post);
    res.status(201).send(post);
});

// middleware to validate cookies
function validateCookie(req, res, next)
{
    // destructure cookies
    const { cookies } = req;
    if('session_id' in cookies)
    {
        console.log('Session ID Exists.');
        if(cookies.session_id === '123456')
            next();
        else
            res.status(403).send({msg: 'Not Authenticated'});
    }
    else
        res.status(403).send({msg: 'Not Authenticated'});
}

app.get('/signin', (req, res) => {
    res.cookie('session_id', '123456'); // function on response object
    res.status(200).json({msg: 'Logged in'});
});

app.get('/protected', validateCookie, (req, res) => {
    res.status(200).json({msg: 'You are Authorized'});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});