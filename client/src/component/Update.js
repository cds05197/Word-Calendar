import styles from "./Insert.module.css"
import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

export default function Update() {

    const [Word, setWord] = useState();
    const [Mean, setMean] = useState();
    const [Folder, setFolder] = useState();
    const [List, setList] = useState([{
        id: '',
        month: '',
        day: '',
        word: '',
        mean: '',
        folder: ''
      }]);

    // 수정된 값 변수에 담기
    const onFoldHandler = (e) => {
        setFolder(e.currentTarget.value);
    }

    const onMeanHandler = (e) => {
        setMean(e.currentTarget.value);
    }
    const onWordHandler = (e) => {
        setWord(e.currentTarget.value);
    }

    const navigate = useNavigate();
    const location = useLocation();     // url 정보의 state에서 매개변수를 가져오기 위해 사용

    let Id;         // 데이터를 DB에서 컨트롤하기 위한 변수
    let prev;       // 수정 전 폴더명을 placeholder로 출력하기 위한 변수 ==> 이전 폴더명
    if (location.state !== 'undefined' && location.state !== null)
    {
       Id = location.state.id;
       prev = location.state.folder;
    }
    else
    {
       Id = 1;
    }

    // 전체 데이터를 select 해오기 위한 함수 useEffect에 구현 -> 변경 사항을 계속 업데이트 및 렌더링
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
                  mean : Data.mean
          }
          ))
          setList(inputData);
          return 0;
      }
      LandingPage();
      },[])
    



    let Thisword; 
    List.filter(pro => pro.id === Id).map((pro) => (
        Thisword = pro
    ));

    async function submit() {
        let id = Id;
        let word = Word;
        let mean = Mean;
        let folder = Folder;
        let month = Thisword.month;
        let day = Thisword.day;

        // 수정 후 저장할 때 뒤로 갈 횟수를 지정 -> 이유는 이 함수의 뒷 부분
        let back = -1;

        // 폴더명에 특수문자 입력 방지를 위한 정규 표현식
        var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;


        // Insert.js에서 useState 선언 부에 공백으로 초기화한 이유
        // 이후 undefined로 인한 오류 제어를 위해서 undefined로 읽히는 경우 초기화
        if(Folder === undefined) {
            setFolder("");
        }

        let acclist = [Word, Mean, Folder];
        for (let i = 0; i < acclist.length; i++) {  
            // 폴더명은 빈 칸으로 작성하는 경우 최상위 폴더로 제어하기 위해 명시적으로 하드코딩
            if (!acclist[i] && i != 2)
            {
                alert("빈칸 없이 작성해주세요");
                return false;
            }

            if ( acclist[i].match(reg) != null ) {
                alert("폴더명에는 특수기호 입력이 불가합니다.");
                return false;
            }
        }

        let content = {
            id,
            month,
            day,
            word,
            mean,
            folder
        }
        // json은 스트링으로 body에 작성 후 메소드와 헤더를 지정하여 요청 전송
        var response = await fetch('/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content)
        });
        var body = await response.text();

        // 응답받은 데이터 JSON 타입으로 전환
        body = JSON.parse(body);
        console.log(body);
        alert("단어를 수정했습니다.");

        /**
         * 하나의 폴더에 하나의 단어만 들어있는 경우 폴더명을 수정하게 되는 경우 제어
         * 그럴 경우 location으로 읽어온 폴더명과 현재 폴더명이 다르기 때문에 두 페이지 뒤로.
         * 
         * 단어가 하나인 폴더에서 폴더명이 변경되면 해당 폴더명에는 아무 데이터도 없기 때문에 최상위로 이동
         * (폴더는 자동 제거)
         */
        if(prev !== folder) {
            back = -2;
        }
        navigate(back);
    }

    function cancel() {
        navigate(-1);
    }

        return(
            <div className={styles.back}>
                <div className={styles.login}>
                <div className={styles.topzone}>
                   <h1 className={styles.title}>
                       단어 수정
                   </h1>
                </div>
                    <input type="text" id="mean" className={styles.input} onChange={onFoldHandler} placeholder={"현재폴더명 \""+prev+"\""}/>
                    <input type="text" id="word" className={styles.input}
                    onChange={onWordHandler} placeholder={"단어"}    />
                    <input type="text" id="mean" className={styles.input} onChange={onMeanHandler} placeholder={"뜻"}/>
                    <button className={styles.btn} onClick={submit}>
                        수정
                    </button>
                    <button className={styles.btn} onClick={cancel}>
                        취소
                    </button>
                </div>
            </div>
        );
    }