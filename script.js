document.addEventListener("DOMContentLoaded",()=>{
  document.body.style.backgroundImage = "url('https://i.ibb.co.com/gLFbSs9D/gta-6-game-art-5k-3840x2160-14300.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
});



function 
loadJS(url){
  const s=document.createElement("script");
  s.src=url;
  s.defer=true;
  document.head.appendChild(s);
}

loadJS("https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js");
loadJS("https://cdn.jsdelivr.net/npm/hls.js@latest");


function loadScript(u){
  return new Promise(r=>{
    const s=document.createElement("script");
    s.src=u;
    s.onload=r;
    document.head.appendChild(s);
  });
}

Promise.all([
  loadScript("https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"),
  loadScript("https://cdn.jsdelivr.net/npm/hls.js@latest")
]).then(()=>window.CLAPPR_READY=true);

const urls=[
  "https://raw.githubusercontent.com/munim-sah75/Cofs_TV/refs/heads/main/fancode.m3u",
  "https://eamintalukdar.pages.dev/iptv.m3u8"
];

let channels = [];
let player = null;
let userInteracted = false;


/***********************
 USER INTERACTION DETECT
************************/

document.addEventListener("click",()=>{
  userInteracted = true;
  if(player){
    try{
      player.unmute();
      player.setVolume(100);
      player.play();
    }catch(e){}
  }
});



/***********************
 LOAD & PARSE PLAYLIST
************************/
Promise.all(urls.map(u=>fetch(u).then(r=>r.text()))).then(txts=>{
  txts.forEach(t=>{
    let l=t.split("\n");
    for(let i=0;i<l.length;i++){
      if(l[i].startsWith("#EXTINF")){
        let name=l[i].split(",").pop();
        let logo=(l[i].match(/tvg-logo="(.*?)"/)||[])[1]
          || "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgk-F1cUOHYKYpUPSS1L05FzI2joFOzyBA7SOYaCHZPy6XSqm5Wj8ojeDG9ba4r8g8xYjX3V5FgiQ9Lq21TNIpspCg5y6fEUl9zYOuszosQsW5INiYIlHxeo6fogknIvL2mNyikKdxLLnjdc6y-ozTDv5hJUgl9aL0DOxE4wxF7j6XUTGb5XH8evlfkE61-/s320/LOGO-LAST.webp";
        let cat=(l[i].match(/group-title="(.*?)"/)||[])[1] || "Others";
        let stream=l[i+1];
        if(stream && stream.startsWith("http")){
          channels.push({name,logo,cat,stream});
        }
      }
    }
  });
  renderCategory();
  renderList(channels);
});


/***********************
 CATEGORY RENDER
************************/
function renderCategory(){
  const b=document.getElementById("category");
  b.innerHTML="";
  ["All",...new Set(channels.map(c=>c.cat))].forEach(c=>{
    let d=document.createElement("div");
    d.className="catBtn";
    d.innerText=c;
    d.onclick=()=>renderList(c==="All"?channels:channels.filter(x=>x.cat===c));
    b.appendChild(d);
  });
}


/***********************
 CHANNEL LIST
************************/
function renderList(arr){
  const b=document.getElementById("list");
  b.innerHTML="";
  arr.forEach(c=>{
    let d=document.createElement("div");
    d.className="channelItem";
    d.innerHTML=`<img src="${c.logo}">`;
    d.onclick=()=>play(c,d);
    b.appendChild(d);
  });
}


/***********************
 PLAY CHANNEL (MAIN FIX)
************************/
function play(c, el){
  if(!window.CLAPPR_READY) return;

  document.querySelectorAll(".channelItem").forEach(x=>x.classList.remove("active"));
  el.classList.add("active");

  document.getElementById("left").style.display="flex";
  document.getElementById("backBtn").style.display="block";

  document.getElementById("currentLogo").src=c.logo;
  document.getElementById("currentName").innerText=c.name;
  document.getElementById("posterImg").src=c.logo;
  document.getElementById("poster").style.display="flex";

  if(player){
    player.destroy();
    player=null;
  }

  player = new Clappr.Player({
    source: c.stream,
    parentId: "#player",
    width: "100%",
    height: "100%",
    autoPlay: true,
    mute: !userInteracted,   // 🔑 policy safe
    volume: 100,
    playback:{
      playInline:true,
      autoPlay:true
    },
    events:{
      onReady:()=>{
        try{
          player.play();
          if(userInteracted){
            player.unmute();
            player.setVolume(100);
          }
        }catch(e){}
      },
      onPlay:()=>{
        document.getElementById("poster").style.display="none";
        if(userInteracted){
          try{
            player.unmute();
            player.setVolume(100);
          }catch(e){}
        }
      }
    }
  });

window.scrollTo({top:0,behavior:"smooth"});
}




