/**
 * 支払取引キャンセル
 * @ignore
 */

import * as pecorino from '@motionpicture/pecorino-domain';

import mongooseConnectionOptions from '../../../mongooseConnectionOptions';

pecorino.mongoose.connect(<string>process.env.MONGOLAB_URI, mongooseConnectionOptions)
    .then()
    .catch((err) => {
        console.error(err);
        process.exit(0);
    });

let count = 0;

const MAX_NUBMER_OF_PARALLEL_TASKS = 10;
const INTERVAL_MILLISECONDS = 1000;
const taskRepository = new pecorino.repository.Task(pecorino.mongoose.connection);

setInterval(
    async () => {
        if (count > MAX_NUBMER_OF_PARALLEL_TASKS) {
            return;
        }

        count += 1;

        try {
            await pecorino.service.task.executeByName(
                pecorino.factory.taskName.CancelPayAction
            )(taskRepository, pecorino.mongoose.connection);
        } catch (error) {
            console.error(error.message);
        }

        count -= 1;
    },
    INTERVAL_MILLISECONDS
);
