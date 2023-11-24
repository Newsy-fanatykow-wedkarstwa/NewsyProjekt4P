var myFetch = new Array();

const assign = (arr) => {
    myFetch = arr;
    console.log(myFetch)
} 

const theNewestPosts = () => { //najnowsze 30 postów
    fetch('https://hacker-news.firebaseio.com/v0/newstories.json?')
        .then(response => response.json())
        .then (async json => {
            for(var a=0; a<30; a++) {
                let x= json[a];
                await fetch('https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty')
                    .then(response2 => response2.json())
                    .then(json2 => {
                        let wynik = '<div class="post"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
                        wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta"><span id="tytul_posta">tytul: '+json2.title+'</span></p> <br>';
                        wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+json2.by+'</span></p><span class="separator">|</span>';
                        wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
                        wynik += '<p class="ilosc_komment"><span id="ilosc_komment">14 komentarzy</span></p>';
                        document.getElementById('booder').innerHTML += wynik;
            })
        }
    }) 
     
        
    let next = document.createElement('button');
    document.body.appendChild(next);
    next.textContent = 'Dalej';
    next.onclick = () => {
        console.log("Wyswietl");
    };
}
theNewestPosts();