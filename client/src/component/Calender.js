import styles from './Calender.module.css';
import { useNavigate } from "react-router-dom";
 function Calender(props) {


        let navigate = useNavigate();
        const date = new Date() // date 객체 생성
        date.setMonth(props.month)
        // 전달받은 month 값으로 Date객체 변경
        let viewYear = date.getFullYear();
        let viewMonth = date.getMonth();
        let prevLast = new Date(viewYear, viewMonth, 0);
        let thisLast = new Date(viewYear, viewMonth + 1, 0);
        let PLDate = prevLast.getDate();
        let PLDay = prevLast.getDay();
        let TLDate = thisLast.getDate();
        let TLDay = thisLast.getDay();
        let prevDates = [];
        let thisDates = [...Array(TLDate + 1).keys()].slice(1);
        let nextDates = [];
        if (PLDay !== 6) {
            for (let i = 0; i < PLDay + 1; i++){
                prevDates.unshift(PLDate - i);
            }
        }
        for (let i = 1; i < 7 - TLDay; i++) {
            nextDates.push(i);
        }
        let dates = prevDates.concat(thisDates, nextDates);
        const firstDateIndex = dates.indexOf(1);
        const lastDateIndex = dates.lastIndexOf(TLDate);
        // 달력 생성
         dates.forEach((data, i) => {
                    function golist() {
                        navigate('/list', { state : {
                            month : date.getMonth() + 1,
                            day : data
                        }}); // div 클릭시 데이터 가지고 Word list 페이지로 이동
                    }

                    const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other'; 

                    dates[i] = <div className={styles.date} key={i} onClick={golist}
                    ><span className={condition}>{data}</span></div>;

                    
}
            )
        
                
                
                
        

    return (
     <>
        <div className={styles.header}>
                <div className={styles.yearmonth}>{viewYear}년 {viewMonth+1}월</div>
            </div>
            <div className='main'>
                <div className={styles.days}>
                    <div className={styles.day}>일</div>
                    <div className={styles.day}>월</div>
                    <div className={styles.day}>화</div>
                    <div className={styles.day}>수</div>
                    <div className={styles.day}>목</div>
                    <div className={styles.day}>금</div>
                    <div className={styles.day}>토</div>
                </div>
                <div className={styles.dates}>
                    {dates}
                </div>
            </div>
     </>
    );

}

export default Calender;