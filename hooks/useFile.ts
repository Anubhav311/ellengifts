// import React, { useState, useEffect } from "react";

// export interface IuseFileProps {}

// export default function useFile(props: IuseFileProps) {
//   const [state, setState] = useState<State>(memoryState);

//   useEffect(() => {
//     listeners.push(setState);
//     return () => {
//       const index = listeners.indexOf(setState);
//       if (index > -1) {
//         listeners.splice(index, 1);
//       }
//     };
//   }, [state]);

//   return {
//     ...state,
//     toast,
//     dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
//   };
// }
