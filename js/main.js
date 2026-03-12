// ===================== 实验核心参数配置 =====================
const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    trialCount: 12,
    // 新增：练习相关配置
    practiceTrialCount: 4,
    formalTrialsPerRound: 60, // 12个×5遍
    stage: "practice", // practice / formal1 / formal2
    // 新增：拆分练习/正式刺激
    practiceStimuli: [
        { name: "c30LL", correctKey: "V", url: "./videos/c30LL.mp4" },
        { name: "c30LR", correctKey: "V", url: "./videos/c30LR.mp4" },
        { name: "c30RL", correctKey: "B", url: "./videos/c30RL.mp4" },
        { name: "c30RR", correctKey: "B", url: "./videos/c30RR.mp4" },
    ],
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

    fixPointTime1: 1500,    // 第一次红色注视点时长（1500ms）
    fixPointTime2: 500,     // 第二次白色注视点时长（500ms）
    blankScreenTime: 100,   // 空屏时长（100ms）
    videoPlayTime: 2500,    // 视频播放时长（2500ms）
    responseTimeout: 10000,
    stimuli: [
        { name: "c20LL", correctKey: "V", url: "./videos/c20LL.mp4" },  // F→V
        { name: "c20LR", correctKey: "V", url: "./videos/c20LR.mp4" },  // J→B
        { name: "c20RL", correctKey: "B", url: "./videos/c20RL.mp4" },  // F→V
        { name: "c20RR", correctKey: "B", url: "./videos/c20RR.mp4" },  // J→B
        { name: "c30LL", correctKey: "V", url: "./videos/c30LL.mp4" },  // F→V
        { name: "c30LR", correctKey: "V", url: "./videos/c30LR.mp4" },  // J→B
        { name: "c30RL", correctKey: "B", url: "./videos/c30RL.mp4" },  // F→V
        { name: "c30RR", correctKey: "B", url: "./videos/c30RR.mp4" },  // J→B
        { name: "c40LL", correctKey: "V", url: "./videos/c40LL.mp4" },  // F→V
        { name: "c40LR", correctKey: "V", url: "./videos/c40LR.mp4" },  // J→B
        { name: "c40RL", correctKey: "B", url: "./videos/c40RL.mp4" },  // F→V
        { name: "c40RR", correctKey: "B", url: "./videos/c40RR.mp4" },  // J→B
        //{ name: "c80LL", correctKey: "V", url: "./videos/c80LL.mp4" },  // F→V
       // { name: "c80LR", correctKey: "B", url: "./videos/c80LR.mp4" },  // J→B
       // { name: "c80RL", correctKey: "V", url: "./videos/c80RL.mp4" },  // F→V
       // { name: "c80RR", correctKey: "B", url: "./videos/c80RR.mp4" },  // J→B
    ],
    keys: {
        judge: ["V", "B"],  // F/J→V/B
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
        completeTime: "" // 新增：试次完成实时时间
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
// 1. 显示文本面板
function showTextPanel(content, callback) {
    $panelContent.html(content);
    $textPanel.css("display", "flex");
    $(document).off("keydown").on("keydown", function(e) {
        callback && callback(e);
    });
}

// 2. 隐藏文本面板
function hideTextPanel() {
    $textPanel.hide();
    $(document).off("keydown");
}

// 3. 绘制注视点（固定尺寸，不拉伸）
function drawFixPoint(color = "#fff") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // 水平线
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.stroke();
    // 垂直线
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 20);
    ctx.stroke();
}

// 4. 清空画布（空屏用）
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 5. 等待函数（精准延迟）
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

// 新增：获取格式化的实时时间（YYYY-MM-DD HH:mm:ss）
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

// 6. 播放视频刺激（等比显示，不拉伸）
function playStimulusVideo(url, duration) {
    return new Promise((resolve, reject) => {
        if (!url || url === "undefined") {
            alert("错误：未找到视频文件，请联系实验者！");
            reject(new Error("视频URL未定义"));
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
        // ✅ 强制浏览器全速播放，不压慢速度
        video.playbackRate = 1.0;

        video.addEventListener("canplaythrough", function() {
            video.play().then(() => {
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
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    document.body.removeChild(video);
                    resolve();
                }, duration);
            }).catch(err => {
                console.error("视频播放失败：", err);
                alert("视频自动播放被阻止，请使用Chrome浏览器并刷新页面！");
                reject(err);
            });
        });

        video.addEventListener("error", function(err) {
            console.error("视频加载失败详情：", err);
            alert(`视频加载失败：${url}\n请确认网络正常并联系实验者！`);
            reject(err);
        });

        document.body.appendChild(video);
        video.load();
    });
}

