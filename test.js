var startArticle = 0;
var endArticle = 3;
var number = endArticle;
var articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';



const comments = (komentarze) => { //ilosc komentarzy
    if (/^[0-9]+$/.test(komentarze) && typeof komentarze == 'number') return komentarze;

    if (typeof komentarze === 'undefined') return parseInt(0);
    else {
        console.log("konen l", komentarze.length);
        return parseInt(komentarze.length);
    }
}

const to_html_booder = (json2, a) => {
    // console.log(typeof json2, json2);'
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

    // statystyki 
    statisticHowMany(json2.score, 'statystyka_1');
    statisticHowMany(comments(json2.kids), 'statystyka_2');
    localChanges('statystyka_3', 'img.triangle1');
    localChanges('statystyka_4', 'div.hidden');
    numberInString(json2.title, 'statystyka_5');
};

const showPosts = (start, howMany, url) => { //najnowsze posty
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

const numberInString = (title, statisticID) => { //czy string zawiera cyfre
    let num = /\d/.test(title);
    if (num) {
        statisticHowMany(1, statisticID);
    }
}

const statisticHowMany = (score, statisticID) => { //zliczanie do statystyk
    var numm = 0;
    numm += score;
    const element = document.getElementById(statisticID);
    const currentValue = parseInt(element.innerHTML) || 0; // Jeśli parseInt zwraca NaN, zwróć 0
    element.innerHTML = currentValue + numm;
    return currentValue + numm;
}

const localChanges = (statisticID, selector) => { //ile polubien i schowanych postow
    const sth = document.querySelectorAll(selector);
    const count = sth.length;
    document.getElementById(statisticID).innerHTML = parseInt(count);
}

const resetStatistics = () => { //resetowanie statystyk
    document.getElementById('statystyka_1').innerHTML = "";
    document.getElementById('statystyka_2').innerHTML = "";
    document.getElementById('statystyka_3').innerHTML = "";
    document.getElementById('statystyka_4').innerHTML = "";
    document.getElementById('statystyka_5').innerHTML = "";
}

const imageChange = (number) => { //polubienia
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

const hide = (divID) => { //ukrywa div'a
    var div = document.getElementById('div' + divID);
    div.className = 'hidden';
    div.style.display = 'none';
    localChanges('statystyka_4', 'div.hidden');
}

const showMore = () => { //pokaz więcej
    document.getElementById('statistics').style.display = 'none';
    resetStatistics();
    document.getElementById("booder").innerText = "";
    startArticle = endArticle;
    endArticle += number;
    document.getElementById('statystyka_3').innerHTML = "";
    showPosts(startArticle, endArticle, articleUrl);
}

const howManyNews = async () => { //ile newsow ma sie pokazywac
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
    document.getElementById('booder').innerHTML = "";
        document.getElementById('statistics').style.display = 'none';
    if(startArticle>0) {
        startArticle=0;
        endArticle=number;
    }
    if (link.includes('#g')) {
        resetStatistics();
        document.getElementById('buttons').style.display = 'none';
        articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';
        console.log('glowna');
        showPosts(startArticle, endArticle, articleUrl);
    } else if (link.includes('#n')) {
        resetStatistics();
        document.getElementById('buttons').style.display = 'none';
        articleUrl = 'https://hacker-news.firebaseio.com/v0/beststories.json?';
        console.log('najlepsze');
        showPosts(startArticle, endArticle, articleUrl);
    } else if (link.includes('#d')) {
        document.getElementById('buttons').style.display = 'block';
        articleUrl = 'yrzer_data';
        console.log('data');
        input_on_html = '<center><div class="inputs">data: <input type="text" onkeyup="genNewsy(true)" id="dateNewsy"> (format dd:mm:rrrr)<br><span id="error_format"></span></div></center>';
        document.getElementById("amountNewsyAccept").style.display = "none";
        document.getElementById("showMore").style.display = "none";
        document.getElementById("statistics").style.display = "none";
        document.getElementById("buttons").innerHTML = input_on_html;
    } else if (link.includes('#s')) {
        document.getElementById('buttons').style.display = 'block';
        articleUrl = 'yrzer_szukanie';
        console.log('szukanie');
        input_on_html = `<center><div class="jnputs">text: <input type="text" id="dateNewsy"><select id="typeSelect"><option>story</option><option>comment</option><option>poll</option><option>pollopt</option></select><input type="button" value="porównaj ciąg znaków" onclick="genNewsy(false)"></div></center>`;
        document.getElementById("amountNewsyAccept").style.display = "none";
        document.getElementById("showMore").style.display = "none";
        document.getElementById("statistics").style.display = "none";
        document.getElementById("buttons").innerHTML = input_on_html;
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
const filtr_data = (json) => {
    let a = 0;
if (!document.getElementById("czekaj")) {
    var czekajDiv = document.createElement('div');
    czekajDiv.setAttribute("id", "czekaj");
    document.getElementById("buttons").appendChild(czekajDiv);
}
document.getElementById("czekaj").innerHTML = "<center>czekaj. szukanie...<br>ilość wyświetlanych:" + json.length + "</center>";
        json.forEach(element => {
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
            a++;

    });
    // outContent.innerHTML+="<br><br><br><br>";
}

const api_filter = (StrDzień, r) => async (amount,typeSelect) => {
    let url="";
    if (r) {
        let timeS_od = na_unix_time(StrDzień);
        let timeS_do = timeS_od + (jedenDzień);
        url = "http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>" + timeS_od + ",created_at_i<" + timeS_do+"&hitsPerPage="+amount;
    } else {
        url = "https://hn.algolia.com/api/v1/search?query=" + StrDzień + "&tags="+typeSelect+"&hitsPerPage="+amount;
        console.log(url,typeSelect);
    }
    await fetch(url)
        .then((response) => response.json())
        .then((json) => filtr_data(json.hits))
        .catch((error) => {
            console.error(error);
        });
}

async function genNewsy(r) {
    document.getElementById('booder').innerHTML = "";
    const inputAmount = document.getElementById("amountNewsy");
    const inputDate = document.getElementById("dateNewsy");
    const outError = document.getElementById("error_format");
    const datePattern = /^([1-9]|[1-2]\d|3[0-1]):(0[1-9]|1[0-2]):\d{4}$/;
    const zeroPattern = /^0+$/;

    let amount = 30;
    if (inputAmount.value != "" && !zeroPattern.test(inputAmount.value)) amount = inputAmount.value;

    if (r) {
        if (datePattern.test(inputDate.value)) {
            if (blocker_errors) {
                blocker_errors = false;
                outError.innerHTML = "";
                await api_filter(inputDate.value)(amount,-1)
            }
            blocker_errors = true;
        } else {
            outError.innerHTML = "error, patern is: \"dd:mm:rrrr\" or \"d:m:rrrr\"";
        }
    } else {
        const typeSelect = document.getElementById("typeSelect").value;
        if (blocker_errors) {
            blocker_errors = false;
            await api_filter(inputDate.value)(amount,typeSelect)
        }
        blocker_errors = true;
    }
}