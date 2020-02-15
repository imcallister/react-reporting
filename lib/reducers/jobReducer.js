

const jobReducer = (state, action) => {

    const jobStarted = (state, action) => {
        console.log('JOB STARTED', action);
        return state;
    }

    const jobFailed = (state, action) => {
        console.log('JOB FAILED', action);
        return state;
    }

    const jobHandlers = {
        START_JOB: jobStarted,
        JOB_FAILED: jobFailed,
        DEFAULT: (state, action) => (state)
    }

    return (jobHandlers[action.type] || jobHandlers['DEFAULT'])(state, action);
}

export default jobReducer;
