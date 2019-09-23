import { renderHook, act } from '@testing-library/react-hooks';
import { useFirebaseGETApi } from './useFirebaseApi';

describe('useApiFirebase', function() {
  let transformedData = jest.fn(obj => obj);
  const endpoint = () => {
    return {
      val: () => {
        return {
          recipe: 234
        };
      }
    };
  };

  it('should fetch the data with provided endpoint', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFirebaseGETApi(endpoint, [])
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.current[0]).toEqual({ recipe: 234 });
  });
});
