const fetchPosts = async () => {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json?');
    const postIds = await response.json();
  
    const posts = await Promise.all(postIds.slice(0, 30).map(async (postId) => {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${postId}.json?print=pretty`);
      const postData = await response.json();
      return { title: postData.title, id: postId };
    }));
  
    posts.forEach((post) => {
      const newDiv = document.createElement('div');
      newDiv.id = `div${post.id}`;
      newDiv.textContent = `${post.id}. ${post.title}`;
      document.body.appendChild(newDiv);
    });
  
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Dalej';
    nextButton.onclick = () => {
      console.log('Wyswietl');
    };
    document.body.appendChild(nextButton);
  };
  
  fetchPosts();