import bookModalReducer, {
  toggle,

} from './bookModalSlice';

describe('bookmodal reducer', () => {
  const initialState = {
    status: flase,

  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      status: false
    });
  });

  it('should handle toggle', () => {
    const actual = counterReducer(initialState, toggle());
    expect(actual.value).toEqual(true);
  });

});
