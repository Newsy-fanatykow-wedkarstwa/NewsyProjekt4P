var myFetch = new Array();

const assign = (arr) => {
    myFetch = arr;
    console.log(myFetch)
} 

const theNewestPosts = async() => { //najnowsze 30 postów

    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json?');
    const json = await response.json();
    for(var a=0; a<30; a++) {
        let z = a+1;
        let x= json[a];
        let response2 = await fetch('https://hacker-news.firebaseio.com/v0/item/'+x+'.json?print=pretty');
        let json2 = await response2.json();
        let y= json2.title;
        let newDiv = document.createElement('div');
        newDiv.id = 'div'+z;
        newDiv.textContent = z + ". " + y;
        document.body.appendChild(newDiv);
    }
    let next = document.createElement('button');
    document.body.appendChild(next);
    next.textContent = 'Dalej';
    next.onclick = () => {
        console.log("Wyswietl");
    };
}

theNewestPosts();