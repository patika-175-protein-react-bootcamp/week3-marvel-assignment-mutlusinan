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
  // Son sayfa
  const [lastPage, setLastPage] = useState(0);
  // Pagination'daki sayfa sayıları

  //Sayfalar
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(2);
  const [page3, setPage3] = useState(3);
  const [page4, setPage4] = useState(4);
  const [page5, setPage5] = useState(5);
  const [page6, setPage6] = useState(6);
  const [page7, setPage7] = useState(7);
  const [pages, setPages] = useState([
    page1,
    page2,
    page3,
    page4,
    page5,
    page6,
    page7,
  ]);

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
      // Oluşacak sayfa sayısını hesaplama
      setLastPage(Math.ceil(output.data.data.total / charOnPage -1));
    });
    //Session storage'a yükleme
    console.log("Last pagedir bu: ", lastPage);
    sessionStorage.setItem("lastPage", lastPage);
  }, [lastPage]);

  useEffect(() => {
    console.log("Şu anki sayfa: ", currentPage);
    setPage1(1);
    if (currentPage < 5) {
      setPage2(2);
    } else {
      setPage2("...");
    }
    if (currentPage < 5) {
      setPage3(3);
    } else {
      setPage3(currentPage - 1);
    }
    if (currentPage < 5) {
      setPage4(4);
    } else {
      setPage4(currentPage);
    }
    if (currentPage < 4) {
      setPage5("...");
    } else {
      setPage5(currentPage + 1);
    }
    if (currentPage < 5) {
      setPage6();
    } else {
      setPage6("...");
    }
    setPage7(lastPage);
    setPages([page1, page2, page3, page4, page5, page6, page7]);
  }, [currentPage]);

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
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
                src={pageLeftArrow}
                alt="Left Arrow"
              />
            </span>
          )}
          {pages.map((page, index) => {
            return (
              <span
                key={index}
                className={page === currentPage ? "centerNmbr" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </span>
            );
          })}
          {/* <p>{currentPage}</p> */}
          {
            <span id="p9">
              <img
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
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
