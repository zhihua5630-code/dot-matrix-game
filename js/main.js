const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    trialCount: 16,

    // ====================== 你最终确认的精准时序 ======================
    fix1:    1500,   // 红色注视点 1500ms ✅
    blank1:  100,    // 空屏 100ms ✅（你刚确认的）
    video1:  2500,   // 点阵呈现 2500ms（2000播放+500定格）✅

    fix2:    500,    // 白色注视点 500ms ✅
    blank2:  100,    // 空屏 100ms ✅
    video2:  2500,   // 第二次点阵呈现 2500ms ✅
    // ==================================================================

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

    keys: {
        judge: ["F", "J"],
        confidence: ["1","2","3","4"]
    },
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
    $(document).off("keydown").one("keydown", (e) => {
        callback(e);
        hideTextPanel();
    });
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

function playFragment(url, totalDuration) {
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
                let drawFrame = () => {
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.drawImage(vid,0,0,canvas.width,canvas.height);
                    if (!vid.paused) {
                        requestAnimationFrame(drawFrame);
                    }
                };
                drawFrame();

                setTimeout(() => {
                    vid.pause();
                    vid.remove();
                    clearCanvas();
                    resolve();
                }, totalDuration);
            });
        };
    });
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function runSingleTrial() {
    if (EXP_CONFIG.currentTrial >= EXP_CONFIG.trialCount) {
        endExp(); return;
    }

    let s = EXP_CONFIG.stimuli[Math.floor(Math.random()*EXP_CONFIG.stimuli.length)];
    EXP_CONFIG.currentStimulus = s;

    $expContainer.css("display","flex");

    // ===================== 第一次流程 =====================
    drawFix("#ff0000");
    await wait(EXP_CONFIG.fix1);

    clearCanvas();
    await wait(EXP_CONFIG.blank1);

    await playFragment(s.url, EXP_CONFIG.video1);

    $expContainer.hide();
    showTextPanel(`<h3>请判断</h3><p>“F” 左侧有规律，“J” 右侧有规律</p>`, async () => {
        let res1 = await getResponse();
        hideTextPanel();

        showTextPanel(`<h3>信心评分</h3>
            <p>1：非常不自信 &nbsp;&nbsp; 2：不自信</p>
            <p>3：有信心 &nbsp;&nbsp; 4：非常有信心</p>`, async () => {
            let c1 = await getConf();
            hideTextPanel();

            // ===================== 第二次流程 =====================
            $expContainer.css("display","flex");

            drawFix("#ffffff");
            await wait(EXP_CONFIG.fix2);

            clearCanvas();
            await wait(EXP_CONFIG.blank2);

            await playFragment(s.url, EXP_CONFIG.video2);

            $expContainer.hide();
            showTextPanel(`<h3>请判断</h3><p>“F” 左侧有规律，“J” 右侧有规律</p>`, async () => {
                let res2 = await getResponse();
                hideTextPanel();

                showTextPanel(`<h3>信心评分</h3>
                    <p>1：非常不自信 &nbsp;&nbsp; 2：不自信</p>
                    <p>3：有信心 &nbsp;&nbsp; 4：非常有信心</p>`, async () => {
                    let c2 = await getConf();
                    hideTextPanel();

                    EXP_CONFIG.expData.push({
                        被试姓名: EXP_CONFIG.subjectName,
                        被试编号: EXP_CONFIG.subjectId,
                        试次: EXP_CONFIG.currentTrial+1,
                        刺激名称: s.name,
                        正确按键: s.correctKey,
                        第一次判断按键: res1.key,
                        第一次反应时: res1.rt,
                        第一次判断结果: res1.cor,
                        第一次信心评分: c1,
                        第二次判断按键: res2.key,
                        第二次反应时: res2.rt,
                        第二次判断结果: res2.cor,
                        第二次信心评分: c2
                    });

                    EXP_CONFIG.currentTrial++;
                    runSingleTrial();
                });
            });
        });
    });
}

function getResponse() {
    return new Promise(resolve => {
        let t = Date.now();
        $(document).off("keydown").one("keydown", e => {
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
        $(document).off("keydown").one("keydown", e => {
            let c = e.key;
            if (EXP_CONFIG.keys.confidence.includes(c)) resolve(c);
        });
    });
}

function endExp() {
    let correct1 = EXP_CONFIG.expData.filter(d => d.第一次判断结果 === "CORRECT").length;
    let correct2 = EXP_CONFIG.expData.filter(d => d.第二次判断结果 === "CORRECT").length;
    let acc1 = (correct1 / EXP_CONFIG.trialCount * 100).toFixed(1);
    let acc2 = (correct2 / EXP_CONFIG.trialCount * 100).toFixed(1);

    showTextPanel(`<h3>实验完成！</h3>
        <p>感谢你的参与！</p>
        <p>第一次判断正确率：${acc1}%</p>
        <p>第二次判断正确率：${acc2}%</p>
        <p>按任意键导出数据并结束</p>`, () => {
        exportCSV(EXP_CONFIG.expData, `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_捕捉点阵游戏数据.csv`);
        hideTextPanel();
        $expContainer.hide();
    });
}

function exportCSV(data, filename) {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(d => Object.values(d).join(",")).join("\n");
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

$startBtn.click(() => {
    $startScreen.removeClass("show");
    showTextPanel(`<h3>欢迎参加捕捉点阵游戏！</h3><br>
        <p>你将看到两个点阵，其中一个点阵中有一部分点会规律水平运动（向左/向右），</p>
        <p>另一个点阵的点全部随机运动。请判断哪边点阵的点有规律运动。</p><br>
        <p><strong>左侧有规律按“F”键，右侧有规律按“J”键</strong></p><br>
        <p>判断后需对信心进行评分（1-4分）：</p>
        <p>1：非常不自信 &nbsp;&nbsp; 2：不自信</p>
        <p>3：有信心 &nbsp;&nbsp; 4：非常有信心</p><br><br>
        <p><strong>请按空格键继续</strong></p>`, e => {
        if (e.code === "Space") {
            hideTextPanel();
            runSingleTrial();
        }
    });
});
