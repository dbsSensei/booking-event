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
exports.createEvent = exports.events = void 0;
const event_1 = __importDefault(require("../../models/event"));
const user_1 = __importDefault(require("../../models/user"));
const bindSchema_1 = require("./bindSchema");
const events = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_1.default.find({});
        return events.map((event) => {
            const results = Object.assign(Object.assign({}, event._doc), { date: new Date(event._doc.date).toISOString(), creator: bindSchema_1.bindUser.bind(this, event._doc.creator) });
            return results;
        });
    }
    catch (err) {
        return err;
    }
});
exports.events = events;
const createEvent = ({ eventInput, }, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.isAuth)
            throw new Error('Unauthenticated!');
        const { title, description, price } = eventInput;
        const fetchedEvent = yield event_1.default.findOne({ title });
        if (fetchedEvent)
            throw new Error('Event already exists!');
        if (title.length < 1 && description.length < 1 && price < 1)
            throw new Error('Please input required field!');
        const event = new event_1.default({
            title,
            description,
            price,
            date: new Date(),
            creator: req.userId,
        });
        const user = yield user_1.default.findById(req.userId);
        if (!user)
            throw new Error('User creator not found');
        user.createdEvents.push(event);
        const result = yield event.save();
        yield user.save();
        return Object.assign(Object.assign({}, result._doc), { date: new Date().toISOString() });
    }
    catch (err) {
        return err;
    }
});
exports.createEvent = createEvent;
