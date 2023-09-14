const META_TYPE = {
    DAY: 'day',
    HOURS: 'hours',
    MINUTES: 'minutes'
};

const isValidHours = (value) => {
    return value >= 0 && value < 24;
};

const isValidMinutes = (value) => {
    return value >= 0 && value < 59;
};

const unshiftZero = (value, cutLength = 2) => `0${value}`.slice(-cutLength);

const getFormattedTime = (date) => `${unshiftZero(date.getHours())}:${unshiftZero(date.getMinutes())}`;

const getFormattedDate = (date) => `${date.getDate()}.${unshiftZero(date.getMonth() + 1)}`;

const getMinutes = (value, delta) => {

};

export const getQuestionWithMeta = (question, meta) => {
    if (meta?.length) {
        const metaText = [];
        meta.forEach((data) => {
            const { type, delta, value } = data;
            if (delta !== undefined || value !== undefined) {
                let rawValue;
                switch (type) {
                    case META_TYPE.DAY:
                        if (delta !== undefined) {
                            const now = new Date();
                            now.setDate(now.getDate() + delta);
                            rawValue = new Date(now.getTime());
                        } else {
                            rawValue = new Date(value);
                        }
                        metaText.push(getFormattedDate(rawValue));
                        break;
                    case META_TYPE.HOURS:
                        rawValue = new Date();
                        if (delta !== undefined) {
                            rawValue.setHours(rawValue.getHours() + delta);
                        } else {
                            rawValue.setHours(value);
                        }
                        const minutesMeta = meta.find((metaData) => metaData.type === META_TYPE.MINUTES);
                        if (minutesMeta) {
                            if (minutesMeta.delta !== undefined || minutesMeta.value !== undefined) {
                                if (minutesMeta.delta !== undefined) {
                                    rawValue.setMinutes(rawValue.getMinutes() + minutesMeta.delta);
                                } else {
                                    rawValue.setMinutes(value);
                                }
                            }
                        }
                        metaText.push(getFormattedTime(rawValue));
                        break;
                }
            }
        });
        return `${question} (${metaText.join(' ')})`;
    }
    return question;
};
