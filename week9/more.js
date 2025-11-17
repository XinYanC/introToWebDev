(function(){
  const inbox = document.getElementById('inbox');

  function makeEmailNode(subject, preview){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'email';
    btn.innerHTML = `
      <div class="avatar">👤</div>
      <div class="content">
        <div class="subject""></div>
        <div class="preview"></div>
      </div>
    `;
    btn.querySelector('.subject').textContent = subject;
    btn.querySelector('.preview').textContent = preview;

  const avatarEl = btn.querySelector('.avatar');
  const hue = Math.floor(Math.random() * 360);
  avatarEl.style.backgroundColor = `hsl(${hue}, 70%, 80%)`;

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      addEmail("I'm still here", 'hehehe');
    });

    btn.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });

    return btn;
  }

  function addEmail(subject, preview){
    const node = makeEmailNode(subject, preview);
    inbox.append(node);

    if(inbox.childElementCount > 400){
      inbox.removeChild(inbox.firstElementChild);
    }
  }

  setInterval(function(){
    addEmail("HEY it's me", 'Try getting rid of me');
  }, 2000);

})();
