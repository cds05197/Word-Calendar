import styles from "./Insert.module.css"
import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

export default function Insert() {

    const [Word, setWord] = useState();
    const [Mean, setMean] = useState();
    const [Folder, setFolder] = useState("");   // 선언 시 "" 공백으로 넣어주지 않으면 값이 입력되지 않았을 때 undefined 출력


    // onChange 함수 -> 공통적으로 현재 value 값을 각 변수에 담아줌
    const onMeanHandler = (e) => {
        setMean(e.currentTarget.value);
    }
    const onWordHandler = (e) => {
        setWord(e.currentTarget.value);
    }
    const onFolderHandler = (e) => {
        setFolder(e.currentTarget.value);
    }


    const navigate = useNavigate();
    /**
     * useLocation을 통해 url 정보(json타입)를 가져온다.
     * 해당 데이터 안에 state 변수에서 필요한 변수를 가져와 쓸 수 있도록 함.
     */
    const location = useLocation();
    let Month;
    let Day;

    if (location.state !== 'undefined' && location.state !== null)
    {
       Month = location.state.month;
       Day = location.state.day;
    }
    else
    {
        Month = 1;
        Day = 1;
    }



    /**
     * 입력된 데이터를 받아 지정된 정합성 검사 로직을 거친 후 server로 전달
     */
    async function submit() {
        let month = Month;
        let day = Day;
        let word = Word;
        let mean = Mean;
        let folder = Folder;

        let acclist = [Word, Mean, Folder];
        
        // 폴더명에 특수문자 입력을 방지하기 위한 정규 표현식
        var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

        for (let i = 0; i < acclist.length; i++) {  
            if (!acclist[i] && i != 2)
            {
                alert("빈칸 없이 작성해주세요");
                return false;
            }
            
            // 최초 Folder useState 시 공백을 입력하지 않으면 match라는 함수를 찾을 수 없어 오류가 발생
            if ( acclist[i].match(reg) != null ) {
                alert("폴더명에는 특수기호 입력이 불가합니다.");
                return false;
            }
        }
        
        

        let content = {
            month,
            day,
            word,
            mean,
            folder
        }

        // 정제한 데이터는 JSON 형식이기 때문에 text형태로 전환 후 body에 작성
        var response = await fetch('/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content)
        });

        // await은 해당 동작이 처리된 후에 다음 로직을 수행하기 위함.
        var body = await response.text();

        console.log(body);

        alert(month + "월"+ day + "일에 단어가 추가되었습니다.");
        // insert 페이지 이전으로 이동
        navigate(-1);
    }

    function cancel() {
        navigate(-1);
    }
    
        return(
            <div className={styles.back}>
                <div className={styles.login}>
                <div className={styles.topzone}>
                   <h1 className={styles.title}>
                       단어 추가
                   </h1>
                </div>
                    <input type="text" id="folder" className={styles.input} onChange={onFolderHandler} placeholder="폴더명" />
                    <input type="text" id="word" className={styles.input}
                    onChange={onWordHandler}placeholder="단어"  />
                    <input type="text" id="mean" className={styles.input} onChange={onMeanHandler} placeholder="뜻"  />
                    <button className={styles.btn} onClick={submit}>
                        추가
                    </button>
                    <button className={styles.btn} onClick={cancel}>
                        취소
                    </button>
                </div>
            </div>
        );
    }