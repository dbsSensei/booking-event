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
exports.bindUser = exports.bindSingleEvent = exports.bindEvents = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const event_1 = __importDefault(require("../../models/event"));
const user_1 = __importDefault(require("../../models/user"));
const eventLoader = new dataloader_1.default((eventIds) => {
    return exports.bindEvents(eventIds);
});
const userLoader = new dataloader_1.default((userIds) => {
    return user_1.default.find({ _id: { $in: userIds } });
});
const bindEvents = (eventsIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!eventsIds)
            throw new Error('Please input required fields');
        const events = yield event_1.default.find({
            _id: { $in: eventsIds },
        });
        events.sort((a, b) => eventsIds.indexOf(a._id.toString()) -
            eventsIds.indexOf(b._id.toString()));
        return events.map((event) => {
            return Object.assign(Object.assign({}, event._doc), { date: new Date(event._doc.date).toISOString(), creator: userLoader.load.bind(this, event._doc.creator) });
        });
    }
    catch (err) {
        return err;
    }
});
exports.bindEvents = bindEvents;
const bindSingleEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield eventLoader.load(eventId.toString());
        return event;
    }
    catch (err) {
        return err;
    }
});
exports.bindSingleEvent = bindSingleEvent;
const bindUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userResult = yield userLoader.load(userId.toString());
        return Object.assign(Object.assign({}, userResult._doc), { password: '', createdEvents: () => eventLoader.loadMany(userResult._doc.createdEvents) });
    }
    catch (err) {
        return err;
    }
});
exports.bindUser = bindUser;
