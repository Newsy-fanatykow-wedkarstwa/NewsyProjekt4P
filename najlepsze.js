const theBestPosts = () => {
    fetch('https://hacker-news.firebaseio.com/v0/beststories.json?')
        .then(response => response.json())
        .then (async json => {
            for(var a=0; a<30; a++) {
                let x= json[a];
                await fetch('https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty')
                    .then(response2 => response2.json())
                    .then(json2 => {
                        let wynik = '<div class="post"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
                        wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta"><span id="tytul_posta">tytul: '+json2.title+'</span></p> <br>';
                        wynik += '<p class="link_posta"><span id="link_posta"><a href="'+json2.url+'">'+json2.url+'</a></span></p>';                        
                        wynik += '<p class="link_posta"><span id="link_posta">autor: '+json2.url+'</span></p><span class="separator">|</span>';
                        wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
                        wynik += '<p class="ilosc_komment"><span id="ilosc_komment">'+ json2.kids.length+' komentarzy</span></p>';

                        document.getElementById('booder').innerHTML += wynik;
            })
        }
    }) 
};
    
theBestPosts();