// 新增：阶段结果展示函数（修复Q/P键无响应问题）
function showStageResult() {
    let dataInStage = EXP_CONFIG.expData.filter(d => {
        if (EXP_CONFIG.stage === "practice") {
            return d.刺激名称.includes("c30");
        } else {
            return true;
        }
    });
    let correct1 = dataInStage.filter(d => d.第一次判断结果 === "CORRECT").length;
    let total = EXP_CONFIG.stage === "practice" ? EXP_CONFIG.practiceTrialCount : EXP_CONFIG.formalTrialsPerRound;
    let acc1 = (correct1 / total * 100).toFixed(1);

    let content = "";
    if (EXP_CONFIG.stage === "practice") {
        content = `<h3>练习阶段结束！</h3>
            <p>第一次判断正确率：${acc1}%</p>`;
        if (acc1 >= 60) {
            content += `<p>恭喜你达到合格标准！请按 <strong>Q</strong> 键进入正式实验第一轮</p>`;
        } else {
            content += `<p>正确率未达标，请按 <strong>P</strong> 键重新练习</p>`;
        }
    } else if (EXP_CONFIG.stage === "formal1") {
        content = `<h3>正式实验第一轮结束！</h3>
            <p>第一次判断正确率：${acc1}%</p>
            <p>请按 <strong>Q</strong> 键进入第二轮</p>`;
    } else if (EXP_CONFIG.stage === "formal2") {
        content = `<h3>正式实验全部结束！</h3>
            <p>第一次判断正确率：${acc1}%</p>
            <p>按任意键导出数据并结束任务</p>`;
    }

    showTextPanel(content, async (e) => {
        // ✅ 核心修复：同时兼容 e.key 和 e.code，确保Q/P键100%识别
        let key = e.key.toUpperCase();
        let code = e.code.toUpperCase();
        
        if (EXP_CONFIG.stage === "practice") {
            // 练习阶段：Q进正式 / P重练
            if (acc1 >= 60 && (key === "Q" || code === "KEYQ")) {
                EXP_CONFIG.stage = "formal1";
                EXP_CONFIG.currentTrial = 0;
                hideTextPanel();
                runSingleTrial();
            } else if (acc1 < 60 && (key === "P" || code === "KEYP")) {
                EXP_CONFIG.currentTrial = 0;
                EXP_CONFIG.expData = EXP_CONFIG.expData.filter(d => !d.刺激名称.includes("c30"));
                hideTextPanel();
                runSingleTrial();
            }
        } else if (EXP_CONFIG.stage === "formal1") {
            // 正式第一轮：Q进第二轮
            if (key === "Q" || code === "KEYQ") {
                EXP_CONFIG.stage = "formal2";
                EXP_CONFIG.currentTrial = 0;
                hideTextPanel();
                runSingleTrial();
            }
        } else if (EXP_CONFIG.stage === "formal2") {
            // 正式第二轮：任意键导出数据
            hideTextPanel();
            endExperiment();
        }
    });
}

