var startArticle = 0;
var endArticle = 3;
var number = endArticle;
var change = 0;

const comments = (komentarze) => { //ilosc komentarzy
        if(typeof komentarze === 'undefined') {
            return parseInt(0);
        }
        else{
            return parseInt(komentarze.length);
        }
}

const theNewestPosts = (start,howMany) => { //najnowsze posty
    fetch('https://hacker-news.firebaseio.com/v0/newstories.json?')
        .then(response => response.json())
        .then (async json => {
            for(var a=start; a<howMany; a++) {
                let x= json[a];
                await fetch('https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty')
                    .then(response2 => response2.json())
                    .then(json2 => {
                        let wynik = '<div class="post" id="div'+(a+1)+'"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
                        wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta">';
                        wynik += '<span id="tytul_posta">tytul: '+json2.title+'</span></p>';
                        wynik += '<img class="triangle0" id="triangle'+(a+1)+'" src="obrazki/white_triangle.png" onclick="imageChange('+(a+1)+')" style="width: 15px;"><br/>';
                        wynik += '<button id="hide" onclick="hide('+(a+1)+')">hide</button><br/>';
                        wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+json2.by+'</span></p><span class="separator">|</span>';
                        wynik += '<br><p class="wynik_posta"><span id="wynik_posta">wynik: '+json2.score+'</span></p><span class="separator">|</span>';
                        wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
                        wynik += '<p class="ilosc_komment"><span id="ilosc_komment">komantarzy: '+comments(json2.kids)+'</span></p>';
                        wynik += '<p class="link_posta"><span id="link_posta">';
                            if(typeof json2.url == 'undefined') {
                            wynik += '<a href="#">brak</a>';
                            }
                            else {
                                wynik += '<a href="'+json2.url+'">'+json2.url+'</a>';
                            }
                        wynik += '</span></p>';
                        document.getElementById('booder').innerHTML += wynik;
                        statisticHowMany(json2.score, 'statystyka_1');
                        statisticHowMany(comments(json2.kids), 'statystyka_2');
                        localChanges('statystyka_3', 'img.triangle1');
                        localChanges('statystyka_4', 'div.hidden');
                        numberInString(json2.title, 'statystyka_5');
            })
        }
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
    points2=0;
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
    resetStatistics();
    document.getElementById("booder").innerText = "";
    startArticle=endArticle; 
    endArticle += number; 
    document.getElementById('statystyka_3').innerHTML = "";
    theNewestPosts(startArticle, endArticle);
}

const howManyNews = () => { //ile newsow ma sie pokazywac
    amount = document.getElementById('amountNewsy').value;
    amount = parseInt(amount);
    number = amount;
    endArticle = amount;
    startArticle = 0;
    document.getElementById("booder").innerText = "";
    theNewestPosts(startArticle, endArticle);
}

theNewestPosts(startArticle, endArticle);