"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./graphql/schema/index"));
const index_2 = __importDefault(require("./graphql/resolvers/index"));
const isAuth = require('./middleware/isAuth');
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((req, res, next) => {
    if (req.headers.host === 'localhost:3001') {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
    }
    next();
});
app.use(isAuth);
app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: index_1.default,
    rootValue: index_2.default,
    graphiql: true,
}));
mongoose_1.default
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
