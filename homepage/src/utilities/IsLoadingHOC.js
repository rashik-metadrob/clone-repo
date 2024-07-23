import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  load
} from '../features/Slices/loaderSlice.js';



const withLoader = (WrappedComponent) => {
  const WithLoader = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
      // Simulating an asynchronous operation
      dispatch(load());


    }, [dispatch]);

    return (
      <>
        <WrappedComponent {...props} /> {/* Render the wrapped component */}
      </>
    );
  };

};

export default withLoader;
