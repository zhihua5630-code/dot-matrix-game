const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    trialCount: 16,

    // —————————————— 修正后的精确时间 ——————————————
    fix1: 1500,    // 红色注视点
    blank1: 100,   // 空屏
    video1: 500,   // 点阵呈现 500ms

    fix2: 500,     // 白色注视点
    blank2: 100,   // 空屏
    video2: 500,   // 第二次点阵 500ms

    responseTimeout: 10000,

    stimuli: [
        { name: "c50LL", correctKey: "F", url: "./videos/c50LL.mp4" },
        { name: "c50LR", correctKey: "J", url: "./videos/c50LR.mp4" },
        { name: "c50RL", correctKey: "F", url: "./videos/c50RL.mp4" },
        { name: "c50RR", correctKey: "J", url: "./videos/c50RR.mp4" },
        { name: "c60LL", correctKey: "F", url: "./videos/c60LL.mp4" },
        { name: "c60LR", correctKey: "J", url: "./videos/c60LR.mp4" },
        { name: "c60RL", correctKey: "F", url: "./videos/c60RL.mp4" },
        { name: "c60RR", correctKey: "J", url: "./videos/c60RR.mp4" },
        { name: "c70LL", correctKey: "F", url: "./videos/c70LL.mp4" },
        { name: "c70LR", correctKey: "J", url: "./videos/c70LR.mp4" },
        { name: "c70RL", correctKey: "F", url: "./videos/c70RL.mp4" },
        { name: "c70RR", correctKey: "J", url: "./videos/c70RR.mp4" },
        { name: "c80LL", correctKey: "F", url: "./videos/c80LL.mp4" },
        { name: "c80LR", correctKey: "J", url: "./videos/c80LR.mp4" },
        { name: "c80RL", correctKey: "F", url: "./videos/c80RL.mp4" },
        { name: "c80RR", correctKey: "J", url: "./videos/c80RR.mp4" },
    ],

    keys: { judge: ["F", "J"], confidence: ["1","2","3","4"] },
    expData: [],
    currentTrial: 0,
    currentStimulus: null
};

const $infoScreen    = $("#info-screen");
const $subjectName   = $("#subject-name");
const $subjectId     = $("#subject-id");
const $nameError     = $("#name-error");
const $idError       = $("#id-error");
const $submitInfo    = $("#submit-info");
const $startScreen   = $("#start-screen");
const $startBtn      = $("#start-btn");
const $expContainer  = $("#exp-container");
const $canvas        = $("#exp-canvas");
const $textPanel     = $("#text-panel");
const $panelContent  = $("#panel-content");
const canvas         = document.getElementById("exp-canvas");
const ctx            = canvas.getContext("2d");

canvas.width  = 1024;
canvas.height = 768;

$submitInfo.click(() => {
    let name = $subjectName.val().trim();
    let id   = $subjectId.val().trim();
    if (/^[a-z]+$/.test(name) && id) {
        EXP_CONFIG.subjectName = name;
        EXP_CONFIG.subjectId   = id;
        $infoScreen.hide();
        $startScreen.addClass("show");
    }
});

function showTextPanel(content, callback) {
    $panelContent.html(content);
    $textPanel.css("display", "flex");
    $(document).off("keydown").on("keydown", e => callback(e));
}

function hideTextPanel() {
    $textPanel.hide();
    $(document).off("keydown");
}

