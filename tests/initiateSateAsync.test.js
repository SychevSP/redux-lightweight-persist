import { retrieveEntries } from '../src/initiateStateAsync';
import { testConfig } from './testConfig';
import { configLib } from '../src/config';

const mockLoad = jest.fn(key => Promise.resolve('{"mockKey": "mockValue"}'));

configLib ({
    asyncSave: undefined, //do no need for this test
    asyncLoad: mockLoad, //mock it!
    persistConfig: testConfig,
});

retrieveEntries (testConfig, testConfig);

test ('The function is called 4 times', () => {
    expect(mockLoad.mock.calls.length).toBe(4);
});