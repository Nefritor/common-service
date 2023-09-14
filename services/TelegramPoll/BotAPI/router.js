import axios from 'axios';

const token = '920518128:AAEh8O5DdOnfvxJkzbU43FLS_7QQP0TH1ng';

const getBotUrl = () => `https://api.telegram.org/bot${token}/`;

const execute = async ({ method, data }) => {
    const response = await axios({
        method: 'post',
        url: getBotUrl() + method,
        data: data
    });
    return response.data;
};

const createPoll = ({ chatId, question, options }) =>
    execute({
        method: 'sendPoll',
        data: {
            chat_id: chatId,
            question,
            options,
            is_anonymous: false
        }
    });

const stopPoll = ({ chatId, messageId }) =>
    execute({
        method: 'stopPoll',
        data: {
            chat_id: chatId,
            message_id: messageId
        }
    });

export const methods = {
    Execute: execute,
    CreatePoll: createPoll,
    StopPoll: stopPoll
};
