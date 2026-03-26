// ===================== 实验核心参数配置 =====================
const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    trialCount: 12,
    practiceTrialCount: 4,
    formalTrialsTotal: 72,
    formalBlockSize: 18,
    stage: "practice",
    practiceStimuli: [
        { name: "c30LL", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30LL.mp4" },
        { name: "c30LR", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30LR.mp4" },
        { name: "c30RL", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30RL.mp4" },
        { name: "c30RR", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30RR.mp4" },
    ],
    formalStimuli: [
        { name: "c20LL", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c20LL.mp4" },
        { name: "c20LR", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c20LR.mp4" },
        { name: "c20RL", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c20RL.mp4" },
        { name: "c20RR", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c20RR.mp4" },
        { name: "c30LL", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30LL.mp4" },
        { name: "c30LR", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30LR.mp4" },
        { name: "c30RL", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30RL.mp4" },
        { name: "c30RR", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30RR.mp4" },
        { name: "c40LL", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c40LL.mp4" },
        { name: "c40LR", correctKey: "V", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c40LR.mp4" },
        { name: "c40RL", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c40RL.mp4" },
        { name: "c40RR", correctKey: "B", url: "https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c40RR.mp4" },
    ],
    fixPointTime1: 1500,
    fixPointTime2: 500,
    blankScreenTime: 100,
    videoPlayTime: 2500,
    responseTimeout: 10000,
    keys: {
        judge: ["V", "B"],
        confidence: ["1","2","3","4"]
    },
    expData: [],
    currentTrial: 0,
    currentStimulus: null,
    trialTemp: {
        stimName: "",
        correctKey: "",
        key1: "", rt1: 0, status1: "", conf1: "", rt_conf1: 0,
        key2: "", rt2: 0, status2: "", conf2: "", rt_conf2: 0,
        completeTime: ""
    },
    videoCache: {}
};

// ===================== 页面元素初始化 =====================
const $infoScreen = $("#info-screen");
const $subjectName = $("#subject-name");
const $subjectId = $("#subject-id");
const $nameError = $("#name-error");
const $idError = $("#id-error");
const $submitInfo = $("#submit-info");
const $startScreen = $("#start-screen");
const $startBtn = $("#start-btn");
const $expContainer = $("#exp-container");
const $canvas = $("#exp-canvas");
const $textPanel = $("#text-panel");
const $panelContent = $("#panel-content");
const canvas = document.getElementById("exp-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

// ===================== 被试信息验证 =====================
$submitInfo.click(() => {
    let isValid = true;
    const nameVal = $subjectName.val().trim();
    const idVal = $subjectId.val().trim();
    const nameReg = /^[a-z]+$/;

    if (!nameReg.test(nameVal)) {
        $nameError.show();
        isValid = false;
    } else {
        $nameError.hide();
    }

    if (idVal === "") {
        $idError.show();
        isValid = false;
    } else {
        $idError.hide();
    }

    if (isValid) {
        EXP_CONFIG.subjectName = nameVal;
        EXP_CONFIG.subjectId = idVal;
        $infoScreen.hide();
        $startScreen.addClass("show");
    }
});

$subjectName.focus(() => $nameError.hide());
$subjectId.focus(() => $idError.hide());

// ===================== 核心函数 =====================
function showTextPanel(content, callback) {
    $panelContent.html(content);
    $textPanel.css("display", "flex");
    if (callback) {
        $(document).off("keydown").on("keydown", function(e) {
            callback(e);
        });
    }
}

function hideTextPanel() {
    $textPanel.hide();
    $(document).off("keydown");
}

function drawFixPoint(color = "#fff") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 20);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getFormattedTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// ===================== 预加载所有视频 =====================
async function preloadAllVideos() {
    const allVideos = [...EXP_CONFIG.practiceStimuli, ...EXP_CONFIG.formalStimuli];
    const uniqueUrls = Array.from(new Set(allVideos.map(v => v.url)));
    let loaded = 0;

    return new Promise((resolve) => {
        showTextPanel(`<h3>正在加载视频，请稍候...</h3><p>加载进度：${loaded}/${uniqueUrls.length}</p>`, null);

        uniqueUrls.forEach(url => {
            const video = document.createElement("video");
            video.muted = true;
            video.preload = "auto";
            video.src = url;

            video.addEventListener("canplaythrough", () => {
                EXP_CONFIG.videoCache[url] = video;
                loaded++;
                $panelContent.html(`<h3>正在加载视频，请稍候...</h3><p>加载进度：${loaded}/${uniqueUrls.length}</p>`);
                if (loaded === uniqueUrls.length) {
                    hideTextPanel();
                    resolve();
                }
            });

            video.load();
        });
    });
}

// ===================== 从缓存播放视频 =====================
function playStimulusVideo(url, duration) {
    return new Promise((resolve) => {
        const video = EXP_CONFIG.videoCache[url];
        if (!video) {
            console.warn("视频未缓存:", url);
            resolve();
            return;
        }

        video.currentTime = 0;
        video.play();

        const drawFrame = () => {
            if (!video.paused && !video.ended) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                requestAnimationFrame(drawFrame);
            }
        };
        drawFrame();

        setTimeout(() => {
            video.pause();
            video.currentTime = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            resolve();
        }, duration);
    });
}

// ===================== 分块上传 + 清空数据 =====================
function uploadBlockData(blockIndex) {
    if (EXP_CONFIG.expData.length === 0) {
        console.log("当前组无数据，跳过上传");
        return Promise.resolve();
    }

    const headers = Object.keys(EXP_CONFIG.expData[0]).join(",");
    const rows = EXP_CONFIG.expData.map(d => Object.values(d).join(",")).join("\n");
    const csv = headers + "\n" + rows;
    const filename = `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_第${blockIndex}组_18个试次.csv`;

    return fetch("https://xcx.51putong.com/upload-dot-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, filename })
    })
    .then(() => {
        console.log(`✅ 第${blockIndex}组上传成功`);
        EXP_CONFIG.expData = [];
    })
    .catch(err => console.error("❌ 上传失败", err));
}

// ===================== 休息页面 =====================
function showRestScreen(blockIndex, callback) {
    showTextPanel(`
        <h3>第 ${blockIndex} 组完成，请休息一下</h3>
        <p>数据已自动保存</p>
        <p>准备好后按空格键继续</p>
    `, (e) => {
        if (e.code === "Space") {
            hideTextPanel();
            callback();
        }
    });
}

// ===================== 阶段结果展示 =====================
function showStageResult() {
    let dataInStage = EXP_CONFIG.expData.filter(d => d.阶段 === EXP_CONFIG.stage);
    let total = dataInStage.length || 1;
    let correct1 = dataInStage.filter(d => d.第一次判断结果 === "CORRECT").length;
    let correct2 = dataInStage.filter(d => d.第二次判断结果 === "CORRECT").length;
    let acc1 = (correct1 / total * 100).toFixed(1);
    let acc2 = (correct2 / total * 100).toFixed(1);

    let content = `<h3>练习阶段结束！</h3>
        <p>第一次判断正确率：${acc1}%</p>
        <p>第二次判断正确率：${acc2}%</p>`;

    if (acc1 >= 60) {
        content += `<p>恭喜你达到合格标准！请按 <strong>O</strong> 键进入正式游戏第一轮</p>`;
    } else {
        content += `<p>正确率未达标，请按 <strong>P</strong> 键重新练习</p>`;
    }

    $panelContent.html(content);
    $textPanel.css("display", "flex");

    $(document).off("keydown").on("keydown", function(e) {
        const key = e.key.toUpperCase();
        if (acc1 >= 60 && key === "O") {
            EXP_CONFIG.stage = "formal1";
            EXP_CONFIG.currentTrial = 0;
            $textPanel.hide();
            runSingleTrial();
        } else if (acc1 < 60 && key === "P") {
            EXP_CONFIG.currentTrial = 0;
            EXP_CONFIG.expData = EXP_CONFIG.expData.filter(d => d.阶段 !== "practice");
            $textPanel.hide();
            runSingleTrial();
        }
    });
}

// ===================== 单个试次流程 =====================
async function runSingleTrial() {
    if (EXP_CONFIG.stage === "practice") {
        if (EXP_CONFIG.currentTrial >= EXP_CONFIG.practiceTrialCount) {
            showStageResult();
            return;
        }
    } else {
        if (EXP_CONFIG.currentTrial >= EXP_CONFIG.formalTrialsTotal) {
            endExperiment();
            return;
        }

        if (EXP_CONFIG.currentTrial % EXP_CONFIG.formalBlockSize === 0 && EXP_CONFIG.currentTrial > 0) {
            const blockIndex = Math.floor(EXP_CONFIG.currentTrial / EXP_CONFIG.formalBlockSize);
            await uploadBlockData(blockIndex);
            await new Promise(resolve => showRestScreen(blockIndex, resolve));
        }
    }

    const currentStimuli = EXP_CONFIG.stage === "practice"
        ? EXP_CONFIG.practiceStimuli
        : EXP_CONFIG.formalStimuli;

    const shuffledKey = `shuffled_${EXP_CONFIG.stage}`;
    if (!EXP_CONFIG[shuffledKey]) {
        EXP_CONFIG[shuffledKey] = [];
        for (let i = 0; i < 10; i++) {
            const s = [...currentStimuli];
            for (let j = s.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [s[j], s[k]] = [s[k], s[j]];
            }
            EXP_CONFIG[shuffledKey].push(...s);
        }
    }

    EXP_CONFIG.currentStimulus = EXP_CONFIG[shuffledKey][EXP_CONFIG.currentTrial];

    EXP_CONFIG.trialTemp = {
        stimName: EXP_CONFIG.currentStimulus.name,
        correctKey: EXP_CONFIG.currentStimulus.correctKey,
        key1: "", rt1: 0, status1: "", conf1: "", rt_conf1: 0,
        key2: "", rt2: 0, status2: "", conf2: "", rt_conf2: 0,
        completeTime: ""
    };

    $expContainer.css("display", "flex");
    drawFixPoint("#ff0000");
    await wait(EXP_CONFIG.fixPointTime1);
    clearCanvas();
    await wait(EXP_CONFIG.blankScreenTime);
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $expContainer.hide();

    const judgeStartTime1 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>请做第一次判断</h3><p>“V” 左侧有规律，“B” 右侧有规律</p>`, async (e) => {
            let key = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(key)) {
                hideTextPanel();
                let rt1 = Date.now() - judgeStartTime1;
                let status1 = (key === EXP_CONFIG.trialTemp.correctKey) ? "CORRECT" : "INCORRECT";
                EXP_CONFIG.trialTemp.key1 = key;
                EXP_CONFIG.trialTemp.rt1 = rt1;
                EXP_CONFIG.trialTemp.status1 = status1;
                resolve();
            }
        });
    });

    const confStartTime1 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>信心评分</h3>
            <p>判断后请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
            <p>1：😭 完全没信心 &nbsp;&nbsp; 2：🙁 不太有信心 &nbsp;&nbsp; 3：🙂 比较有信心 &nbsp;&nbsp; 4：😃 非常有信心</p>`, async (e) => {
            let confKey = e.key.toUpperCase();
            if (EXP_CONFIG.keys.confidence.includes(confKey)) {
                hideTextPanel();
                let rt_conf1 = Date.now() - confStartTime1;
                EXP_CONFIG.trialTemp.conf1 = confKey;
                EXP_CONFIG.trialTemp.rt_conf1 = rt_conf1;
                resolve();
            }
        });
    });

    $expContainer.css("display", "flex");
    drawFixPoint("#ffffff");
    await wait(EXP_CONFIG.fixPointTime2);
    clearCanvas();
    await wait(EXP_CONFIG.blankScreenTime);
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $expContainer.hide();

    const judgeStartTime2 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>请做第二次判断</h3><p>“V” 左侧有规律，“B” 右侧有规律</p>`, async (e) => {
            let key2 = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(key2)) {
                hideTextPanel();
                let rt2 = Date.now() - judgeStartTime2;
                let status2 = (key2 === EXP_CONFIG.trialTemp.correctKey) ? "CORRECT" : "INCORRECT";
                EXP_CONFIG.trialTemp.key2 = key2;
                EXP_CONFIG.trialTemp.rt2 = rt2;
                EXP_CONFIG.trialTemp.status2 = status2;
                resolve();
            }
        });
    });

    const confStartTime2 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>信心评分</h3>
            <p>判断后请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
            <p>1：😭 完全没信心 &nbsp;&nbsp; 2：🙁 不太有信心 &nbsp;&nbsp; 3：🙂 比较有信心 &nbsp;&nbsp; 4：😃 非常有信心</p>`, async (e) => {
            let confKey2 = e.key.toUpperCase();
            if (EXP_CONFIG.keys.confidence.includes(confKey2)) {
                hideTextPanel();
                let rt_conf2 = Date.now() - confStartTime2;
                EXP_CONFIG.trialTemp.conf2 = confKey2;
                EXP_CONFIG.trialTemp.rt_conf2 = rt_conf2;
                EXP_CONFIG.trialTemp.completeTime = getFormattedTime();
                resolve();
            }
        });
    });

    EXP_CONFIG.expData.push({
        阶段: EXP_CONFIG.stage,
        被试姓名: EXP_CONFIG.subjectName,
        被试编号: EXP_CONFIG.subjectId,
        试次: EXP_CONFIG.currentTrial + 1,
        刺激名称: EXP_CONFIG.trialTemp.stimName,
        正确按键: EXP_CONFIG.trialTemp.correctKey,
        第一次判断按键: EXP_CONFIG.trialTemp.key1,
        第一次判断反应时: EXP_CONFIG.trialTemp.rt1,
        第一次判断结果: EXP_CONFIG.trialTemp.status1,
        第一次信心评分: EXP_CONFIG.trialTemp.conf1,
        第一次信心评分反应时: EXP_CONFIG.trialTemp.rt_conf1,
        第二次判断按键: EXP_CONFIG.trialTemp.key2,
        第二次判断反应时: EXP_CONFIG.trialTemp.rt2,
        第二次判断结果: EXP_CONFIG.trialTemp.status2,
        第二次信心评分: EXP_CONFIG.trialTemp.conf2,
        第二次信心评分反应时: EXP_CONFIG.trialTemp.rt_conf2,
        试次完成实时时间: EXP_CONFIG.trialTemp.completeTime
    });

    EXP_CONFIG.currentTrial++;
    runSingleTrial();
}

// ===================== 实验结束 =====================
async function endExperiment() {
    await uploadBlockData(4);
    showTextPanel(`<h3>游戏完成！</h3>
        <p>感谢你的参与！</p>
        <p>按任意键结束</p>`, () => {
        $expContainer.hide();
        hideTextPanel();
    });
}

// ===================== 实验初始化 =====================
$(document).ready(async () => {
    $startBtn.click(async () => {
        $startScreen.removeClass("show");
        await preloadAllVideos();

        showTextPanel(`<h3>欢迎参加捕捉点阵游戏！</h3>
            <p>你将看到两个点阵，其中一个点阵中有一部分点会一致性向左/向右运动，</p>
            <p>另一个点阵的点全部随机运动。请判断哪边点阵的点有一致性运动。在每一轮里，你需要完成两次判断。</p><br>
            <img src="./image/dot-example.png" alt="点阵示意图" style="max-width: 80%; height: auto; margin: 5px auto; display: block;"><br>
            <p style="background-color: yellow; color: black; padding: 5px;"><strong>左侧有一致性运动按“V”键，右侧有一致性运动按“B”键</strong></p><br>
            <p>每次判断后，请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
            <p>1：😭 完全没信心 &nbsp;&nbsp; 2：🙁 不太有信心 &nbsp;&nbsp; 3：🙂 比较有信心 &nbsp;&nbsp; 4：😃 非常有信心</p><br>
            <p>如果你理解了以上规则，请你将手指放到键盘对应的位置上</p>
            <p><strong>请按空格键继续</strong></p>`, e => {
            if (e.code === 'Space') {
                hideTextPanel();
                runSingleTrial();
            }
        });
    });
});
