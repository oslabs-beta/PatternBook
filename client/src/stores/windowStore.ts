import { create } from 'zustand';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

const useWindowDimensionsStore = create((set) => ({
  ...getWindowDimensions(),
  initListener: () => {
    function handleResize() {
      set(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },
}));


export default useWindowDimensionsStore;



  // const initListener = useWindowDimensionsStore((s:any) => s.initListener);
  // useEffect(() => {
  //   const cleanup = initListener();
  //   return cleanup;

  // }, []); 


  //       const {width, height } = useWindowDimensionsStore((s:any) => ({
  //   width: s.width,
  //   height: s.height,
  // }))


  //   <p>{width} x {height} </p>