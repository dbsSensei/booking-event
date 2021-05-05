import express, { Request } from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';

import schema from './graphql/schema/index';
import rootValue from './graphql/resolvers/index';

const isAuth = require('./middleware/isAuth');

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req: Request, res, next) => {
  if (req.headers.host === 'localhost:3001') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  }

  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

mongoose
  .connect('mongodb://localhost:27017/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3001, () => {
      console.log('Listening on port 3001');
    });
  })
  .catch((err) => {
    console.log(err);
  });
