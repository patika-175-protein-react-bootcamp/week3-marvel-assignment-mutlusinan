import "./App.css";
import img1 from "./img/image1.png";
import img2 from "./img/image2.png";
import topBorder from "./img/topBorder.png";
import border from "./img/border.png";
import loadingGIF from "./img/loadingGIF.gif";
import pageLeftArrow from "./img/pageLeftArrow.png";
import pageRightArrow from "./img/pageRightArrow.png";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // Sayfadaki post sayısı
  const charOnPage = 12;
  // Gösterilen sayfanın numarası
  const [currentPage, setCurrentPage] = useState(1);
  // Kaç adet post atlanacak, offset
  const [offset, setOffset] = useState(0);
  // Sayfayı dolduracak data
  const [characters, setCharacters] = useState([]);
  // Loading ekranını açıp kapama
  const [loading, setLoading] = useState(false);
  let lastPage = 0;

  useEffect(() => {
    console.log("Toplam karakter sayısını çekme");
    // Toplam karakter sayısını çekme
    axios({
      method: "get",
      url: "https://gateway.marvel.com:443/v1/public/characters",
      params: {
        ts: 1,
        apikey: "100adf169f87f5afdb253450abb7bf69",
        hash: "ab70340117414655f7df9485b6ca8836",
      },
    }).then((output) => {
      //Session storage'a yükleme
      sessionStorage.setItem(
        "dataCount",
        JSON.stringify(output.data.data.total)
      );
      // Oluşacak sayfa sayısını hesaplama
      lastPage = Math.ceil(output.data.data.total / charOnPage);
      console.log("Toplam kaç sayfa olacak: ", lastPage);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log("yükleniyor başlangıç", loading);

    if (sessionStorage.getItem(`page${currentPage}`) === null) {
      console.log("if");
      // Offset hesap
      setOffset(currentPage * charOnPage);
      axios({
        method: "get",
        url: "https://gateway.marvel.com:443/v1/public/characters",
        params: {
          limit: charOnPage,
          offset: offset,
          ts: 1,
          apikey: "100adf169f87f5afdb253450abb7bf69",
          hash: "ab70340117414655f7df9485b6ca8836",
        },
      }).then((response) => {
        sessionStorage.setItem(
          `page${currentPage}`,
          JSON.stringify(response.data.data.results)
        );
        setCharacters(response.data.data.results);
      });
      setLoading(false);
      console.log("yükleniyor bitiş", loading);
    } else {
      setCharacters(JSON.parse(sessionStorage.getItem(`page${currentPage}`)));
      console.log("else");
      setLoading(false);
      console.log("yükleniyor bitiş", loading);
    }
    console.log("Sayfa yüklendi");
  }, [currentPage]);

  return (
    <>
      <header>
        <img id="img1" src={img1} alt="image1" />
        <img id="img2" src={img2} alt="image2" />
      </header>
      <div className="container">
        <div id="responsiveImages">
          {characters.map((character) => {
            return (
              <div className="imagesRow" key={character.id}>
                <img className="topBorder" src={topBorder} alt="" />
                <img className="border" src={border} alt="" />
                <img
                  className="imgOnBorder"
                  src={
                    character.thumbnail.path +
                    "/portrait_incredible." +
                    character.thumbnail.extension
                  }
                  alt=""
                />
                <span className="textOnBorder">{character.name}</span>
              </div>
            );
          })}
        </div>
        <div id="pageNmbr">
          {currentPage > 1 && (
            <span id="p1">
              <img
                onClick={() => setCurrentPage(currentPage - 1)}
                src={pageLeftArrow}
                alt="Left Arrow"
              />
            </span>
          )}
          <p>{currentPage}</p>
          {
            <span id="p9">
              <img
                onClick={() => setCurrentPage(currentPage + 1)}
                src={pageRightArrow}
                alt="Right Arrow"
              />
            </span>
          }
        </div>
      </div>
      {
        /*Loading screen*/
        loading && (
          <div className="loading">
            <img src={loadingGIF} alt="loading"></img>
          </div>
        )
      }
    </>
  );
}

export default App;
