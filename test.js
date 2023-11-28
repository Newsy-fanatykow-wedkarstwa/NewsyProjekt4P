var startArticle = 0;
var endArticle = 3;
var number = endArticle;
var articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';



const comments = (komentarze) => { //ilosc komentarzy
        if(typeof komentarze === 'undefined') {
            return parseInt(0);
        }
        else {
            return parseInt(komentarze.length);
        }
}
const to_html_booder = (json2,a) => {
    let wynik = '<div class="post" id="div'+(a+1)+'"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
    wynik += '<p class="tytul_posta">';
    wynik += '<span id="tytul_posta">tytul: '+json2.title+'</span></p>';
    wynik += '<img class="triangle0" id="triangle'+(a+1)+'" src="obrazki/white_triangle.png" onclick="imageChange('+(a+1)+')" style="width: 15px;">&emsp;';
    wynik += '<p class="link_posta"><span id="link_posta">';
    if(typeof json2.url == 'undefined') {
    wynik += '<a href="#">brak</a>';
    }
    else {
        wynik += '(<a href="'+json2.url+'">link</a>)';
    }
    wynik += '</span></p><br>';
    wynik += '<button class="btn btn-secondary" id="hide" onclick="hide('+(a+1)+')">hide</button>&emsp;';
    wynik += '<p class="wynik_posta"><span id="wynik_posta">wynik: '+json2.score+'</span></p>';
    wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+json2.by+'</span></p>';
    wynik += '<p class="data_posta"><span id="data_posta">'+timeAgo(Date.now()/1000-json2.time)+'</span></p>';
    wynik += '<p class="ilosc_komment"><span id="ilosc_komment">komentarzy: '+comments(json2.kids)+'</span></p>';
    document.getElementById('booder').innerHTML += wynik;

    // statystyki 
    statisticHowMany(json2.score, 'statystyka_1');
    statisticHowMany(comments(json2.kids), 'statystyka_2');
    localChanges('statystyka_3', 'img.triangle1');
    localChanges('statystyka_4', 'div.hidden');
    numberInString(json2.title, 'statystyka_5');
};

const showPosts = (start,howMany,url) => { //najnowsze posty
    document.getElementById('booder').innerHTML = "";
    fetch(url)
        .then(response => response.json())
        .then (async json => {
                for(var a=start; a<howMany; a++) {
                    let x= json[a];
                    await fetch('https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty')
                        .then(response2 => response2.json())
                        .then( json2 => {
                            to_html_booder(json2,a);
                })
            }
            document.getElementById('statistics').style.display = 'block';
        
    }) 
}

const numberInString = (title, statisticID) => { //czy string zawiera cyfre
    let num = /\d/.test(title); 
    if(num){
        statisticHowMany(1, statisticID);
    }
}

const statisticHowMany = (score, statisticID) => { //zliczanie do statystyk
    var numm=0;
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
    var image = document.getElementById('triangle'+number);
    if(image.className == 'triangle0') {
        image.src = "obrazki/green_triangle.png";
        image.className = "triangle1";
        localChanges('statystyka_3', 'img.triangle1');
        return;
    }
    else {
        image.src = "obrazki/white_triangle.png";
        image.className = "triangle0";
        localChanges('statystyka_3', 'img.triangle1');
    }
}

const hide = (divID) => { //ukrywa div'a
    var div = document.getElementById('div'+divID);
    div.className = 'hidden';
    div.style.display = 'none';
    localChanges('statystyka_4', 'div.hidden');
}

const showMore = () => { //pokaz więcej
    document.getElementById('statistics').style.display = 'none';
    resetStatistics();
    document.getElementById("booder").innerText = "";
    startArticle=endArticle; 
    endArticle += number; 
    document.getElementById('statystyka_3').innerHTML = "";
    showPosts(startArticle, endArticle, articleUrl);
}

const howManyNews = async() => { //ile newsow ma sie pokazywac
    amount = document.getElementById('amountNewsy').value;
    var good=1;
    await fetch('https://hacker-news.firebaseio.com/v0/newstories.json?')
        .then(response => response.json())
        .then (async json => {
            if(amount<1 || amount>json.length) {
                alert('Wybierz ilosc newsow od 1 do ' + json.length);
                good=0;
                document.getElementById("booder").innerText = "";
                return;
            }
        });
        if(good==1) {
            document.getElementById('statistics').style.display = 'none';
            resetStatistics();
            amount = parseInt(amount);
            number = amount;
            endArticle = amount;
            startArticle = 0;
            document.getElementById("booder").innerText = "";
            console.log('dwa');
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

document.addEventListener('DOMContentLoaded', (event) => { checkURL(window.location.href); });
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let blocker_errors = true;
const a_button = async ()=>{
    // console.log("click a");
    if(blocker_errors){
        blocker_errors = false;
        let link =  window.location.href;
        let a =  window.location.href;
        do {
            await sleep(200);
            link =  window.location.href;
        } while (a==link);
        checkURL(link);
        // console.log("click b");
    }
    blocker_errors = true;
}

const checkURL = (link) => {
    

    if(link.includes('#g')){
        articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';
        console.log('glowna');
    }
    else if(link.includes('#n')) {
        articleUrl = 'https://hacker-news.firebaseio.com/v0/beststories.json?';
        console.log('najlepsze');
    } else {
        articleUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?';
        console.log('glowna +');
    }
    
    
    showPosts(startArticle, endArticle, articleUrl);
}

