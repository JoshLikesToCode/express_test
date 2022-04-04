const express = require('express');
const app = express();

// enable urlencoded request bodies
app.use(express.urlencoded({extended: false}));
// enable json middle ware
app.use(express.json());

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

app.post('/posts', (req, res) => {
    // object destructuring example
    const { authorization } = req.headers; // set post header "Authorization : '123'" in postman
    if(authorization && authorization === '123')
    {
        const post = req.body;
        console.log(post);
        posts.push(post);
        res.status(201).send(post);
    } 
    else // didn't pass in correct credentials
        res.status(404).send('You do not have the right credentials');
    
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});