"use strict";
/**
 * 現金転送実行
 * @ignore
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pecorino = require("@motionpicture/pecorino-domain");
const createDebug = require("debug");
const mongooseConnectionOptions_1 = require("../../../mongooseConnectionOptions");
const debug = createDebug('pecorino-jobs:continuous:settleCreditCard');
pecorino.mongoose.connect(process.env.MONGOLAB_URI, mongooseConnectionOptions_1.default)
    .then()
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
let count = 0;
const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 1000;
const taskRepo = new pecorino.repository.Task(pecorino.mongoose.connection);
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
        return;
    }
    count += 1;
    try {
        debug('count:', count);
        yield pecorino.service.task.executeByName(pecorino.factory.taskName.MoneyTransfer)({ taskRepo: taskRepo, connection: pecorino.mongoose.connection });
    }
    catch (error) {
        console.error(error);
    }
    count -= 1;
}), INTERVAL_MILLISECONDS);
