import {v4 as uuid} from 'uuid';
import {readFile, writeFile} from 'node:fs/promises';

import {getTaskList, removeTasksByScheduleId} from './task.js';
import {addScheduledPoll} from './schedule.js';

const DATABASES = {
    ACTIVE_SESSIONS: './database/TelegramPoll/ActiveSessions.json',
    ADMIN_DATA: './database/TelegramPoll/AdminData.json'
};

// region DATABASE METHODS
const getDatabase = async (path) =>
    JSON.parse(await readFile(path, { encoding: 'utf8' }));

const setDatabase = async (data, path) =>
    await writeFile(path, JSON.stringify(data));

const getActiveSessions = () => getDatabase(DATABASES.ACTIVE_SESSIONS);

const setActiveSessions = (data) => setDatabase(data, DATABASES.ACTIVE_SESSIONS);

const getAdminData = () => getDatabase(DATABASES.ADMIN_DATA);

const setAdminData = (data) => setDatabase(data, DATABASES.ADMIN_DATA);

// endregion

const createScheduledPoll = async ({ chat_id, poll_data, schedule_data, sid }) => {
    const sessions = await getActiveSessions();
    if (sessions.some((session) => session.sid === sid)) {
        const scheduleId = uuid();
        const { question, options, meta } = poll_data;
        const { start_time, stop_timeout, repeat_every } = schedule_data;
        addScheduledPoll({
            scheduleId,
            chatId: chat_id,
            question,
            meta,
            options,
            startTime: start_time,
            stopTimeout: stop_timeout,
            repeatEvery: repeat_every
        });
    }
};

const stopScheduledPoll = async ({ schedule_id }) => {
    removeTasksByScheduleId(schedule_id);
};

const signIn = async ({ login, hash }) => {
    return {
        sid: '',
        daysToExpire: 7
    };
};

export const methods = {
    CreateScheduledPoll: createScheduledPoll,
    StopScheduledPoll: stopScheduledPoll,
    GetScheduleTaskList: getTaskList,
    SingIn: signIn
};