// 7. 单个试次流程（完整：方向+信心评分反应时+实时完成时间）
async function runSingleTrial() {
    // 判断当前阶段
    let maxTrials, currentStimuli;
    if (EXP_CONFIG.stage === "practice") {
        maxTrials = EXP_CONFIG.practiceTrialCount;
        currentStimuli = EXP_CONFIG.practiceStimuli;
    } else if (EXP_CONFIG.stage === "formal1" || EXP_CONFIG.stage === "formal2") {
        maxTrials = EXP_CONFIG.formalTrialsPerRound;
        currentStimuli = EXP_CONFIG.formalStimuli;
    } else {
        endExperiment();
        return;
    }

    if (EXP_CONFIG.currentTrial >= maxTrials) {
        showStageResult();
        return;
    }

    // 刺激选择逻辑
    if (EXP_CONFIG.stage === "practice") {
        // 练习阶段：固定c30的4个视频
        EXP_CONFIG.currentStimulus = currentStimuli[EXP_CONFIG.currentTrial];
    } else {
        // 正式阶段：12个视频随机重复5次
        let shuffledKey = `shuffled_${EXP_CONFIG.stage}`;
        if (!EXP_CONFIG[shuffledKey]) {
            EXP_CONFIG[shuffledKey] = [];
            // 生成5次随机序列
            for (let i = 0; i < 5; i++) {
                let shuffled = [...currentStimuli];
                for (let j = shuffled.length - 1; j > 0; j--) {
                    let k = Math.floor(Math.random() * (j + 1));
                    [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
                }
                EXP_CONFIG[shuffledKey] = EXP_CONFIG[shuffledKey].concat(shuffled);
            }
        }
        EXP_CONFIG.currentStimulus = EXP_CONFIG[shuffledKey][EXP_CONFIG.currentTrial];
    }

    EXP_CONFIG.trialTemp = {
        stimName: EXP_CONFIG.currentStimulus.name,
        correctKey: EXP_CONFIG.currentStimulus.correctKey,
        key1: "", rt1: 0, status1: "", conf1: "", rt_conf1: 0,
        key2: "", rt2: 0, status2: "", conf2: "", rt_conf2: 0,
        completeTime: ""
    };

    // ========== 第一次判断流程（精准时序） ==========
    $expContainer.css("display", "flex");
    // 1. 红色注视点：1500ms
    drawFixPoint("#ff0000");
    await wait(EXP_CONFIG.fixPointTime1);
    
    // 2. 空屏：100ms
    clearCanvas();
    await wait(EXP_CONFIG.blankScreenTime);
    
    // 3. 视频播放：2500ms
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $expContainer.hide();

    // 显示第一次判断提示页，并记录开始时间
    const judgeStartTime1 = Date.now();
    await new Promise(resolve => {
        // 修改：第一次判断标题+VB键提示
        showTextPanel(`<h3>请做第一次判断</h3><p>“V” 左侧有规律，“B” 右侧有规律</p>`, async (e) => {
            let key = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(key)) {
                hideTextPanel();
                // 计算方向判断反应时
                let rt1 = Date.now() - judgeStartTime1;
                let status1 = (key === EXP_CONFIG.trialTemp.correctKey) ? "CORRECT" : "INCORRECT";
                EXP_CONFIG.trialTemp.key1 = key;
                EXP_CONFIG.trialTemp.rt1 = rt1;
                EXP_CONFIG.trialTemp.status1 = status1;
                resolve();
            }
        });
    });

    // 显示第一次信心评分，并记录开始时间
    const confStartTime1 = Date.now();
    await new Promise(resolve => {
        // 修改：信心评分排成一行
        showTextPanel(`<h3>信心评分</h3>
            <p>判断后请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
            <p>1：😭 完全没信心 &nbsp;&nbsp; 2：🙁 不太有信心 &nbsp;&nbsp; 3：🙂 比较有信心 &nbsp;&nbsp; 4：😃 非常有信心</p>`, async (e) => {
            let confKey = e.key.toUpperCase();
            if (EXP_CONFIG.keys.confidence.includes(confKey)) {
                hideTextPanel();
                // 计算信心评分反应时
                let rt_conf1 = Date.now() - confStartTime1;
                EXP_CONFIG.trialTemp.conf1 = confKey;
                EXP_CONFIG.trialTemp.rt_conf1 = rt_conf1;
                resolve();
            }
        });
    });

    // ========== 第二次判断流程（精准时序） ==========
    $expContainer.css("display", "flex");
    // 1. 白色注视点：500ms
    drawFixPoint("#ffffff");
    await wait(EXP_CONFIG.fixPointTime2);
    
    // 2. 空屏：100ms
    clearCanvas();
    await wait(EXP_CONFIG.blankScreenTime);
    
    // 3. 视频播放：2500ms
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $expContainer.hide();

    // 显示第二次判断提示页，并记录开始时间
    const judgeStartTime2 = Date.now();
    await new Promise(resolve => {
        // 修改：第二次判断标题+VB键提示
        showTextPanel(`<h3>请做第二次判断</h3><p>“V” 左侧有规律，“B” 右侧有规律</p>`, async (e) => {
            let key2 = e.key.toUpperCase();
            if (EXP_CONFIG.keys.judge.includes(key2)) {
                hideTextPanel();
                // 计算第二次方向判断反应时
                let rt2 = Date.now() - judgeStartTime2;
                let status2 = (key2 === EXP_CONFIG.trialTemp.correctKey) ? "CORRECT" : "INCORRECT";
                EXP_CONFIG.trialTemp.key2 = key2;
                EXP_CONFIG.trialTemp.rt2 = rt2;
                EXP_CONFIG.trialTemp.status2 = status2;
                resolve();
            }
        });
    });

    // 显示第二次信心评分，并记录开始时间
    const confStartTime2 = Date.now();
    await new Promise(resolve => {
        // 修改：信心评分排成一行
        showTextPanel(`<h3>信心评分</h3>
            <p>判断后请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
            <p>1：😭 完全没信心 &nbsp;&nbsp; 2：🙁 不太有信心 &nbsp;&nbsp; 3：🙂 比较有信心 &nbsp;&nbsp; 4：😃 非常有信心</p>`, async (e) => {
            let confKey2 = e.key.toUpperCase();
            if (EXP_CONFIG.keys.confidence.includes(confKey2)) {
                hideTextPanel();
                // 计算第二次信心评分反应时
                let rt_conf2 = Date.now() - confStartTime2;
                EXP_CONFIG.trialTemp.conf2 = confKey2;
                EXP_CONFIG.trialTemp.rt_conf2 = rt_conf2;
                
                // 新增：记录当前试次完成的实时时间
                EXP_CONFIG.trialTemp.completeTime = getFormattedTime();
                resolve();
            }
        });
    });

    // 保存当前试次数据（包含实时完成时间）
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
        试次完成实时时间: EXP_CONFIG.trialTemp.completeTime // 新增列
    });

    // 进入下一试次
    EXP_CONFIG.currentTrial++;
    runSingleTrial();
}

