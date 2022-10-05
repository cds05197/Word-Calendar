import { useNavigate, useLocation } from "react-router-dom";
import Word from "./Word";
import styles from "./Wordlist.module.css";
import React, { useState, useEffect } from 'react';
function Wordlist() {
    let navigate = useNavigate();
    const location = useLocation();
    let month;
    let day;
    let locFolder;      // 이 변수에 저장된 폴더명과 폴더명이 동일한 데이터만 출력하기 위함 (폴더에 들어간 효과)
    const [List, setList] = useState([{
        id: '',
        month: '',
        day: '',
        word: '',
        mean: '',
        folder: ''
      }])

    function goHome() {
        navigate('/');
    }

    function goBack () {
        navigate(-1);
    }
    function goInsert () {
        navigate('/insert', {state : {
            month,
            day
        }});
    }
    // location 존재 여부 파악
    if (location.state !== 'undefined' && location.state !== null)
    {
       month = location.state.month;
       day = location.state.day;
       locFolder = location.state.folder;
    }
    else
    {
        month = 1;
        day = 1;
    }

    useEffect(() => {
        async function LandingPage() {
            // GET 메소드로 request를 서버에 전송
            var response = await fetch('/select', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          var body = await response.text();
          body = JSON.parse(body);
          const inputData = body.map((Data) => ({
                  id : Data.id,
                  month : Data.month,
                  day : Data.day,
                  word : Data.word,
                  mean : Data.mean,
                  folder : Data.folder
          }
          ))
          setList(inputData);
          return 0;
      }
      LandingPage();
      })


    /**
     * Word 컴포넌트에서 폴더를 클릭했을 경우. 해당 컴포넌트의 폴더명을 담아 리렌더링하는데 그 폴더명이
     * location.state.folder에 담겨있다.
     * 최상위 폴더에서만 해당 값이 undefined인 상태이기 때문에 location.state.folder가 undefined인 경우에만 폴더로 Word 컴포넌트를 생성한다.
     */
    const Foli = List.filter(pro => pro.month === month && pro.day === day && pro.folder !== "" && location.state.folder == undefined).map((pro) => (
        <Word mean = {"폴더"} folder = {pro.folder} id = {pro.id} key={pro.id} month={pro.month} day={pro.day} />
    ));
    

    /**
     *  데이터마다 폴더명이 저장되어 있는데 new folder라는 값을 가진 데이터가 2개인 경우 같은 폴더를 두 번 출력한다.
     * 따라서 데이터의 folder 값을 valArr에 담고 중복되는 값인 경우에는 valArrIdx에 index를 넣고 후에 splice로 처리한다.
     */
    var valArr = [];
    var valArrIdx = [];

    // 폴더 중복 제거
    Foli.map((pro, idx) => {
        if(valArr.indexOf(pro.props.folder) === -1) {
            valArr.push(pro.props.folder);
        } else {
            valArrIdx.push(idx);
        }
    });

    valArrIdx.forEach(idx => {
        Foli.splice(idx, 1);
    });

    if(locFolder === undefined) {
        locFolder = "";
    }

    // 현재 폴더명과 일치하는 데이터만 필터링
    const List2 = List.filter(pro => pro.month === month && pro.day === day && pro.folder === locFolder).map((pro) => (
        <Word mean = {pro.mean} word = {pro.word} id = {pro.id} key={pro.id} folder={pro.folder}/>
    ));



    return(
      <div className={styles.container}>
          <h1>{month}월{day}일 단어 목록</h1>
          <div>
            <button className={styles.goback} onClick={goBack}>뒤로가기</button>
            <button className={styles.home} onClick={goHome}>홈으로</button>
            <button className={styles.add} onClick={goInsert}>단어 추가</button>
          </div>
        <div className={styles.wordcontainer}>
            <div className={styles.cate}>
                <span>단어</span>
                <span>뜻</span>
                <span>
                수정 / 삭제</span>
            </div>
            {Foli}
            {List2}
            
        </div>

      </div>
    );
}

export default Wordlist;