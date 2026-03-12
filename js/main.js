// ===================== 实验核心参数配置 =====================
const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    // 练习：c30 共4个
    practiceTrialCount: 4,
    // 正式：每轮 12个视频×5遍 = 60个试次
    formalTrialsPerRound: 60,
    fixPointTime1: 1500,
    fixPointTime2: 500,
    blankScreenTime: 100,
    videoPlayTime: 2500,
    responseTimeout: 10000,

    // 练习刺激：只 c30
    practiceStimuli: [
        { name: "c30LL", correctKey: "V", url: "./videos/c30LL.mp4" },
        { name: "c30LR", correctKey: "V", url: "./videos/c30LR.mp4" },
        { name: "c30RL", correctKey: "B", url: "./videos/c30RL.mp4" },
        { name: "c30RR", correctKey: "B", url: "./videos/c30RR.mp4" },
    ],
    // 正式刺激：12个
    formalStimuli: [
        { name: "c20LL", correctKey: "V", url: "./videos/c20LL.mp4" },
        { name: "c20LR", correctKey: "V", url: "./videos/c20LR.mp4" },
        { name: "c20RL", correctKey: "B", url: "./videos/c20RL.mp4" },
        { name: "c20RR", correctKey: "B", url: "./videos/c20RR.mp4" },
        { name: "c30LL", correctKey: "V", url: "./videos/c30LL.mp4" },
        { name: "c30LR", correctKey: "V", url: "./videos/c30LR.mp4" },
        { name: "c30RL", correctKey: "B", url: "./videos/c30RL.mp4" },
        { name: "c30RR", correctKey: "B", url: "./videos/c30RR.mp4" },
        { name: "c40LL", correctKey: "V", url: "./videos/c40LL.mp4" },
        { name: "c40LR", correctKey: "V", url: "./videos/c40LR.mp4" },
        { name: "c40RL", correctKey: "B", url: "./videos/c40RL.mp4" },
        { name: "c40RR", correctKey: "B", url: "./videos/c40RR.mp4" },
    ],

    stage: "practice", // practice / formal1 / formal2
    currentTrial: 0,
    currentStimulus: null,

    keys: {
        judge: ["V", "B"],
        confidence: ["1","2","3","4"]
    },

    expData: [],
    trialTemp: {
        stimName: "",
        correctKey: "",
        key1: "", rt1: 0, status1: "", conf1: "", rt_conf1: 0,
        key2: "", rt2: 0, status2: "", conf2: "", rt_conf2: 0,
        completeTime: ""
    }
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
    $(document).off("keydown").on("keydown", function(e) {
        callback && callback(e);
    });
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
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
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

// 视频播放（修复速度变慢）
function playStimulusVideo(url, duration) {
    return new Promise((resolve, reject) => {
        if (!url) {
            alert("错误：未找到视频文件");
            reject();
            return;
        }
        const video = document.createElement("video");
        video.preload = "auto";
        video.playsInline = true;
        video.src = url;
        video.width = canvas.width;
        video.height = canvas.height;
        video.muted = true;
        video.style.display = "none";
        video.playbackRate = 1.0;

        video.addEventListener("canplaythrough", function() {
            video.play().then(() => {
                const drawFrame = () => {
                    if (!video.paused && !video.ended) {
                        ctx.clearRect(0,0,canvas.width,canvas.height);
                        ctx.drawImage(video,0,0,canvas.width,canvas.height);
                        requestAnimationFrame(drawFrame);
                    }
                };
                drawFrame();
                setTimeout(() => {
                    video.pause();
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    document.body.removeChild(video);
                    resolve();
                }, duration);
            }).catch(err => {
                alert("视频自动播放被阻止，请刷新");
                reject(err);
            });
        });
        video.addEventListener("error", () => {
            alert("视频加载失败：" + url);
            reject();
        });
        document.body.appendChild(video);
        video.load();
    });
}

