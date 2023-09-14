import {addTask, TASK_TYPE} from './task.js';

const REPEAT_EVERY = {
    DEBUG: 'debug',
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month'
};

const getNextStartTime = (repeatEvery, prevStartDate) => {
    const date = new Date(prevStartDate);
    switch (repeatEvery) {
        case REPEAT_EVERY.DEBUG:
            return date.setSeconds(date.getSeconds() + 10);
        case REPEAT_EVERY.MINUTE:
            return date.setMinutes(date.getMinutes() + 1);
        case REPEAT_EVERY.HOUR:
            return date.setHours(date.getHours() + 1);
        case REPEAT_EVERY.DAY:
            return date.setDate(date.getDate() + 1);
        case REPEAT_EVERY.WEEK:
            return date.setDate(date.getDate() + 7);
        case REPEAT_EVERY.MONTH:
            return date.setMonth(date.getMonth() + 1);
    }
};

const getStopTime = (startTime, stopTimeout) => startTime + stopTimeout;

export const addScheduledPoll =
    ({
         scheduleId,
         chatId,
         question,
         meta,
         options,
         startTime,
         stopTimeout,
         repeatEvery
     }) => {
        console.log('Следующее событие', new Date(startTime));
        const stopTime = getStopTime(startTime, stopTimeout);
        addTask({
            type: TASK_TYPE.CREATE_POLL,
            data: {
                scheduleId,
                chatId,
                question,
                meta,
                options
            },
            executeTime: startTime,
            onRemove: (taskId, executeResult) => {
                addTask({
                    type: TASK_TYPE.STOP_POLL,
                    data: {
                        scheduleId,
                        chatId,
                        messageId: executeResult.result.message_id
                    },
                    executeTime: stopTime
                });
                addScheduledPoll({
                    scheduleId,
                    chatId,
                    question,
                    meta,
                    options,
                    startTime: getNextStartTime(repeatEvery, startTime),
                    stopTimeout,
                    repeatEvery
                });
            }
        });
    };