/***********************
 BACK BUTTON
************************/
function goBack(){
  if(player){
    player.destroy();
    player=null;
  }
  document.getElementById("left").style.display="none";
  document.getElementById("backBtn").style.display="none";
}


/***********************
 SEARCH
************************/
function toggleSearch(){
  let s=document.getElementById("searchBox");
  s.style.display=s.style.display==="block"?"none":"block";
}

function searchChannel(){
  let q=document.getElementById("searchInput").value.toLowerCase();
  renderList(channels.filter(c=>c.name.toLowerCase().includes(q)));
}

document.addEventListener("DOMContentLoaded",()=>{

  // CREATE TIME/DAY/DATE BOX
  const timeBox = document.createElement("div");
  timeBox.id = "timeBox";
  timeBox.style.position = "fixed"; // scroll-friendly
  timeBox.style.top = "5px";
  timeBox.style.right = "5px";
  timeBox.style.background = "rgba(0,0,0,0.5)";
  timeBox.style.color = "#fff";
  timeBox.style.padding = "5px 9px";
  timeBox.style.borderRadius = "10px";
  timeBox.style.fontFamily = "Arial, sans-serif";
  timeBox.style.fontSize = "8px";  // front aro boro
  timeBox.style.fontWeight = "bold";
  timeBox.style.zIndex = "9999";
  timeBox.style.cursor = "default";
  timeBox.style.whiteSpace = "nowrap";
  timeBox.style.overflow = "hidden";
  timeBox.style.textAlign = "center";
  document.body.appendChild(timeBox);

  // FUNCTION TO GET CURRENT TIME, DAY, DATE
  const updateTime = ()=>{
    const now = new Date();

    // Time with AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const seconds = now.getSeconds().toString().padStart(2,'0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 -> 12
    const timeStr = `${hours.toString().padStart(2,'0')}:${minutes}:${seconds} ${ampm}`;

    // Day
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    // Date
    const date = now.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });

    // Combine
    timeBox.innerText = `${timeStr} | ${day} | ${date}`;
  }

  // Update every second
  setInterval(updateTime,1000);
  updateTime(); // initial call

  // FUNCTION TO UPDATE POSITION (relative to video if playing)
  function updateTimeBoxPosition(){
    const leftDiv = document.getElementById("left"); // main video left box
    const playerBox = document.getElementById("player");
    if(leftDiv && leftDiv.style.display !== "none" && playerBox){
      // playing channel → position relative to video box
      const rect = playerBox.getBoundingClientRect();
      timeBox.style.top = (rect.top + 0)+"px";
      timeBox.style.right = (window.innerWidth - rect.right + 2)+"px";
      timeBox.style.position = "fixed"; // scroll-friendly
    } else {
      // no playing → top-right fixed
      timeBox.style.top = "5px";
      timeBox.style.right = "5px";
      timeBox.style.position = "fixed";
    }
  }

  // Update position on scroll & resize
  window.addEventListener("scroll", updateTimeBoxPosition);
  window.addEventListener("resize", updateTimeBoxPosition);

  // Observe for channel play changes
  const observer = new MutationObserver(updateTimeBoxPosition);
  observer.observe(document.body,{subtree:true, childList:true, attributes:true});

});
document.addEventListener("DOMContentLoaded",()=>{

  const tg = document.createElement("a");
  tg.href = "";
  tg.target = "_blank";
  tg.id = "telegramChat";

  tg.innerHTML = `
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
      <path d="M9.04 15.84 8.7 19.6c.49 0 .7-.21.96-.46l2.3-2.2 4.77 3.49c.87.48 1.49.23 1.7-.8l3.08-14.44h0c.26-1.22-.44-1.7-1.28-1.39L1.62 9.2c-1.18.46-1.16 1.12-.2 1.42l4.7 1.47L17.4 5.9c.55-.36 1.06-.16.64.2"/>
    </svg>
  `;

  Object.assign(tg.style,{
    position:"fixed",
    bottom:"20px",
    right:"20px",
    width:"52px",
    height:"52px",
    background:"#229ED9",
    borderRadius:"50%",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    boxShadow:"0 4px 12px rgba(0,0,0,.3)",
    zIndex:"99999",
    textDecoration:"none"
  });

  document.body.appendChild(tg);

});

