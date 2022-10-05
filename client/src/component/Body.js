import React, { useState, useEffect }  from 'react';
import styles from './Body.module.css';
import Word from './Word.js'
import Calender from './Calender';


function Body() {
    // 날짜 관리를 위한 변수 생성
    const [date, setDate] = useState(new Date());

    // Recent Word에 출력할 데이터 담을 변수 생성
    const [List, setList] = useState([{
        id: '',
        month: '',
        day: '',
        word: '',
        mean: '',
        folder: ''
    }]);
    
    const today = new Date();

    // 실시간으로 계속 추가된 데이터나 수정된 데이터 업데이트 할 수 있도록 useEffect 함수 활용
    useEffect(() => {
        async function LandingPage() {
            // GET 메소드로 request를 서버에 전송
            var response = await fetch('/select', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // text 형식으로 전달된 데이터(실제로는 JSON)를 다시 JSOn 형태로 변경
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


        

    const prevMonth = () => {
        let date2 = new Date(date);
        date2.setMonth(date.getMonth() - 1);
        setDate(date2);
        console.log(date.getMonth());
    }; // 이전달로 State값 수정
    const nextMonth = () => {
        let date3 = new Date(date);
        date3.setMonth(date.getMonth() + 1);
        setDate(date3);
        console.log(date.getMonth());
    }; //다음달로 State값 수정
    const goToday = () => {
        setDate(new Date());
        console.log(date.getMonth());
    }; //오늘 날짜로 State값 수정

    /**
     * Recent Word 출력을 위해 서버에서 받아온 전체 데이터를 필터링
     * getDate()에서 8을 뺀 이유는 예를 들어 금요일 기준 지난 금요일을 포함하여 출력하기 위함
     */
    var List2 = List.filter((pro) => pro.month === today.getMonth()+1 && pro.day > today.getDate()-8
     && pro.day <= today.getDate()).map((pro) => (
        <Word mean = {pro.mean} word = {pro.word} id = {pro.id} key={pro.id} folder={pro.folder}/>
    ));

    // 필터링에 해당되는 데이터가 없는 경우 대체 메시지 출력
    if(List2.length === 0) {
        List2 = "최근 1주일 간 추가된 단어가 없습니다.";
    }

        return (
            <>
                <div className={styles.calender}>
                    
                    <h1 className={styles.h1}>Word Calender</h1>
                    <div className={styles.todays}>{today.getFullYear()}년 {today.getMonth()+1}월
                        {today.getDate()}일</div>
                    <div className={styles.header}>
                        
                    <div className={styles.nav}>
                            <button className={styles.navbtn} onClick={prevMonth}>&lt;</button> {/* 이전달로 이동*/ }
                            <button className={styles.gotoday} onClick={goToday}>Now</button> {/* 현재 날짜로 이동*/ }
                            <button className={styles.navbtn} onClick={nextMonth}>&gt;</button> {/* 다음달로 이동*/ }
                            </div>
                    </div>
                    <Calender month={date.getMonth()} /> {/* Calender에 date State값 전달*/ }
                </div>
                <div className={styles.recentWord}  id="recentPart">
                    <div className={styles.recent}>Recent Word</div>
                    {List2}
                </div>
            </>
        );

}

export default Body;