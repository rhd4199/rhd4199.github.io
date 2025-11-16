// Simple placeholder feed (Instagram API resmi perlu token, ini dummy)
const instagramFeed = [
    {img: "https://via.placeholder.com/300x300?text=Post+1", link:"#"},
    {img: "https://via.placeholder.com/300x300?text=Post+2", link:"#"},
    {img: "https://via.placeholder.com/300x300?text=Post+3", link:"#"},
    {img: "https://via.placeholder.com/300x300?text=Post+4", link:"#"}
];

function loadInstagramFeed(){
    const feedContainer = document.getElementById("instagram-feed");
    if(!feedContainer) return;
    instagramFeed.forEach(post => {
        const a = document.createElement("a");
        a.href = post.link;
        a.target="_blank";
        a.innerHTML = `<img src="${post.img}" class="img-fluid mb-2" />`;
        feedContainer.appendChild(a);
    });
}
window.addEventListener('load', loadInstagramFeed);
