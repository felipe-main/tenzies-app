import "./App.css";
import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [diceState, setDiceState] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false); //boolean value to check if game is won or not
  const [gameData, setGameData] = React.useState({
    diceRolls: 0,
    startTime: Date.now(),
    timePlayedSeconds: "",
  }); //data to track how many rolls and time played

  React.useEffect(
    function () {
      const allHeld = diceState.every((die) => die.isHeld);
      const firstValue = diceState[0].value;
      const allSame = diceState.every((die) => firstValue === die.value);
      //check if game is won or not
      if (allHeld && allSame) {
        setTenzies(true);
        setGameData((prevData) => ({
          ...prevData,
          timePlayedSeconds: (Date.now() - prevData.startTime) / 1000,
        }));
      }
    },
    [diceState]
  );

  React.useEffect(
    //save gameData to localstorage
    function () {
      localStorage.setItem("gameData", JSON.stringify(gameData));
    },
    [tenzies]
  );

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 2) + 1,
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    //initialize all dice
    let dice = [];
    for (let i = 0; i < 10; i++) {
      dice.push(generateNewDie());
    }
    return dice;
  }

  function rollDice() {
    if (!tenzies) {
      //if the game is stilll running, generate new dice for unheld ones and increase roll
      setDiceState((dice) =>
        dice.map((die) => {
          return !die.isHeld ? generateNewDie() : die;
        })
      );
      setGameData((prevData) => ({
        ...prevData,
        diceRolls: prevData.diceRolls + 1,
      }));
    } else {
      //if the game is won, then restart game
      setDiceState(allNewDice());
      setTenzies(false);
    }
  }

  function holdDice(id) {
    //if die is clicked, then change isHeld.
    setDiceState((dice) => {
      return dice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      );
    });
  }
  
  //generate die elements
  const diceElements = diceState.map((die) => (
    <Die key={die.id} holdDice={() => holdDice(die.id)} {...die} />
  ));

  return (
    <div className="App">
      {tenzies && <Confetti />}
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button onClick={rollDice} className="roll-dice">
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  );
}

export default App;
