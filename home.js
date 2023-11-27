var startArticle = 0;
var endArticle = 3;
var number = endArticle;

const comments = (komentarze) => { //ilosc komentarzy
        if(typeof komentarze === 'undefined') {
            return 'komentarze: 0';
        }
        else{
            return 'komentarze: ' + komentarze.length;
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
                        let url='https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty';
                        let wynik = '<div class="post" id="div'+(a+1)+'"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
                        wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta">';
                        wynik += '<span id="tytul_posta">tytul: '+json2.title+'</span></p> <br>';
                        wynik += '<button id="hide" onclick="hide('+(a+1)+')">hide</button>&emsp;';
                        wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+json2.by+'</span></p><span class="separator">|</span>';
                        wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
                        wynik += '<p class="ilosc_komment"><span id="ilosc_komment">'+comments(json2.kids)+'</span></p>';
                        wynik += '<p class="link_posta"><span id="link_posta">';
                        if(typeof json2.url == 'undefined') {
                           wynik += '<a href="#">brak</a>';
                        }
                        else {
                            wynik += '<a href="'+json2.url+'">'+json2.url+'</a>';
                        }
                        wynik += '</span></p>';
                        document.getElementById('booder').innerHTML += wynik;
            })
        }
    }) 
}

const hide = (divID) => { //ukrywa div'a
    var div = document.getElementById('div'+divID);
    div.style.display = 'none';
}

const showMore = () => { //pokaz więcej
    document.getElementById("booder").innerText = "";
    startArticle=endArticle; 
    endArticle += number; 
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