import { useEffect, useState } from 'react';

export const useFirebaseApi = (
  initialRef,
  initialState,
  transformDataForState
) => {
  const [data, setData] = useState(initialState);
  const [ref, setRef] = useState(initialRef);
  useEffect(() => {
    const fetchData = async () => {
      const result = await ref.once('value');
      const transformedData = transformDataForState(result);
      setData(transformedData);
    };
    fetchData();
  }, [ref]);

  return [data, setRef];
};
