//이미지 랜덤 생성
async function setRenderBackground()  // 랜덤이미지 가져오기
{
    const result = await axios.get("https://picsum.photos/1920/1080", {
        responseType: "blob"
        //blob은 미가공된 데이터를 텍스트와 이진 데이터로 변환
    });

    //console.log(result.data);
    const data = URL.createObjectURL(result.data)
    //주어진 객체를 가리키는 URL를 domString으로 변환

    //console.log(data);
    document.querySelector("body").style.backgroundImage = `url(${data})`;
}

//시간 설정
function setTime() {
    const timer = document.querySelector(".timer");
    const timerContent = document.querySelector(".timer-content");

    // const times = new Date().toLocaleTimeString().split(" ")[1];
    setInterval(() => {
        const date = new Date();
        let seconds;
        if (date.getSeconds() < 10) seconds = "0" + date.getSeconds();
        else seconds = date.getSeconds();
        let minute;
        if (date.getMinutes() < 10) minute = "0" + date.getMinutes();
        else minute = date.getMinutes();
        timer.textContent = `${date.getHours()}:${minute}:${seconds}`;
        if (date.getHours() >= 12) timerContent.textContent = "Good evening, huiwon!";
        else timerContent.textContent = "Good moring, huiwon!";
    }, 1000);

}

//입력 받기
function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    //memo.textContent = memoValue;

    // ------------------------------------------------//
    if (memoValue) {
        let index = 0;
        const data = (localStorage.getItem("todo")).split('/');
        data.forEach(() => { index += 1; })
        console.log(index);
        let test_memo = "";
        for (let i = 1; i <= Number(index); ++i) {
            test_memo += `${i}.${data[i - 1]} `
        }
        console.log(test_memo)
        memo.textContent = test_memo;
    }

}

function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", function (e) {
        if (e.code === "Enter") {
            //localStorage.setItem("todo", e.target.value);
            updateMemo(e.target.value);
            getMemo();
            memoInput.value = "";
            e.code = "";
        }
    })
}

function deleteMemo() {
    document.addEventListener("click",
        function (e) {
            if (e.target.classList.contains("memo")) {
                localStorage.removeItem("todo");
                localStorage.removeItem("index");
                e.target.textContent = "";
            }
        })
}

function updateMemo(value) {
    if (value == "") return;
    if (localStorage.getItem("todo") != null) {

        const todo = localStorage.getItem("todo") + '/' + value;
        localStorage.setItem("todo", todo)
        return;

    }
    else {
        localStorage.setItem("todo", value);
        return;
    }

}

// 날씨 함수

// 위치를 얻고
function getposiotion(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}
// 해당 위치의 날씨를 얻는다.
async function getWeatehr(lat, lon) {

    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=27b0235aad047977221b27b738f22dd5`)
        //console.log(data);
        return data;
    }
    else { const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=2719e331e07a6af0547cfe7df2754c8c"); }

}
// 날씨 데이터 가공
async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const postioion = await getposiotion();
        latitude = postioion.coords.latitude;
        longitude = postioion.coords.longitude;
    }
    catch {

    }

    const result = await getWeatehr(latitude, longitude);
    const weatherdata = result.data;
    //  console.log(weatherdata.list);
    //  배열이 많아 오전,오후만 남길 수 있는 로직을 짬
    //  5일치 데이터를 가져온다.
    const weatherList = weatherdata.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) {
            acc.push(cur);
        }
        return acc;
    }, [])
    //  console.log(weatherList);
    const modalbody = document.querySelector(".modal-body");
    modalbody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    }).join("");

    const todayWeather = matchIcon(weatherList[0].weather[0].main);
    const modalbuttonImage = document.querySelector(".modal-button");
    modalbuttonImage.style.backgroundImage = `url("${todayWeather}")`;
}

// 날씨 데이터 출력
function weatherWrapperComponent(e) {
    // console.log(e.main.temp);
    // const data = e.main.temp
    // const changeToCelsius = (data) => { (data - 273.15) }
    // console.log(data);
    const changeToCelsius = (temp) => ((temp - 273.15)).toFixed(1);
    return `
    <div class="card" style="width: 18rem; ">
        <div class="card-header text-center">
        ${e.dt_txt.split(" ")[0]}
        </div>
            <div class="card-body">
            
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
            <h5>${e.weather[0].main}</h5>
                <p class="card-text"style="font-weight:bold" >${changeToCelsius(e.main.temp)}&deg</p>
            </div>
    </div>
    `
}

// 날씨 이미지
function matchIcon(wheaterData) {
    if (wheaterData === "Clear") return "./Img/weather/039-sun.png"
    if (wheaterData === "Clouds") return "./Img/weather/001-cloud.png"
    if (wheaterData === "Rain") return "./Img/weather/003-rainy.png"
    if (wheaterData === "Snow") return "./Img/weather/006-snowy.png"
    if (wheaterData === "Thunerstorm") return "./Img/weather/008-storm.png"
    if (wheaterData === "Drizzle") return "./Img/weather/031-snowflake.png"
    if (wheaterData === "Atomsphere") return "./Img/weather/033-hurricane.png"

}


// 실행문
renderWeather();

setTime();

getMemo();
setMemo();
deleteMemo();

setRenderBackground();
setInterval(() => {
    setRenderBackground();
}, 5000);



