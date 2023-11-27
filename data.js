// Newsy powinny być podzielone na dzisiejsze/dawniejsze (tam powinna być możliwość podania daty)

const  na_unix_time = (dataString) => // zwraca int // Zamiana na Unix time (czas w sekundach) 
    new Date(
        parseInt(dataString.split(':')[2]),
        parseInt(dataString.split(':')[1]) - 1,
        parseInt(dataString.split(':')[0])
    )
    .getTime()/1000; // data 0 : 01:01:1970

const na_date_format = (unixTime) => // zwraca str // Zamiana na datę "dd:mm:rrrr"  // unixTime w sekundach
    ("0" + new Date(unixTime*1000).getDate()).slice(-2) +
    ":" + ("0" + (new Date(unixTime*1000).getMonth() + 1)).slice(-2) +
    ":" + new Date(unixTime*1000).getFullYear(); 

const na_czas_format = (róznicaCzasUnix) => // zwraca str // Zamiana na datę "mm:hh" 
    // zwraca poprawną wartość jako "mm:hh" jeżeli róznica jest bierzący_czas - czas_posta 
    // i ta rużnica jest mniejsza niż jeden dzień około 86400sekund
    ("0" + (Math.floor(róznicaCzasUnix /  60) % 60)).slice(-2) 
    + ":" +("0" + Math.floor(Math.floor(róznicaCzasUnix /  60) / 60)).slice(-2);



const jakiś_czas_temu = (unixTime) => { // miliardy cyfra / sekundy // róznnica bierzący_czas - czas_posta
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
// // wszytkie w sekundach 
// console.log(na_unix_time("26:11:2023")); // 1700953200
// console.log(na_date_format(1700953200)); // 1700953200
// console.log( na_czas_format(  Date.now()/1000  - 1700953200 ),   Date.now()/1000  - 1700953200  ) // 46:38 139614.29399991035


// console.log( jakiś_czas_temu( Date.now()/1000  -  1701091630));// 20 minut temu
// console.log( jakiś_czas_temu( Date.now()/1000  -  1701084384));// 2h temu
// console.log( jakiś_czas_temu( Date.now()/1000  -  1700911584));// 2 dni temu
// console.log( jakiś_czas_temu( Date.now()/1000  -  1698229584));// 34 dni temu
// console.log( jakiś_czas_temu( Date.now()/1000  -  1635157584));// ponad 2 lata temu
const jedenDzień = 24 * 60 * 60 ; // sekundy
//
// export { na_unix_time, na_date_format, na_czas_format }; nie działa export -_- trzeba by było globalnie -_-
//

// nie moje:
const imageChange = (number) => {
    var image = document.getElementById('triangle'+number);
    if(image.className == 'triangle0') {
        image.src = "obrazki/green_triangle.png";
        image.className = "triangle1";
        articleLikes();
        return;
    }
    else {
        image.src = "obrazki/white_triangle.png";
        image.className = "triangle0";
        articleLikes();
    }
}
const hide = (divID) => { //ukrywa div'a
    var div = document.getElementById('div'+divID);
    div.style.display = 'none';
}
/// i tyle 

const input_on_html = '<center><div class="inputs">data: <input type="text"   onkeyup="genNewsy()" id="dateNewsy"> (format dd:mm:rrrr)<br><span id="error_format"></span></div></center>';
const filtr_data = (json) => (outContent, amount) => {
    let a = 0;
    console.log(json.lenght);
    outContent.innerHTML=input_on_html;
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
            
            let wynik = '<div class="post" id="div'+(a+1)+'"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
            wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta">';
            wynik += '<span id="tytul_posta">tytul: '+title+'</span></p>';
            wynik += '<img class="triangle0" id="triangle'+(a+1)+'" src="obrazki/white_triangle.png" onclick="imageChange('+(a+1)+')" style="width: 15px;"><br/>';
            wynik += '<button id="hide" onclick="hide('+(a+1)+')">hide</button><br/>';
            wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+author+'</span></p><span class="separator">|</span>';
            wynik += '<br><p class="wynik_posta"><span id="wynik_posta">wynik: '+points+'</span></p><span class="separator">|</span>';
            wynik += '<p class="data_posta"><span id="data_posta">'+jakiś_czas_temu(Date.now()/1000 - created_at_i)+'</span></p><span class="separator">|</span>';
            wynik += '<p class="ilosc_komment"><span id="ilosc_komment">'+num_comments+' komentarzy</span></p>';
            wynik += '<p class="link_posta"><span id="link_posta">';
                if(typeof url == 'undefined') {
                wynik += '<a href="#">brak</a>';
                }
                else {
                    wynik += '<a href="'+url+'">'+url+'</a>';
                }
            wynik += '</span></p>';



            // let wynik = '<div class="post"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
            // wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta"><span id="tytul_posta">tytul: '+title+'</span></p> <br>';
            // wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+author+'</span></p><span class="separator">|</span>';
            // wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
            // wynik += '<p class="ilosc_komment"><span id="ilosc_komment">'+num_comments+' komentarzy</span></p>';
            // // barkuje url i points
            outContent.innerHTML += wynik;
            amount--;
            a++;
        }
        
    });
    outContent.innerHTML+="<br><br><br><br>";
}

const api_filter = (StrDzień) => async (outContent, amount) => {
    let timeS_od = na_unix_time(StrDzień);
    let timeS_do = timeS_od + (jedenDzień); 
//    console.log(timeS_od, timeS_do, jedenDzień) //    pierwsze mniejsze 
    let url = "http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>" + timeS_od + ",created_at_i<" + timeS_do;
    console.log(url, StrDzień)
    await fetch(url)
        .then((response) => response.json())
        .then((json) => filtr_data(json.hits)(outContent, amount))
        .catch((error) => {
            console.error(error);
        });
}
// api_filter( na_date_format(Date.now()))

function genNewsy() {
    const inputAmount = document.getElementById("amountNewsy");
    const inputDate = document.getElementById("dateNewsy");
    const outContent = document.getElementById("booder");
    const outError = document.getElementById("error_format");
    const datePattern = /^([1-9]|[1-2]\d|3[0-1]):(0[1-9]|1[0-2]):\d{4}$/;
    const zeroPattern = /^0+$/;

    let amount = 5;
    if (inputAmount.value != "" && !zeroPattern.test(inputAmount.value)) amount = inputAmount.value;
    // console.log(inputDate.value)
    if (datePattern.test(inputDate.value)) {
        outError.innerHTML = "";

        api_filter( inputDate.value )(outContent, amount    )
        // code         data        | out html  | ilość*out | 
    } else {
        outError.innerHTML = "error, patern is: \"dd:mm:rrrr\" or \"d:m:rrrr\"";
    }
}

window.onload = function () {
document.getElementById("booder").innerHTML = input_on_html;
}