import { useState, useEffect } from "react";
import "/src/styles/MemoryGame.css";
import { pokeList } from "../data/list";

export default function MemoryGame() {
  const [images, setImages] = useState({});

  useEffect(() => {
    pokeList.forEach(async (name) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setImages((prev) => ({ ...prev, [name]: data.sprites.front_default }));
    });
  }, []);

  return (
    <>
      <div className="game-container">
        <div className="title">Memory Game</div>
        <div className="score-board">
          <p className="score">Score: </p>
          <p className="best-score">Best score: </p>
        </div>
      </div>

      <div className="card-container">
        {pokeList.map((pokemon) => {
          return <Card imgUrl={images[pokemon]} name={pokemon} key={pokemon} />;
        })}
      </div>
    </>
  );
}

function Card({ imgUrl, name }) {
  return (
    <div className="card-wrapper">
      <div className="card-img">
        {imgUrl ? <img src={imgUrl} alt={name} /> : <p>Loading...</p>}
      </div>
      <div className="card-name">
        <p>{name}</p>
      </div>
    </div>
  );
}
