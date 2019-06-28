import { useEffect, useState, useCallback } from 'react';

export const useFirebaseGETApi = (
  endpoint,
  initialState,
  transformDataForState = null
) => {
  const [data, setData] = useState(initialState);
  const [isInError, setIsInError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await endpoint();
        const transformedData = transformDataForState
          ? transformDataForState(result)
          : result.val();
        setData(transformedData);
      } catch (error) {
        setIsInError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [endpoint, transformDataForState]);

  return [data, isInError, isLoading];
};

export const useFirebasePOSTApi = (endpoint, payload, method = 'SET') => {
  const [isInError, setIsInError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const postData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (method === 'UPDATE') {
        console.log('payload', payload);
        await endpoint.update(payload);
      } else {
        await endpoint.set(payload);
      }
    } catch (error) {
      setIsInError(true);
    }
    setIsLoading(false);
  }, [endpoint, payload]);

  return [postData, isInError, isLoading];
};
