import {readFile, writeFile} from 'node:fs/promises';

const getDatabase = async () =>
    JSON.parse(
        await readFile(
            './database/Constructor/Exercises.json',
            { encoding: 'utf8' }
        )
    );

const setDatabase = async (data) =>
    await writeFile(
        './database/Constructor/Exercises.json',
        JSON.stringify(data)
    );

const getExercises = async () => {
    return (await getDatabase()).map((data) => ({ id: data.id, title: data.title }));
};

const createExercise = async (data) => {
    const mainData = await getDatabase();
    mainData.push({ ...data, exerciseData: [] });
    return setDatabase(mainData);
};

const readExercise = async (data) => {
    return (await getDatabase()).find((exercise) => exercise.id === data.id);
};

const updateExercise = async (data) => {
    const database = await getDatabase();
    const index = database.indexOf((data) => data.id);
    database.splice(index, 1, data);
    return setDatabase(database);
};

const deleteExercise = async ({ id }) => {
    const database = await getDatabase();
    return setDatabase(database.filter((data) => data.id !== id));
};

export const methods = {
    GetList: getExercises,
    CreateExercise: createExercise,
    ReadExercise: readExercise,
    UpdateExercise: updateExercise,
    DeleteExercise: deleteExercise
};