// ===================== 试次执行 =====================
async function runSingleTrial() {
    let maxTrial, stimuliList;
    if (EXP_CONFIG.stage === "practice") {
        maxTrial = EXP_CONFIG.practiceTrialCount;
        stimuliList = EXP_CONFIG.practiceStimuli;
    } else if (EXP_CONFIG.stage === "formal1" || EXP_CONFIG.stage === "formal2") {
        maxTrial = EXP_CONFIG.formalTrialsPerRound;
        stimuliList = EXP_CONFIG.formalStimuli;
    } else {
        endExperiment();
        return;
    }

    if (EXP_CONFIG.currentTrial >= maxTrial) {
        showStageResult();
        return;
    }

    // 取刺激
    if (EXP_CONFIG.stage === "practice") {
        EXP_CONFIG.currentStimulus = stimuliList[EXP_CONFIG.currentTrial];
    } else {
        let key = "shuffled_" + EXP_CONFIG.stage;
        if (!EXP_CONFIG[key]) {
            let pool = [];
            for (let i = 0; i < 5; i++) {
                let s = [...stimuliList];
                for (let j = s.length-1; j>0; j--) {
                    let k = Math.floor(Math.random()*(j+1));
                    [s[j],s[k]] = [s[k],s[j]];
                }
                pool = pool.concat(s);
            }
            EXP_CONFIG[key] = pool;
        }
        EXP_CONFIG.currentStimulus = EXP_CONFIG[key][EXP_CONFIG.currentTrial];
    }

    EXP_CONFIG.trialTemp = {
        stimName: EXP_CONFIG.currentStimulus.name,
        correctKey: EXP_CONFIG.currentStimulus.correctKey,
        key1: "", rt1: 0, status1: "", conf1: "", rt_conf1: 0,
        key2: "", rt2: 0, status2: "", conf2: "", rt_conf2: 0,
        completeTime: getFormattedTime()
    };

    // ---------- 第一次流程 ----------
    $expContainer.css("display", "flex");
    drawFixPoint("#ff0000");
    await wait(EXP_CONFIG.fixPointTime1);
    clearCanvas();
    await wait(EXP_CONFIG.blankScreenTime);
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $expContainer.hide();

    const t1 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>请做第一次判断</h3><p>V 左有规律　B 右有规律</p>`, e => {
            const k = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(k)) {
                hideTextPanel();
                EXP_CONFIG.trialTemp.key1 = k;
                EXP_CONFIG.trialTemp.rt1 = Date.now() - t1;
                EXP_CONFIG.trialTemp.status1 = k === EXP_CONFIG.trialTemp.correctKey ? "CORRECT" : "INCORRECT";
                resolve();
            }
        });
    });

    const c1 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>信心评分</h3><p>1 完全没信心　2 不太有信心　3 比较有信心　4 非常有信心</p>`, e => {
            const k = e.key.toUpperCase();
            if (EXP_CONFIG.keys.confidence.includes(k)) {
                hideTextPanel();
                EXP_CONFIG.trialTemp.conf1 = k;
                EXP_CONFIG.trialTemp.rt_conf1 = Date.now() - c1;
                resolve();
            }
        });
    });

    // ---------- 第二次流程 ----------
    $expContainer.css("display", "flex");
    drawFixPoint("#fff");
    await wait(EXP_CONFIG.fixPointTime2);
    clearCanvas();
    await wait(EXP_CONFIG.blankScreenTime);
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $expContainer.hide();

    const t2 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>请做第二次判断</h3><p>V 左有规律　B 右有规律</p>`, e => {
            const k = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(k)) {
                hideTextPanel();
                EXP_CONFIG.trialTemp.key2 = k;
                EXP_CONFIG.trialTemp.rt2 = Date.now() - t2;
                EXP_CONFIG.trialTemp.status2 = k === EXP_CONFIG.trialTemp.correctKey ? "CORRECT" : "INCORRECT";
                resolve();
            }
        });
    });

    const c2 = Date.now();
    await new Promise(resolve => {
        showTextPanel(`<h3>信心评分</h3><p>1 完全没信心　2 不太有信心　3 比较有信心　4 非常有信心</p>`, e => {
            const k = e.key.toUpperCase();
            if (EXP_CONFIG.keys.confidence.includes(k)) {
                hideTextPanel();
                EXP_CONFIG.trialTemp.conf2 = k;
                EXP_CONFIG.trialTemp.rt_conf2 = Date.now() - c2;
                resolve();
            }
        });
    });

    // 保存数据
    EXP_CONFIG.expData.push({
        阶段: EXP_CONFIG.stage,
        被试姓名: EXP_CONFIG.subjectName,
        被试编号: EXP_CONFIG.subjectId,
        试次: EXP_CONFIG.currentTrial+1,
        刺激: EXP_CONFIG.trialTemp.stimName,
        正确键: EXP_CONFIG.trialTemp.correctKey,
        一按键: EXP_CONFIG.trialTemp.key1,
        一反应时: EXP_CONFIG.trialTemp.rt1,
        一结果: EXP_CONFIG.trialTemp.status1,
        一信心: EXP_CONFIG.trialTemp.conf1,
        一信时: EXP_CONFIG.trialTemp.rt_conf1,
        二按键: EXP_CONFIG.trialTemp.key2,
        二反应时: EXP_CONFIG.trialTemp.rt2,
        二结果: EXP_CONFIG.trialTemp.status2,
        二信心: EXP_CONFIG.trialTemp.conf2,
        二信时: EXP_CONFIG.trialTemp.rt_conf2,
        完成时间: EXP_CONFIG.trialTemp.completeTime
    });

    EXP_CONFIG.currentTrial++;
    runSingleTrial();
}

// ===================== 阶段结果 & 流程控制 =====================
function showStageResult() {
    let dataInStage = EXP_CONFIG.expData.filter(d => d.阶段 === EXP_CONFIG.stage);
    let correct = dataInStage.filter(d => d.一结果 === "CORRECT").length;
    let total = dataInStage.length;
    let acc = (correct / total * 100).toFixed(1);

    if (EXP_CONFIG.stage === "practice") {
        if (acc >= 60) {
            showTextPanel(`
                <h3>练习结束</h3>
                <p>第一次判断正确率：${acc}%</p>
                <p>合格！按 <strong>Q</strong> 进入正式实验第一轮</p>
            `, e => {
                if (e.key.toUpperCase() === "Q") {
                    hideTextPanel();
                    EXP_CONFIG.stage = "formal1";
                    EXP_CONFIG.currentTrial = 0;
                    runSingleTrial();
                }
            });
        } else {
            showTextPanel(`
                <h3>练习结束</h3>
                <p>第一次判断正确率：${acc}%</p>
                <p>未达标，请按 <strong>P</strong> 重新练习</p>
            `, e => {
                if (e.key.toUpperCase() === "P") {
                    hideTextPanel();
                    EXP_CONFIG.expData = EXP_CONFIG.expData.filter(d => d.阶段 !== "practice");
                    EXP_CONFIG.currentTrial = 0;
                    runSingleTrial();
                }
            });
        }
    } else if (EXP_CONFIG.stage === "formal1") {
        showTextPanel(`
            <h3>第一轮正式实验结束</h3>
            <p>正确率：${acc}%</p>
            <p>按 <strong>Q</strong> 进入第二轮</p>
        `, e => {
            if (e.key.toUpperCase() === "Q") {
                hideTextPanel();
                EXP_CONFIG.stage = "formal2";
                EXP_CONFIG.currentTrial = 0;
                runSingleTrial();
            }
        });
    } else if (EXP_CONFIG.stage === "formal2") {
        showTextPanel(`
            <h3>全部实验结束！</h3>
            <p>本轮正确率：${acc}%</p>
            <p>按任意键导出数据</p>
        `, () => {
            hideTextPanel();
            endExperiment();
        });
    }
}

// ===================== 实验结束 =====================
function endExperiment() {
    showTextPanel(`<h3>感谢参与！</h3><p>正在导出数据…</p>`, () => {
        exportCSV(EXP_CONFIG.expData, `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_点阵数据.csv`);
        $expContainer.hide();
        hideTextPanel();
    });
}

function exportCSV(data, filename) {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(d => Object.values(d).join(",")).join("\n");
    const csv = headers + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ===================== 启动 =====================
$(document).ready(async () => {
    const testVideo = document.createElement("video");
    testVideo.muted = true;
    testVideo.src = EXP_CONFIG.practiceStimuli[0].url;
    testVideo.play().then(()=>testVideo.pause()).catch(()=>{});

    $startBtn.click(() => {
        $startScreen.removeClass("show");
        showTextPanel(`
            <h3>欢迎参加实验</h3>
            <p>请判断：左边有规律按 V，右边有规律按 B</p>
            <p>每次判断后进行1‑4信心评分</p>
            <p>按<strong>空格键</strong>开始练习</p>
        `, e => {
            if (e.code === "Space") {
                hideTextPanel();
                runSingleTrial();
            }
        });
    });
});
