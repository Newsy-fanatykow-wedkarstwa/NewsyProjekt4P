// Newsy powinny być podzielone na dzisiejsze/dawniejsze (tam powinna być możliwość podania daty)

const na_unix_time = (dataString) => // zwraca int // Zamiana na Unix time (czas w milisekundach) 
    new Date(
        parseInt(dataString.split(':')[2]),
        parseInt(dataString.split(':')[1])-1,
        parseInt(dataString.split(':')[0])
        )
        .getTime() ; // data 0 : 01:01:1970

const na_date_format = (unixTime) => // zwraca str // Zamiana na datę "dd:mm:rrrr" 
            ("0" + new Date(unixTime).getDate()).slice(-2)
    + ":" + ("0" + (new Date(unixTime).getMonth() + 1)).slice(-2) 
    + ":" + new Date(unixTime).getFullYear(); // jeden dzień: (24 * 60 * 60 * 1000)

    // console.log( // przedział jednego dnia
    //     na_unix_time("23:11:2023"),      /// zmienna a
    //     na_unix_time("24:11:2023"),      /// zmienna b
    //     na_unix_time("24:11:2023") - na_unix_time("23:11:2023")
    // )
    // if na_date_format(time*1000) == a
    //
const jedenDzień = 24 * 60 * 60 * 1000;
    // console.log( na_date_format( Date.now()+jedenDzień )  );


let id_postów_zDziś = [];
let r = true;

const filtr_data = (json) => {
    json.forEach(element => {
        const {author,created_at_i,num_comments,points,story_id,title,url} = element;
        console.log("•tytuł: "+ title);
        console.log("•link: "+ title);
        console.log("•points: "+ title);
        console.log("•autor: "+ title);
        console.log("•ile czasu temu: "+ title);
        console.log("ile komentarz: "+ title);
    });
};
const api_filtr = async (StrDzień) => {
    let timeS_od = na_unix_time(StrDzień)/1000;
    let timeS_do = timeS_od+(jedenDzień/1000);
    let url = "http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>"+timeS_od +",created_at_i<"+timeS_do;

    await fetch(url)
        .then((response) => response.json())
        .then((json) => filtr_data(json.hits))
        .catch((error) => {
            console.error(error);
        });
}

// api_filter()