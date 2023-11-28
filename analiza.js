var startArticle = 0;
var endArticle = 3;
var number = endArticle;
var articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';


// liczenie komentarzy
const comments = (komentarze) => { 
    if (/^[0-9]+$/.test(komentarze)) return komentarze;

    if (typeof komentarze === 'undefined') return parseInt(0);
    else {
        console.log("komentarze l", komentarze.length);
        return parseInt(komentarze.length);
    }
}


// wyświetlanie HTML 
const to_html_booder = (json2, a) => {
    let wynik = '<div class="post" id="div' + (a + 1) + '"><p class="ID_posta">ID: <span id="wynik_ID">' + (a + 1) + '</span>';
    wynik += '<p class="tytul_posta">';
    wynik += '<span id="tytul_posta">tytul: ' + json2.title + '</span></p>';
    wynik += '<img class="triangle0" id="triangle' + (a + 1) + '" src="obrazki/white_triangle.png" onclick="imageChange(' + (a + 1) + ')" style="width: 15px;">&emsp;';
    wynik += '<p class="link_posta"><span id="link_posta">';
    if (typeof json2.url == 'undefined') {
        wynik += '<a href="#">brak</a>';
    } else {
        wynik += '(<a href="' + json2.url + '">link</a>)';
    }
    wynik += '</span></p><br>';
    wynik += '<button class="btn btn-secondary" id="hide" onclick="hide(' + (a + 1) + ')">hide</button>&emsp;';
    wynik += '<p class="wynik_posta"><span id="wynik_posta">wynik: ' + json2.score + '</span></p>';
    wynik += '<p class="autor_posta"><span id="autor_posta">autor: ' + json2.by + '</span></p>';
    wynik += '<p class="data_posta"><span id="data_posta">' + timeAgo(Date.now() / 1000 - json2.time) + '</span></p>';
    wynik += '<p class="ilosc_komment"><span id="ilosc_komment">komentarzy: ' + comments(json2.kids) + '</span></p>';
    document.getElementById('booder').innerHTML += wynik;


    // wyswietlanie statystyk 
    statisticHowMany(json2.score, 'statystyka_1');
    statisticHowMany(comments(json2.kids), 'statystyka_2');
    localChanges('statystyka_3', 'img.triangle1');
    localChanges('statystyka_4', 'div.hidden');
    numberInString(json2.title, 'statystyka_5');
};


// wyswietlanie najnowszych postów
const showPosts = (start, howMany, url) => {
    document.getElementById('booder').innerHTML = "";
    fetch(url)
        .then(response => response.json())
        .then(async json => {
            for (var a = start; a < howMany; a++) {
                let x = json[a];
                await fetch('https://hacker-news.firebaseio.com/v0/item/' + x + '.json?print=pretty')
                    .then(response2 => response2.json())
                    .then(json2 => {
                        to_html_booder(json2, a);
                    })
            }
        document.getElementById('statistics').style.display = 'block';
        })
}


// sprawdzanie, czy w napisie jest cyfra i jak jest wywołanie funkcji
const numberInString = (title, statisticID) => {
    let num = /\d/.test(title);
    if (num) {
        statisticHowMany(1, statisticID);
    }
}


// zliczanie liczb w tytule i liczby komentarzy 
const statisticHowMany = (score, statisticID) => { 
    var numm = 0;
    numm += score;
    const element = document.getElementById(statisticID);
    const currentValue = parseInt(element.innerHTML) || 0; // Jeśli parseInt zwraca NaN, zwróć 0
    element.innerHTML = currentValue + numm;
    return currentValue + numm;
}


// liczenie ile jest trójkątów zaznaczonych lub schowanych postów
const localChanges = (statisticID, selector) => {
    const sth = document.querySelectorAll(selector);
    const count = sth.length;
    document.getElementById(statisticID).innerHTML = parseInt(count);
}


// resetowanie danych statystykom
const resetStatistics = () => { 
    document.getElementById('statystyka_1').innerHTML = "";
    document.getElementById('statystyka_2').innerHTML = "";
    document.getElementById('statystyka_3').innerHTML = "";
    document.getElementById('statystyka_4').innerHTML = "";
    document.getElementById('statystyka_5').innerHTML = "";
}


