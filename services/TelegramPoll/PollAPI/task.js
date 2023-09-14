import {v4 as uuid} from 'uuid';

import {methods} from '../BotAPI/router.js';
import {getQuestionWithMeta} from './meta.js';

let observerInterval;

const observerTimeout = 1000;

const startObserver = () => {
    if (!observerInterval) {
        observerInterval = setInterval(() => {
            if (taskList.length) {
                taskList.forEach((taskData) => {
                    if (taskData.executeTime <= new Date().getTime()) {
                        executeTask({
                            id: taskData.id,
                            type: taskData.type,
                            data: taskData.data
                        });
                    }
                });
            } else {
                stopObserver();
            }
        }, observerTimeout);
    }
};

const stopObserver = () => {
    if (observerInterval) {
        clearTimeout(observerInterval);
    }
};

export const TASK_TYPE = {
    CREATE_POLL: 'createPoll',
    STOP_POLL: 'stopPoll'
};

let taskList = [];

export const addTask = ({ type, data, executeTime, onRemove }) => {
    const id = uuid();
    if (executeTime <= new Date().getTime()) {
        console.log('Задание не было добавлено, так как время выполнение уже пройдено');
        return;
    } else if (!Object.values(TASK_TYPE).includes(type)) {
        console.log('Задание не было добавлено, так как тип не был опознан');
        return;
    }
    taskList.push({ id, type, data, executeTime, onRemove });
    startObserver();
    return id;
};

const removeTask = (id, executeResult) => {
    const taskIndex = taskList.findIndex((task) => task.id === id);
    if (taskIndex >= 0) {
        taskList[taskIndex].onRemove?.(id, executeResult);
        taskList.splice(taskIndex, 1);
    }
};

export const removeTasksByScheduleId = (scheduleId) => {
    taskList = taskList.filter((task) => task.data.scheduleId !== scheduleId);
};

const executeTask = async ({ id, type, data }) => {
    let executeResult;
    switch (type) {
        case TASK_TYPE.CREATE_POLL:
            executeResult = await methods.CreatePoll({
                chatId: data.chatId,
                question: getQuestionWithMeta(data.question, data.meta),
                options: data.options
            });
            break;
        case TASK_TYPE.STOP_POLL:
            executeResult = await methods.StopPoll({
                chatId: data.chatId,
                messageId: data.messageId
            });
            break;
    }
    removeTask(id, executeResult);
};

export const getTaskList = () => taskList;
