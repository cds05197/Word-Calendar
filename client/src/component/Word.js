import styles from "./Word.module.css";
import {useNavigate} from 'react-router-dom';

function Word (props) {
     
    const navigation = useNavigate();

    // 수정 시 이전 폴더명을 나타내기 위해 folder를 db제어를 위해 id 전달
    function goUpdate () {
        navigation('/update', {state : {
            id : props.id,
            folder : props.folder
        }});
    }

    async function goDelete () {

        var date = {
            id : props.id
        };

        
        // 데이터를 전환하여 전달
        var response = await fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(date)
        });
        var body = await response.text();
        console.log(body);
        alert("단어를 삭제했습니다.");

    }
    

    function folderClick () {
        navigation('/list', {state : {
            folder : props.folder,
            month : props.month,
            day: props.day
        }});
    }

    // Wordlist.js에서 mean={"폴더"}로 하드코딩 된 것은 단어와 다른 컴포넌트 형태로 출력하기 위해 제어
    if(props.mean === "폴더") {
        return (
            <div className={styles.word}>
                <span>{props.folder}</span>
                <span>{props.mean}</span>
                <span><button className={styles.folder} onClick={folderClick}>이동</button></span>
            </div>
        )
    }
    return(
        <div className={styles.word}>
            <span>{props.word}</span>
            <span>{props.mean}</span>
            <span>
            <button className={styles.update} onClick={goUpdate}>수정</button><button className={styles.remove} onClick={goDelete}>삭제</button></span>
        </div>
    );
}
export default Word;