// zmiana obrazka po kliknieciu - polubienia
const imageChange = (number) => { 
    var image = document.getElementById('triangle' + number);
    if (image.className == 'triangle0') {
        image.src = "obrazki/green_triangle.png";
        image.className = "triangle1";
        localChanges('statystyka_3', 'img.triangle1');
        return;
    } else {
        image.src = "obrazki/white_triangle.png";
        image.className = "triangle0";
        localChanges('statystyka_3', 'img.triangle1');
    }
}


// ukrywanie kodu za pomocą kliknięcia przycisku
const hide = (divID) => {
    var div = document.getElementById('div' + divID);
    div.className = 'hidden';
    div.style.display = 'none';
    localChanges('statystyka_4', 'div.hidden');
}


// pokazywanie dalej postów po kliknieciu w przycisk
const showMore = () => { 
    document.getElementById('statistics').style.display = 'none';
    resetStatistics();
    document.getElementById("booder").innerText = "";
    startArticle = endArticle;
    endArticle += number;
    document.getElementById('statystyka_3').innerHTML = "";
    showPosts(startArticle, endArticle, articleUrl);
}


// wyswietlenie tylu postów ile napiszesz
const howManyNews = async () => { 
    amount = document.getElementById('amountNewsy').value;
    var good = 1;
    await fetch('https://hacker-news.firebaseio.com/v0/newstories.json?')
        .then(response => response.json())
        .then(async json => {
            if (amount < 1 || amount > json.length) {
                alert('Wybierz ilosc newsow od 1 do ' + json.length);
                good = 0;
                document.getElementById("booder").innerText = "";
                return;
            }
        });
    if (good == 1) {
        document.getElementById('statistics').style.display = 'none';
        resetStatistics();
        amount = parseInt(amount);
        number = amount;
        endArticle = amount;
        startArticle = 0;
        document.getElementById("booder").innerText = "";
        // console.log('dwa');
    }
    showPosts(startArticle, endArticle, articleUrl);
}


// wiswietlanie jaki czas temu pojawił się post 
const timeAgo = (unixTime) => { // miliardy cyfra / sekundy // róznnica bierzący_czas - czas_posta
    if (unixTime < 60) {
        return "kilka sekund temu";
    } else if (unixTime < 3600) {
        const minutes = Math.floor(unixTime / 60);
        return `${minutes} ${minutes === 1 ? "minutę" : "minuty"} temu`;
    } else if (unixTime < 86400) {
        const hours = Math.floor(unixTime / 3600);
        return `${hours} ${hours === 1 ? "godzinę" : "godziny"} temu`;
    } else if (unixTime < 2592000) {
        const days = Math.floor(unixTime / 86400);
        return `${days} ${days === 1 ? "dzień" : "dni"} temu`;
    } else if (unixTime < 31536000) {
        const months = Math.floor(unixTime / 2592000);
        return `${months} ${months === 1 ? "miesiąc" : "miesiące"} temu`;
    } else {
        const years = Math.floor(unixTime / 31536000);
        return `${years} ${years === 1 ? "rok" : "lata"} temu`;
    }
};


// powiedz w prosty sposób co robi ten kod?
document.addEventListener('DOMContentLoaded', (event) => {
    checkURL(window.location.href);
});


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let blocker_errors = true;
const a_button = async () => {
    // console.log("click a");
    if (blocker_errors) {
        blocker_errors = false;
        let link = window.location.href;
        let a = window.location.href;
        do {
            await sleep(200);
            link = window.location.href;
        } while (a == link);
        checkURL(link);
        // console.log("click b");
    }
    blocker_errors = true;
}