// 8. 实验结束：导出数据
function endExperiment() {
    let correct1 = EXP_CONFIG.expData.filter(d => d.第一次判断结果 === "CORRECT").length;
    let correct2 = EXP_CONFIG.expData.filter(d => d.第二次判断结果 === "CORRECT").length;
    // 修复：计算正确率时用总试次数，而非固定12
    let totalTrials = EXP_CONFIG.expData.length;
    let acc1 = totalTrials > 0 ? (correct1 / totalTrials * 100).toFixed(1) : "0.0";
    let acc2 = totalTrials > 0 ? (correct2 / totalTrials * 100).toFixed(1) : "0.0";

    showTextPanel(`<h3>游戏完成！</h3>
        <p>感谢你的参与！</p>
        <p>第一次判断正确率：${acc1}%</p>
        <p>第二次判断正确率：${acc2}%</p>
        <p>按任意键导出数据并结束</p>`, () => {
        exportCSV(EXP_CONFIG.expData, `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_捕捉点阵游戏数据.csv`);
        $expContainer.hide();
        hideTextPanel();
    });
}

// 9. CSV导出工具函数
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

// ===================== 实验初始化 =====================
$(document).ready(async () => {
    // 预加载第一个视频
    const testVideo = document.createElement("video");
    testVideo.muted = true;
    testVideo.src = EXP_CONFIG.practiceStimuli[0].url;
    testVideo.play().then(() => testVideo.pause()).catch(() => {
        alert("提示：浏览器正在初始化播放权限，点击“确定”继续即可！");
    });

    // 开始游戏按钮点击事件
    $startBtn.click(() => {
        $startScreen.removeClass("show");
        // 仅修改：点阵示意图上下空行（margin: 5px auto），其余内容完全保留最初版本
        showTextPanel(`<h3>欢迎参加捕捉点阵游戏！</h3>
            <p>你将看到两个点阵，其中一个点阵中有一部分点会规律水平运动（向左/向右），</p>
            <p>另一个点阵的点全部随机运动。请判断哪边点阵的点有规律运动。在每一轮里，你需要完成两次判断。</p><br>
            <!-- 仅修改图片margin，减少上下空行 -->
            <img src="./image/dot-example.png" alt="点阵示意图" style="max-width: 80%; height: auto; margin: 5px auto; display: block;"><br>
            <p>箭头代表点的运动方向（正式实验中没有箭头提示）。</p>
            <p>左侧代表点有规律的运动，右侧代表点无规律的运动。</p><br>
            <p style="background-color: yellow; color: black; padding: 5px;"><strong>左侧有规律用右手食指按“V”键，右侧有规律用右手中指按“B”键</strong></p><br>
            <p>每次判断后，请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
            <p>1：😭 完全没信心 &nbsp;&nbsp; 2：🙁 不太有信心 &nbsp;&nbsp; 3：🙂 比较有信心 &nbsp;&nbsp; 4：😃 非常有信心</p><br>
            <p>如果你理解了以上规则，请你将手指放到键盘对应的位置上</p>
            <p><strong>请按空格键继续</strong></p>`, (e) => {
            if (e.code === 'Space') {
                hideTextPanel();
                runSingleTrial();
            }
        });
    });
});
