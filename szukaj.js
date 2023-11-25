// import { na_unix_time, na_date_format, na_czas_format } from "./data.js";

// let posta_unixTime = 1700858438;
// console.log(na_unix_time("25:11:2023"), na_date_format(Date.now()), Date.now());
// console.log(na_czas_format(   ( Date.now()  - posta_unixTime *1000)    ));


// const filtr_data = (json) => (outContent, amount) => {
//     let a = 0;
//     console.log(json.lenght);
//     outContent.innerHTML='<center><div class="inputs">data: <input type="text"   onkeyup="genNewsy()" id="dateNewsy"> (format dd:mm:rrrr)<br><span id="error_format"></span></div></center>';
//     json.forEach(element => {
//         if (amount >= 1) {
//             const {
//                 author,
//                 created_at_i,
//                 num_comments,
//                 points,
//                 story_id,
//                 title,
//                 url
//             } = element;

//             let wynik = '<div class="post"><p class="ID_posta">ID: <span id="wynik_ID">'+(a+1)+'</span>';
//             wynik += '</span></p><span class="separator">|</span> <p class="tytul_posta"><span id="tytul_posta">tytul: '+title+'</span></p> <br>';
//             wynik += '<p class="autor_posta"><span id="autor_posta">autor: '+author+'</span></p><span class="separator">|</span>';
//             wynik += '<p class="data_posta"><span id="data_posta">2h temu</span></p><span class="separator">|</span>';
//             wynik += '<p class="ilosc_komment"><span id="ilosc_komment">'+num_comments+' komentarzy</span></p>';
//             // barkuje url i points
//             outContent.innerHTML += wynik;
//             amount--;
//             a++;
//         }
        
//     });
//     outContent.innerHTML+="<br><br><br><br>";
// }

// const api_filter = (StrDzień) => async (outContent, amount) => {
//     let timeS_od = na_unix_time(StrDzień) / 1000;
//     let timeS_do = timeS_od + (jedenDzień / 1000);
//     let url = "http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>" + timeS_od + ",created_at_i<" + timeS_do;

//     await fetch(url)
//         .then((response) => response.json())
//         .then((json) => filtr_data(json.hits)(outContent, amount))
//         .catch((error) => {
//             console.error(error);
//         });
// }
// // api_filter( na_date_format(Date.now()))

// function genNewsy() {
//     const inputAmount = document.getElementById("amountNewsy");
//     const inputDate = document.getElementById("dateNewsy");
//     const outContent = document.getElementById("booder");
//     const outError = document.getElementById("error_format");
//     const datePattern = /^([1-9]|[1-2]\d|3[0-1]):(0[1-9]|1[0-2]):\d{4}$/;
//     const zeroPattern = /^0+$/;

//     let amount = 5;
//     if (inputAmount.value != "" && !zeroPattern.test(inputAmount.value)) amount = inputAmount.value;
//     // console.log(inputDate.value)
//     if (datePattern.test(inputDate.value)) {
//         outError.innerHTML = "";
//         api_filter( inputDate.value )(outContent, amount    )
//         // code         data        | out html  | ilość*out | 
//     } else {
//         outError.innerHTML = "error, patern is: \"dd:mm:rrrr\" or \"d:m:rrrr\"";
//     }
// }

// window.onload = function () {
// document.getElementById("booder").innerHTML = '<center><div class="inputs">data: <input type="text"   onkeyup="genNewsy()" id="dateNewsy"> (format dd:mm:rrrr)<br><span id="error_format"></span></div></center>';
// }
////////http://hn.algolia.com/api/v1/search?query=           https://hn.algolia.com/api