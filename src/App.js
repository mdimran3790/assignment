import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import Board from "./components/Board/Board"; 

function App() {
  const [data, setData] = useState(reactLocalStorage.getObject("data"));

  // useEffect(() => {
  //   function fetchData() { 
  //     fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
  //       .then((response) => response.json())
  //       .then((result) => {
  //         // setData(result);
  //         // console.log(result);
  //         // const localData = reactLocalStorage.getObject("data");
  //         if (Object.keys(data).length === 0) {
  //           reactLocalStorage.setObject("data", result);
  //           setData(result);
  //         }
  //         // else {
  //         //   setData(localData);
  //         // }
  //       })
  //       .catch((error) => console.log(error));
  //   }
  //   fetchData();
  // }, []);
  return (
    <>
      {/* <Board data={data} setData={setData} /> */}
      <Board />
    </>
  );
}

export default App;
