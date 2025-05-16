let userGroups = {};

fetch('userGroups.json')
  .then(res => res.json())
  .then(data => {
    userGroups = data;
  });

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');
  const bgMusic = document.getElementById('bgMusic');

  setTimeout(() => {
    bgMusic.volume = 0;
    bgMusic.play();
    const fadeIn = setInterval(() => {
      if (bgMusic.volume < 0.5) {
        bgMusic.volume += 0.01;
      } else {
        clearInterval(fadeIn);
      }
    }, 100);

    loader.style.display = 'none';
    app.style.display = 'block';

    setupVisualizer(bgMusic);
  }, 3000);
});

function checkName() {
  const input = document.getElementById('nameInput').value.toLowerCase();
  const expDiv = document.getElementById('experience');
  let found = false;

  for (const group in userGroups) {
    userGroups[group].forEach(entry => {
      if (entry.name.toLowerCase() === input) {
        found = true;

        switch (group) {
          case 'crush':
            expDiv.innerHTML = `<h2>${entry.message}</h2>`;
            document.body.style.background = "mistyrose";
            document.getElementById('bgMusic').src = "assets/music/for_gaby.mp3";
            break;

          case 'friends':
            const randomColor = `hsl(${Math.floor(Math.random()*360)}, 70%, 80%)`;
            document.body.style.background = randomColor;
            expDiv.innerHTML = `<h2>${entry.message}</h2>`;
            break;

          case 'family':
            document.body.style.background = "peachpuff";
            expDiv.innerHTML = `<h2>${entry.message}</h2>`;
            break;

          case 'nvidia':
            document.body.style.background = "black";
            document.body.style.color = "lime";
            expDiv.innerHTML = `<h2>${entry.message}</h2>`;
            break;
        }
      }
    });
  }

  if (!found) {
    expDiv.innerHTML = "<h2>Welcome to the public garden 🌿</h2>";
    document.body.style.background = "white";
    document.body.style.color = "black";
  }
}

function setupVisualizer(audioElement) {
  const context = new AudioContext();
  const src = context.createMediaElementSource(audioElement);
  const analyser = context.createAnalyser();

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const app = document.getElementById('app');

  function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    const intensity = Math.min(1, bass / 100);
    app.style.background = `radial-gradient(circle, rgba(255,192,203,${intensity}) 0%, rgba(0,0,0,1) 100%)`;
  }

  animate();
}