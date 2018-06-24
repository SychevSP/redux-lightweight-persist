import { createStore, applyMiddleware } from 'redux';

import {
    persistConfig,
    state as initialState,
    newState,
    shouldSaveTheseKeys
} from './testConfig';
import { configLib, initiateStateAsync, createPersistMiddleware } from '../src/index';

const mockLoad = jest.fn(key => Promise.resolve('mockValue'));
const mockSave = jest.fn((key, value) => Promise.resolve('success'));

//pass mocks instead of real save/ load function to the config
configLib ({
    asyncSave: mockSave,
    asyncLoad: mockLoad,
    persistConfig: persistConfig,
});

function testReducer(state = {}, action) {
    switch (action.type) {
        case 'UPDATE_ALL':
            // create completely new state
            // to force redux-lightweight-persist to save all the configured paths
            return newState;
        default:
            return state;
    }
}

//create redux-lightweight-persist middleware
const persistMiddleware = createPersistMiddleware();

const testStore = createStore(testReducer, initialState, applyMiddleware(persistMiddleware));

//update the whole state
testStore.dispatch({type: 'UPDATE_ALL'});

const mockArgs = mockSave.mock.calls.map(call => call[0]);

describe ('Saved all expected keys', () => {
    mockArgs.forEach(
            mockArg => {
                test (`${mockArg} is expected to be saved`, () => {
                        expect(shouldSaveTheseKeys.includes(mockArg)).toBe(true);
                    })
            });
});

describe ('All keys expected to be saved are saved', () => {
    shouldSaveTheseKeys.forEach(
            key => {
                test (`${key} is saved`, () => {
                    expect(mockArgs.includes(key)).toBe(true);
                })
            });
});