function drawFix(color) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    let cx = canvas.width/2, cy = canvas.height/2;
    ctx.beginPath();
    ctx.moveTo(cx-20,cy); ctx.lineTo(cx+20,cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx,cy-20); ctx.lineTo(cx,cy+20);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function playFragment(url, duration) {
    return new Promise(resolve => {
        let vid = document.createElement("video");
        vid.src = url;
        vid.muted = true;
        vid.playsInline = true;
        vid.width = canvas.width;
        vid.height = canvas.height;
        vid.style.display = "none";
        document.body.appendChild(vid);

        vid.oncanplay = () => {
            vid.play().then(() => {
                let anim = () => {
                    if (!vid.paused) {
                        ctx.clearRect(0,0,canvas.width,canvas.height);
                        ctx.drawImage(vid,0,0,canvas.width,canvas.height);
                        requestAnimationFrame(anim);
                    }
                };
                anim();
                setTimeout(() => {
                    vid.pause();
                    vid.remove();
                    clearCanvas();
                    resolve();
                }, duration);
            });
        };
    });
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function getResponse() {
    return new Promise(resolve => {
        let t = Date.now();
        $(document).off("keydown").on("keydown", e => {
            let k = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(k)) {
                let rt = Date.now() - t;
                let cor = k === EXP_CONFIG.currentStimulus.correctKey ? "CORRECT" : "INCORRECT";
                resolve({ key:k, rt, cor });
            }
        });
    });
}

function getConf() {
    return new Promise(resolve => {
        $(document).off("keydown").on("keydown", e => {
            let c = e.key;
            if (EXP_CONFIG.keys.confidence.includes(c)) resolve(c);
        });
    });
}

async function runSingleTrial() {
    if (EXP_CONFIG.currentTrial >= EXP_CONFIG.trialCount) {
        endExp(); return;
    }

    let s = EXP_CONFIG.stimuli[Math.floor(Math.random()*EXP_CONFIG.stimuli.length)];
    EXP_CONFIG.currentStimulus = s;

    $expContainer.css("display","flex");

    // —————————————— 第一次流程 ——————————————
    drawFix("#ff0000");
    await wait(EXP_CONFIG.fix1);

    clearCanvas();
    await wait(EXP_CONFIG.blank1);

    await playFragment(s.url, EXP_CONFIG.video1);

    $expContainer.hide();
    showTextPanel("<h3>请判断</h3><p>F=左 J=右</p>", async () => {
        let res1 = await getResponse();
        hideTextPanel();

        showTextPanel("<h3>信心</h3><p>1 2 3 4</p>", async () => {
            let c1 = await getConf();
            hideTextPanel();

            // —————————————— 第二次流程 ——————————————
            $expContainer.css("display","flex");

            drawFix("#ffffff");
            await wait(EXP_CONFIG.fix2);

            clearCanvas();
            await wait(EXP_CONFIG.blank2);

            await playFragment(s.url, EXP_CONFIG.video2);

            $expContainer.hide();
            showTextPanel("<h3>请判断</h3><p>F=左 J=右</p>", async () => {
                let res2 = await getResponse();
                hideTextPanel();

                showTextPanel("<h3>信心</h3><p>1 2 3 4</p>", async () => {
                    let c2 = await getConf();
                    hideTextPanel();

                    EXP_CONFIG.expData.push({
                        被试:EXP_CONFIG.subjectName, 编号:EXP_CONFIG.subjectId,
                        试次:EXP_CONFIG.currentTrial+1, 刺激:s.name,
                        键1:res1.key, 反应时1:res1.rt, 正确1:res1.cor, 信心1:c1,
                        键2:res2.key, 反应时2:res2.rt, 正确2:res2.cor, 信心2:c2
                    });

                    EXP_CONFIG.currentTrial++;
                    runSingleTrial();
                });
            });
        });
    });
}

function endExp() {
    showTextPanel("<h3>实验结束</h3><p>按任意键保存数据</p>", () => {
        let csv = "被试,编号,试次,刺激,键1,反应时1,正确1,信心1,键2,反应时2,正确2,信心2\n";
        EXP_CONFIG.expData.forEach(d => {
            csv += `${d.被试},${d.编号},${d.试次},${d.刺激},${d.键1},${d.反应时1},${d.正确1},${d.信心1},${d.键2},${d.反应时2},${d.正确2},${d.信心2}\n`;
        });
        let blob = new Blob([csv], {type:"text/csv"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${EXP_CONFIG.subjectId}_数据.csv`;
        a.click();
        hideTextPanel();
    });
}

$startBtn.click(() => {
    $startScreen.removeClass("show");
    showTextPanel("<h3>按空格开始</h3>", e => {
        if (e.code === "Space") {
            hideTextPanel();
            runSingleTrial();
        }
    });
});
