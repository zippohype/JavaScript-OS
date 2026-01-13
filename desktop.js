(function(){
  // --- Clear page ---
  document.documentElement.innerHTML="";
  const html=document.documentElement;
  const body=document.createElement("body");
  html.appendChild(body);
  html.style.overflow="hidden"; html.style.height="100%"; html.style.width="100%";
  body.style.overflow="hidden"; body.style.height="100%"; body.style.width="100%";
  body.style.margin="0"; body.style.touchAction="none"; body.style.fontFamily="sans-serif";
  body.style.background="#2e3436"; body.style.color="white"; body.style.userSelect="none"; 
  let zIndexCounter=1;

  // --- Boot screen ---
  const bootScreen=document.createElement("div");
  bootScreen.style.position="fixed";
  bootScreen.style.top="0";
  bootScreen.style.left="0";
  bootScreen.style.width="100%";
  bootScreen.style.height="100%";
  bootScreen.style.background="black";
  bootScreen.style.zIndex="9999";
  body.appendChild(bootScreen);

  // --- Logs container ---
  const logContainer=document.createElement("div");
  logContainer.style.position="absolute";
  logContainer.style.bottom="10px";
  logContainer.style.left="10px";
  logContainer.style.fontFamily="monospace";
  logContainer.style.fontSize="12px";
  logContainer.style.color="lime";
  logContainer.style.lineHeight="1.2em";
  bootScreen.appendChild(logContainer);

  function requestFullscreen(){const e=document.documentElement;if(e.requestFullscreen)e.requestFullscreen();else if(e.webkitRequestFullscreen)e.webkitRequestFullscreen();else if(e.msRequestFullscreen)e.msRequestFullscreen();}
  document.addEventListener("click",requestFullscreen,{once:true});
  document.addEventListener("touchstart",requestFullscreen,{once:true});

  // --- Boot logs ---
  const bootLogsBase=[
    "Initializing WebDesktop Kernel...",
    "Loading virtual drivers...",
    "eth0: link detected",
    "Mounting virtual filesystem...",
    "USB devices detected: 3",
    "Starting system services...",
    "Loading theme modules...",
    "Initializing desktop icons...",
    "Launching App Store...",
    "Loading wallpaper manager...",
    "Initializing dock...",
    "Loading default apps...",
    "Finalizing boot sequence..."
  ];

  let bootLogs=[];
  for(let i=0;i<bootLogsBase.length;i++){
    bootLogs.push(bootLogsBase[i]);
    if(Math.random()<0.3) bootLogs.push("Checking system integrity...");
    if(Math.random()<0.3) bootLogs.push("Applying security patches...");
  }

  let logIndex=0;
  function showNextLog(){
    if(logIndex<bootLogs.length){
      const line=document.createElement("div");
      line.textContent=bootLogs[logIndex];
      logContainer.appendChild(line);
      logIndex++;
      const delay=50 + Math.random()*950; // 0.05 - 1 second
      setTimeout(showNextLog, delay);
    } else {
      const readyLine=document.createElement("div");
      readyLine.textContent="WebDesktop ready!";
      logContainer.appendChild(readyLine);
      setTimeout(()=>bootScreen.remove(),800);
      setTimeout(startDesktop,800);
    }
  }
  showNextLog();

  function startDesktop(){
    body.style.overflow="hidden";

    // --- Themes & wallpapers ---
    let currentWallpaper=null;
    let currentTheme="dark";
    const wallpapers=["https://picsum.photos/id/1015/1920/1080","https://picsum.photos/id/1025/1920/1080","https://picsum.photos/id/1035/1920/1080"];
    function setWallpaper(url){currentWallpaper=url; desktop.style.backgroundImage=`url(${url})`; desktop.style.backgroundSize="cover"; desktop.style.backgroundPosition="center";}

    // --- Virtual desktops ---
    let currentWorkspace=0;
    const workspaces=[[],[],[]]; // 3 workspaces

    // --- Drag & resize ---
    function makeDraggable(win,header){let offsetX=0,offsetY=0,dragging=false;
      function startDrag(e){dragging=true;const rect=win.getBoundingClientRect();let cx=e.clientX||e.touches[0].clientX;let cy=e.clientY||e.touches[0].clientY;offsetX=cx-rect.left;offsetY=cy-rect.top;win.style.zIndex=++zIndexCounter;}
      function onDrag(e){if(dragging){let cx=e.clientX||e.touches[0].clientX;let cy=e.clientY||e.touches[0].clientY;win.style.left=cx-offsetX+"px";win.style.top=cy-offsetY+"px";}}
      function endDrag(){dragging=false;}
      header.addEventListener("mousedown",startDrag);header.addEventListener("touchstart",startDrag);
      document.addEventListener("mousemove",onDrag);document.addEventListener("touchmove",onDrag,{passive:false});
      document.addEventListener("mouseup",endDrag);document.addEventListener("touchend",endDrag);
    }
    function makeResizable(win){const resizer=document.createElement("div");resizer.style.width="12px";resizer.style.height="12px";resizer.style.background="white";resizer.style.position="absolute";resizer.style.right="0";resizer.style.bottom="0";resizer.style.cursor="nwse-resize";resizer.style.borderRadius="3px";win.appendChild(resizer);
      let resizing=false,startX,startY,startW,startH;
      function startResize(e){e.stopPropagation();resizing=true;startX=e.clientX||e.touches[0].clientX;startY=e.clientY||e.touches[0].clientY;const rect=win.getBoundingClientRect();startW=rect.width;startH=rect.height;win.style.zIndex=++zIndexCounter;}
      function onResize(e){if(resizing){let cx=e.clientX||e.touches[0].clientX;let cy=e.clientY||e.touches[0].clientY;win.style.width=Math.max(150,startW+(cx-startX))+"px";win.style.height=Math.max(100,startH+(cy-startY))+"px";}}
      function endResize(){resizing=false;}
      resizer.addEventListener("mousedown",startResize);resizer.addEventListener("touchstart",startResize);
      document.addEventListener("mousemove",onResize);document.addEventListener("touchmove",onResize,{passive:false});
      document.addEventListener("mouseup",endResize);document.addEventListener("touchend",endResize);
    }

    // --- Desktop ---
    const desktop=document.createElement("div");
    desktop.style.position="absolute";
    desktop.style.top="30px";
    desktop.style.left="0";
    desktop.style.right="0";
    desktop.style.bottom="50px";
    desktop.style.overflow="hidden";
    desktop.style.display="flex";
    desktop.style.flexWrap="wrap";
    desktop.style.alignContent="flex-start";
    desktop.style.padding="10px";
    body.appendChild(desktop);

    // --- Top bar ---
    const topBar=document.createElement("div");
    topBar.style.position="absolute";
    topBar.style.top="0";
    topBar.style.left="0";
    topBar.style.right="0";
    topBar.style.height="30px";
    topBar.style.background="#111";
    topBar.style.display="flex";
    topBar.style.alignItems="center";
    topBar.style.justifyContent="space-between";
    topBar.style.padding="0 10px";
    topBar.style.color="white";
    body.appendChild(topBar);

    const leftBar=document.createElement("div");topBar.appendChild(leftBar);
    const rightBar=document.createElement("div");topBar.appendChild(rightBar);

    // --- Workspace buttons ---
    const workspaceBtns=[];
    for(let i=0;i<3;i++){
      const btn=document.createElement("button");
      btn.innerText="WS "+(i+1);
      btn.style.marginRight="5px";btn.style.padding="2px 6px";btn.style.borderRadius="5px";
      btn.onclick=()=>{switchWorkspace(i)};
      leftBar.appendChild(btn);workspaceBtns.push(btn);
    }

    const timeLabel=document.createElement("span");rightBar.appendChild(timeLabel);
    const powerBtn=document.createElement("button");powerBtn.innerText="⏻";powerBtn.style.marginLeft="10px";rightBar.appendChild(powerBtn);
    powerBtn.onclick=()=>location.reload();
    setInterval(()=>{const d=new Date();timeLabel.innerText=d.toLocaleTimeString()+" "+d.toLocaleDateString();},1000);

    // --- Dock ---
    const dock=document.createElement("div");
    dock.style.position="absolute"; dock.style.bottom="0"; dock.style.left="0"; dock.style.height="50px";
    dock.style.background="#222"; dock.style.display="flex"; dock.style.alignItems="center"; dock.style.padding="0 10px";
    dock.style.borderRadius="10px"; dock.style.transition="width 0.3s"; body.appendChild(dock);

    function adjustDockWidth(){dock.style.width=(dock.children.length*60+20)+"px";}

    // --- Window creation ---
    function createWindow(title,width=400,height=300,contentHtml=""){
      const win=document.createElement("div");win.style.position="absolute";win.style.top="50px";win.style.left="50px";win.style.width=width+"px";win.style.height=height+"px";win.style.background="#2e3436";win.style.border="2px solid #555";win.style.borderRadius="6px";win.style.boxShadow="0 5px 15px rgba(0,0,0,0.5)";win.style.display="flex";win.style.flexDirection="column";win.style.overflow="hidden";win.style.zIndex=++zIndexCounter;
      const header=document.createElement("div");header.innerText=title;header.style.background="#444";header.style.height="25px";header.style.display="flex";header.style.alignItems="center";header.style.padding="0 10px";header.style.cursor="move";header.style.color="white";
      const minBtn=document.createElement("span");minBtn.innerText="—";minBtn.style.marginLeft="auto";minBtn.style.marginRight="5px";minBtn.style.cursor="pointer";
      const maxBtn=document.createElement("span");maxBtn.innerText="⬜";maxBtn.style.marginRight="5px";maxBtn.style.cursor="pointer";
      const closeBtn=document.createElement("span");closeBtn.innerText="✖";closeBtn.style.cursor="pointer";
      header.appendChild(minBtn);header.appendChild(maxBtn);header.appendChild(closeBtn);win.appendChild(header);
      const content=document.createElement("div");content.style.flex="1";content.style.padding="10px";content.style.overflow="auto";content.style.background="#333";content.innerHTML=contentHtml;win.appendChild(content);
      desktop.appendChild(win);makeDraggable(win,header);makeResizable(win);
      const icon=document.createElement("div");icon.style.width="50px";icon.style.height="50px";icon.style.marginRight="5px";icon.style.display="flex";icon.style.alignItems="center";icon.style.justifyContent="center";icon.style.background="#555";icon.style.borderRadius="10px";icon.style.cursor="pointer";dock.appendChild(icon);adjustDockWidth();
      closeBtn.onclick=()=>{win.remove();icon.remove();adjustDockWidth();}
      minBtn.onclick=()=>{win.style.display="none";}
      maxBtn.onclick=()=>{if(win.dataset.maximized!=="true"){win.dataset.oldTop=win.style.top;win.dataset.oldLeft=win.style.left;win.dataset.oldWidth=win.style.width;win.dataset.oldHeight=win.style.height;win.style.top="0";win.style.left="0";win.style.width="100%";win.style.height="calc(100% - 50px)";win.dataset.maximized="true";}else{win.style.top=win.dataset.oldTop;win.style.left=win.dataset.oldLeft;win.style.width=win.dataset.oldWidth;win.style.height=win.dataset.oldHeight;win.dataset.maximized="false";}}
      icon.onclick=()=>{win.style.display="flex";win.style.zIndex=++zIndexCounter;}
      return {win,content,icon};
    }

    // --- Switch workspaces ---
    function switchWorkspace(index){
      currentWorkspace=index;
      desktop.childNodes.forEach(c=>c.style.display="none");
      workspaces[index].forEach(win=>win.style.display="flex");
    }

    // --- Apps ---
    function addApp(name,emoji,contentHtml){return createWindow(name,400,300,contentHtml);}
    
    addApp("Terminal","💻","<pre>Welcome to Web Terminal\nType 'help'</pre>");
    addApp("Notes","📝","<textarea style='width:100%;height:100%;background:#222;color:#fff;border:none;padding:5px;'>Notes</textarea>");
    addApp("Paint","🎨","<canvas style='width:100%;height:100%;background:#fff;display:block;'></canvas>");
    addApp("Clock","⏰","<div style='font-size:24px;text-align:center;'>Clock</div>");
    addApp("Calculator","🖩","<div style='font-size:20px;'>Calculator</div>");
    addApp("Browser","🌐","<div style='font-size:20px;'>Fake Browser</div>");
    addApp("Music","🎵","<div style='font-size:20px;'>Music Player</div>");
    addApp("Files","📁","<div style='font-size:20px;'>File Explorer</div>");
    addApp("Settings","⚙️","<div style='font-size:20px;'>Settings</div>");

    // Set default wallpaper
    setWallpaper(wallpapers[0]);
  }
})();      const header=document.createElement("div");header.innerText=title;header.style.background="#444";header.style.height="25px";header.style.display="flex";header.style.alignItems="center";header.style.padding="0 10px";header.style.cursor="move";header.style.color="white";
      const minBtn=document.createElement("span");minBtn.innerText="—";minBtn.style.marginLeft="auto";minBtn.style.marginRight="5px";minBtn.style.cursor="pointer";
      const maxBtn=document.createElement("span");maxBtn.innerText="⬜";maxBtn.style.marginRight="5px";maxBtn.style.cursor="pointer";
      const closeBtn=document.createElement("span");closeBtn.innerText="✖";closeBtn.style.cursor="pointer";
      header.appendChild(minBtn);header.appendChild(maxBtn);header.appendChild(closeBtn);win.appendChild(header);
      const content=document.createElement("div");content.style.flex="1";content.style.padding="10px";content.style.overflow="auto";content.style.background="#333";content.innerHTML=contentHtml;win.appendChild(content);
      desktop.appendChild(win);makeDraggable(win,header);makeResizable(win);
      const taskbarBtn=document.createElement("div");taskbarBtn.innerText=title;taskbarBtn.style.padding="2px 8px";taskbarBtn.style.marginRight="5px";taskbarBtn.style.background="#555";taskbarBtn.style.borderRadius="4px";taskbarBtn.style.cursor="pointer";taskbarBtn.style.color="white";taskbar.appendChild(taskbarBtn);
      closeBtn.onclick=()=>{win.remove();taskbarBtn.remove();};minBtn.onclick=()=>win.style.display="none";maxBtn.onclick=()=>{if(win.dataset.maximized!=="true"){win.dataset.oldTop=win.style.top;win.dataset.oldLeft=win.style.left;win.dataset.oldWidth=win.style.width;win.dataset.oldHeight=win.style.height;win.style.top="0";win.style.left="0";win.style.width="100%";win.style.height="calc(100% - 50px)";win.dataset.maximized="true";}else{win.style.top=win.dataset.oldTop;win.style.left=win.dataset.oldLeft;win.style.width=win.dataset.oldWidth;win.style.height=win.dataset.oldHeight;win.dataset.maximized="false";}};taskbarBtn.onclick=()=>{win.style.display="flex";win.style.zIndex=++zIndexCounter;};
      return {win,content};
    }

    // --- Dock icons & apps ---
    function createIcon(name,emoji,callback){
      const icon=document.createElement("div");icon.style.width="60px";icon.style.height="60px";icon.style.margin="10px";icon.style.display="flex";icon.style.flexDirection="column";icon.style.alignItems="center";icon.style.justifyContent="center";icon.style.cursor="pointer";
      icon.innerHTML=`<div style="font-size:30px;">${emoji}</div><div style="font-size:12px;text-align:center;">${name}</div>`;
      dock.appendChild(icon);icon.addEventListener("click",callback);
    }

    // Terminal
    createIcon("Terminal","💻",()=>{
      const {win} = createWindow("Terminal",400,300,"<pre id='term-output'>Welcome to Web Terminal\nType 'help' for commands.</pre><input id='term-input' style='width:100%;background:#222;color:#0f0;border:none;padding:5px;' autofocus>");
      const input=win.querySelector("#term-input"); const output=win.querySelector("#term-output");
      input.addEventListener("keydown",e=>{if(e.key==="Enter"){const val=input.value;let res="Command not found";if(val==="help")res="Commands: help, echo [text], date";else if(val.startsWith("echo "))res=val.slice(5);else if(val==="date")res=new Date().toString();output.innerText+="\n$ "+val+"\n"+res;input.value="";output.scrollTop=output.scrollHeight;}});
    });

    // Notes
    createIcon("Notes","📝",()=>{createWindow("Notes",400,300,"<textarea style='width:100%;height:100%;background:#222;color:#fff;border:none;padding:5px;'>Write your notes here...</textarea>");});

    // Paint with touch
    createIcon("Paint","🎨",()=>{
      const {win} = createWindow("Paint",500,400,"<canvas id='paint-canvas' style='width:100%;height:100%;background:#fff;display:block;'></canvas><button id='clearPaint' style='position:absolute;top:30px;right:30px;z-index:10;'>Clear</button>");
      const canvas=win.querySelector("#paint-canvas"); const ctx=canvas.getContext("2d"); 
      function resizeCanvas(){canvas.width=canvas.clientWidth;canvas.height=canvas.clientHeight;} resizeCanvas(); window.addEventListener("resize",resizeCanvas);
      let painting=false,lastX=0,lastY=0;
      function startPos(e){painting=true;const rect=canvas.getBoundingClientRect();lastX=(e.clientX||e.touches[0].clientX)-rect.left;lastY=(e.clientY||e.touches[0].clientY)-rect.top;}
      function endPos(){painting=false;}
      function draw(e){if(!painting)return;const rect=canvas.getBoundingClientRect();let x=(e.clientX||e.touches[0].clientX)-rect.left;let y=(e.clientY||e.touches[0].clientY)-rect.top;ctx.strokeStyle="black";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(x,y);ctx.stroke();lastX=x;lastY=y;}
      canvas.addEventListener("mousedown",startPos);canvas.addEventListener("mouseup",endPos);canvas.addEventListener("mousemove",draw);
      canvas.addEventListener("touchstart",startPos);canvas.addEventListener("touchend",endPos);canvas.addEventListener("touchmove",draw,{passive:false});
      win.querySelector("#clearPaint").addEventListener("click",()=>{ctx.clearRect(0,0,canvas.width,canvas.height);});
    });

    // Clock
    createIcon("Clock","⏰",()=>{const {content} = createWindow("Clock",200,150,"<div id='clock' style='font-size:24px;text-align:center;'></div>");setInterval(()=>{content.innerText=new Date().toLocaleTimeString();},1000);});

    // Settings app (Wallpaper + Theme)
    createIcon("Settings","⚙️",()=>{
      const {content} = createWindow("Settings",300,300,"<h3>Settings</h3><div id='wallpaperContainer'><h4>Wallpaper</h4></div><div id='themeContainer'><h4>Theme</h4></div>");
      const wallpaperContainer=content.querySelector("#wallpaperContainer");
      wallpapers.forEach(w=>{const img=document.createElement("img");img.src=w;img.style.width="80px";img.style.height="60px";img.style.margin="5px";img.style.cursor="pointer";img.addEventListener("click",()=>setWallpaper(w));wallpaperContainer.appendChild(img);});
      const themeContainer=content.querySelector("#themeContainer");
      ["dark","light"].forEach(theme=>{const btn=document.createElement("button");btn.innerText=theme;btn.style.margin="5px";btn.addEventListener("click",()=>{currentTheme=theme;body.style.background=(theme==="dark")?"#2e3436":"#ddd";body.style.color=(theme==="dark")?"#fff":"#000";});themeContainer.appendChild(btn);});
    });

    // Terminal default wallpaper
    setWallpaper(wallpapers[0]);
  }
})();
