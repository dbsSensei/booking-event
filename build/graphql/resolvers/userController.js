"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = exports.users = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../models/user"));
const bindSchema_1 = require("./bindSchema");
const users = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        return users.map((user) => {
            return Object.assign(Object.assign({}, user._doc), { password: '', createdEvents: bindSchema_1.bindEvents.bind(this, user._doc.createdEvents) });
        });
    }
    catch (err) {
        return err;
    }
});
exports.users = users;
const createUser = ({ userInput, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = userInput;
        const fetchedUser = yield user_1.default.findOne({ email });
        if (fetchedUser)
            throw new Error('User already exists!');
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        if (email.length < 1 && password.length < 1)
            throw new Error('Please input required fields!');
        const user = new user_1.default({
            email,
            password: hashedPassword,
        });
        const result = yield user.save();
        return Object.assign(Object.assign({}, result._doc), { password: '' });
    }
    catch (err) {
        return err;
    }
});
exports.createUser = createUser;
const login = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            throw new Error('Data is invalid!');
        }
        const isEqualPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isEqualPassword) {
            throw new Error('Data is invalid!');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, 'supersecretkey', {
            expiresIn: '1h',
        });
        return { userId: user._id, token, tokenExpiration: 1 };
    }
    catch (err) {
        return err;
    }
});
exports.login = login;
