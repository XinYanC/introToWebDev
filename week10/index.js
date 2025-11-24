const commentBank = [
	"Totally agree!",
	"Preach.",
	"Same here.",
	"100% this.",
	"Couldn't have said it better.",
	"Big facts.",
	"Facts.",
	"This is peak energy.",
	"Yesss.",
	"Literally me.",
	"Mood.",
	"I was just thinking that.",
	"So true.",
	"Exactly.",
    "I agree.",
	"This needs to be said more often.",
	"Can't argue with that.",
	"Chef's kiss.",
	"That's the tea.",
	"I'm here for this."
];

const form = document.getElementById('postForm');
const takeInput = document.getElementById('takeInput');
const postsContainer = document.getElementById('posts');


form.addEventListener('submit', (e) => {
	e.preventDefault();
	const text = takeInput.value.trim();
	if (!text) return;
	createPost(text);
	takeInput.value = '';
	takeInput.focus();
});

function createPost(text){
	const postWrap = document.createElement('div');
	postWrap.className = 'post';

	const postCard = document.createElement('div');
	postCard.className = 'post-card card';

	const meta = document.createElement('div');
	meta.className = 'meta';

	const author = document.createElement('div');
	author.className = 'author';
	author.textContent = 'annoymous:';

	const textEl = document.createElement('div');
	textEl.className = 'text';
	textEl.textContent = text;

	meta.appendChild(author);
	postCard.appendChild(meta);
	postCard.appendChild(textEl);

	const comments = document.createElement('div');
	comments.className = 'comments';
	postCard.appendChild(comments);

	postWrap.appendChild(postCard);
	postsContainer.insertBefore(postWrap, postsContainer.firstChild);

	const n = randInt(3, 10);
	const chosen = [];
	for (let i=0;i<n;i++) chosen.push(randomFromArray(commentBank));

	// reveal comments
    chosen.forEach((cmt, i) => {
		setTimeout(() => addComment(comments, cmt), 500 + i * (500 *  Math.random()));
	});
}

function addComment(container, text){
	const node = document.createElement('div');
	node.className = 'comment';
    node.innerHTML = `<strong>annoymous</strong>: ${text}`;
	container.appendChild(node);
    // wait for transition to complete before showing
	requestAnimationFrame(() => node.classList.add('show'));
}

function randInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}
