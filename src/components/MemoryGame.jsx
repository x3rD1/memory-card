import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "/src/styles/MemoryGame.css";
import { pokeList } from "../data/list";
//To prevent motion from being undefined
console.log(motion);

function shuffledList(list) {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MemoryGame() {
  const [images, setImages] = useState({});
  const [shuffled, setShuffled] = useState(shuffledList(pokeList));
  const [seen, setSeen] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  //Fetch images once
  useEffect(() => {
    pokeList.forEach(async (name) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setImages((prev) => ({ ...prev, [name]: data.sprites.front_default }));
    });
  }, []);

  function reshuffle() {
    setShuffled(shuffledList(pokeList));
  }

  function compare(key) {
    if (!seen.includes(key)) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        setBestScore((prevBest) => Math.max(prevBest, newScore));
        return newScore;
      });
    } else {
      setScore(0);
      setSeen([]);
    }
  }

  // Win condition
  if (bestScore === pokeList.length) {
    alert("Congratulations, You remembered it all!");
    // Reset scores
    setScore(0);
    setBestScore(0);
    setSeen([]);
  }

  function handleClick(key) {
    setSeen((prev) => [...prev, key]);
    compare(key);
    reshuffle();
  }
  return (
    <>
      <div className="game-container">
        <div className="title">Memory Game</div>
        <div className="score-board">
          <p className="score">Score: {score}</p>
          <p className="best-score">Best score: {bestScore}</p>
        </div>
      </div>

      <div className="card-container">
        <AnimatePresence>
          {shuffled.map((pokemon) => {
            return (
              <motion.div
                key={pokemon}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  imgUrl={images[pokemon]}
                  name={pokemon}
                  handleClick={handleClick}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}

function Card({ imgUrl, name, handleClick }) {
  return (
    <div className="card-wrapper" onClick={() => handleClick(name)}>
      <div className="card-img">
        {imgUrl ? <img src={imgUrl} alt={name} /> : <p>Loading...</p>}
      </div>
      <div className="card-name">
        <p>{name}</p>
      </div>
    </div>
  );
}