const checkURL = (link) => {
    document.getElementById("amountNewsyAccept").style.display = "inline-block";
    document.getElementById("showMore").style.display = "inline-block";

    if (link.includes('#g')) {
        articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';
        console.log('glowna');
        showPosts(startArticle, endArticle, articleUrl);
    } else if (link.includes('#n')) {
        articleUrl = 'https://hacker-news.firebaseio.com/v0/beststories.json?';
        console.log('najlepsze');
        showPosts(startArticle, endArticle, articleUrl);
    } else if (link.includes('#d')) {
        articleUrl = 'yrzer_data';
        console.log('data');
        input_on_html = '<center><div class="inputs">data: <input type="text" onkeyup="genNewsy(true)" id="dateNewsy"> (format dd:mm:rrrr)<br><span id="error_format"></span></div></center>';
        document.getElementById("amountNewsyAccept").style.display = "none";
        document.getElementById("showMore").style.display = "none";
        document.getElementById("statistics").style.display = "none";
        document.getElementById("booder").innerHTML = input_on_html;
    } else if (link.includes('#s')) {
        articleUrl = 'yrzer_szukanie';
        console.log('szukanie');
        input_on_html = '<center><div class="jnputs">text: <input type="text" id="dateNewsy"> <input type="button" value="porównaj ciąg znaków" onclick="genNewsy(false)"></div></center>';
        document.getElementById("amountNewsyAccept").style.display = "none";
        document.getElementById("showMore").style.display = "none";
        document.getElementById("statistics").style.display = "none";
        document.getElementById("booder").innerHTML = input_on_html;
    } else {
        articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';
        console.log('glowna +');
        showPosts(startArticle, endArticle, articleUrl);
    }
}


// yrzer w down
let input_on_html = '';
const jedenDzień = 24 * 60 * 60; // sekundy
const na_unix_time = (dataString) => // zwraca int // Zamiana na Unix time (czas w sekundach) 
    new Date(
        parseInt(dataString.split(':')[2]),
        parseInt(dataString.split(':')[1]) - 1,
        parseInt(dataString.split(':')[0])
    )
    .getTime() / 1000; // data 0 : 01:01:1970


const na_date_format = (unixTime) => // zwraca str // Zamiana na datę "dd:mm:rrrr"  // unixTime w sekundach
    ("0" + new Date(unixTime * 1000).getDate()).slice(-2) +
    ":" + ("0" + (new Date(unixTime * 1000).getMonth() + 1)).slice(-2) +
    ":" + new Date(unixTime * 1000).getFullYear();


// kod
const filtr_data = (json) => (amount) => {
    let a = 0;
    // console.log(json.lenght);
    json.forEach(element => {
        if (amount >= 1) {
            const {
                author,
                created_at_i,
                num_comments,
                points,
                story_id,
                title,
                url
            } = element;

            var json2 = new Object();
            json2.title = title;
            json2.url = url;
            json2.score = points;
            json2.by = author;
            json2.time = created_at_i;
            json2.kids = num_comments;
            // console.log(typeof json2, json2);
            to_html_booder(json2, a);

            amount--;
            a++;
        }

    });
    // outContent.innerHTML+="<br><br><br><br>";
}

const api_filter = (StrDzień, r) => async (amount) => {
    let url="";
    if (r) {
        let timeS_od = na_unix_time(StrDzień);
        let timeS_do = timeS_od + (jedenDzień);
        url = "http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>" + timeS_od + ",created_at_i<" + timeS_do;
    } else {
        url = "https://hn.algolia.com/api/v1/search?query=" + StrDzień + "&tags=(story,job)";
    }
    await fetch(url)
        .then((response) => response.json())
        .then((json) => filtr_data(json.hits)(amount))
        .catch((error) => {
            console.error(error);
        });
}


async function genNewsy(r) {
    const inputAmount = document.getElementById("amountNewsy");
    const inputDate = document.getElementById("dateNewsy");
    const outError = document.getElementById("error_format");
    const datePattern = /^([1-9]|[1-2]\d|3[0-1]):(0[1-9]|1[0-2]):\d{4}$/;
    const zeroPattern = /^0+$/;

    let amount = 5;
    if (inputAmount.value != "" && !zeroPattern.test(inputAmount.value)) amount = inputAmount.value;

    if (r) {
        if (datePattern.test(inputDate.value)) {
            if (blocker_errors) {
                blocker_errors = false;
                outError.innerHTML = "";
                await api_filter(inputDate.value)(amount)
            }
            blocker_errors = true;
        } else {
            outError.innerHTML = "error, patern is: \"dd:mm:rrrr\" or \"d:m:rrrr\"";
        }
    } else {
        if (blocker_errors) {
            blocker_errors = false;
            await api_filter(inputDate.value)(amount)
        }
        blocker_errors = true;

    }
}