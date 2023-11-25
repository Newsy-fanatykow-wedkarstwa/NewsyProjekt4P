var startArticle = 0;
var endArticle = 0;
var number = 0;

const comments = (komentarze) => { //ilosc komentarzy
        if(typeof komentarze === 'undefined') {
            return 'komentarze: 0';
        }
        else{
            return 'komentarze: ' + komentarze.length;
        }
}

const theNewestPosts = (start,howMany) => { //najnowsze 30 postów
    console.log(startArticle," ",endArticle);
    fetch('https://hacker-news.firebaseio.com/v0/newstories.json?')
        .then(response => response.json())
        .then (async json => {
            for(var a=start; a<howMany; a++) {
                let x= json[a];
                await fetch('https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty')
                    .then(response2 => response2.json())
                    .then(json2 => {
                        let wynik = '<div class="post"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
                        wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta"><span id="tytul_posta">tytul: '+json2.title+'</span></p> <br>';
                        wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+json2.by+'</span></p><span class="separator">|</span>';
                        wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
                        wynik += '<p class="ilosc_komment"><span id="ilosc_komment">'+comments(json2.kids)+'</span></p>';
                        document.getElementById('booder').innerHTML += wynik;
            })
        }
    }) 
}

const showMore = () => { //pokaz więcej
    document.getElementById("booder").innerText = "";
    startArticle=endArticle;
    endArticle += number;
    theNewestPosts(startArticle, endArticle);
}

const howManyNews = () => { //ile newsow ma sie pokazywac
    let amount = document.getElementById('amountNewsy').value;
    amount = parseInt(amount);
    number = amount;
    endArticle = amount;
    startArticle = 0;
    document.getElementById("booder").innerText = "";
    theNewestPosts(startArticle, endArticle);
}

theNewestPosts(0,30);