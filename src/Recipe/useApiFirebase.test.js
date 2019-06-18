import { renderHook, act } from 'react-hooks-testing-library';
import { useFirebaseApi } from './useFirebaseApi';
import { database } from '../firebase';

describe('useApiFirebase', function() {
  jest.spyOn(database, 'ref');
  database.ref.mockImplementation(() => ({
    once: jest.fn(() => ({ recipe: 234 }))
  }));
  let transformedData = jest.fn(obj => obj);
  const ref = database.ref(`/recipes`);

  it('should fetch the data with ref provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFirebaseApi(ref, [], transformedData)
    );
    await waitForNextUpdate();
    expect(result.current[0]).toEqual({ recipe: 234 });
  });

  it('should transform the result of the data', function() {
    transformedData = jest.fn(obj => obj);
  });
  database.ref.mockRestore();
});
