// ===================== 实验核心参数配置 =====================
const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    trialCount: 12,
    practiceTrialCount: 4,
    formalTrialsPerRound: 18,
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
    stimuli: [
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
    videoCache: {},
    totalFormalBlocks: 4,
    currentBlock: 1
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

// ===================== 视频预加载 =====================
async function preloadAllVideos() {
    const allVideos = [...EXP_CONFIG.practiceStimuli, ...EXP_CONFIG.formalStimuli];
    const uniqueUrls = [...new Set(allVideos.map(v => v.url))];
    for (const url of uniqueUrls) {
        const video = document.createElement("video");
        video.muted = true;
        video.preload = "auto";
        video.src = url;
        EXP_CONFIG.videoCache[url] = video;
        await new Promise(resolve => video.oncanplaythrough = resolve);
    }
}

// ===================== 缓存播放视频（完全兼容原版逻辑） =====================
function playStimulusVideo(url, duration) {
    return new Promise((resolve) => {
        const video = EXP_CONFIG.videoCache[url];
        if (!video) {
            alert("视频加载失败");
            resolve();
            return;
        }
        video.currentTime = 0;
        video.play();
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
            resolve();
        }, duration);
    });
}

// ===================== 上传一组数据并展示本组正确率 =====================
async function finishBlock() {
    const block = EXP_CONFIG.currentBlock;
    const total = EXP_CONFIG.expData.length;

    // 计算本组正确率
    const correct1 = EXP_CONFIG.expData.filter(d => d.第一次判断结果 === "CORRECT").length;
    const correct2 = EXP_CONFIG.expData.filter(d => d.第二次判断结果 === "CORRECT").length;
    const acc1 = total > 0 ? (correct1 / total * 100).toFixed(1) : "0.0";
    const acc2 = total > 0 ? (correct2 / total * 100).toFixed(1) : "0.0";
    
    // 先上传本组数据，成功后才继续
    const filename = `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_第${block}组.csv`;
    await uploadWithRetry(EXP_CONFIG.expData, filename);
    const savedMsg = `<p style="color:#4caf50">✅ 第 ${block} 组数据已保存成功（${total} 个试次）</p>`;

    // 先判断是否是最后一组
    if (block >= EXP_CONFIG.totalFormalBlocks) {
        showTextPanel(`
            <h3>游戏完成！</h3>
            <p>感谢你的参与！</p>
            ${savedMsg}
            <p>第一次判断正确率：${acc1}%</p>
            <p>第二次判断正确率：${acc2}%</p>
            <p>可以关闭页面了。</p>
        `);
        $expContainer.hide();
        return;
    }

    // 前1-3组：保存完成后再清空
    EXP_CONFIG.expData = [];

    // 展示本组正确率
    showTextPanel(`
        <h3>第 ${block} 组完成</h3>
        ${savedMsg}
        <p>第一次判断正确率：${acc1}%</p>
        <p>第二次判断正确率：${acc2}%</p>
        <p>休息一下，按空格键继续下一组</p>
    `, e => {
        if (e.code === "Space") {
            hideTextPanel();
            EXP_CONFIG.currentBlock++;
            EXP_CONFIG.currentTrial = 0;
            runSingleTrial();
        }
    });
}

// ===================== 阶段结果展示（100% 原版） =====================
function showStageResult() {
    let dataInStage = EXP_CONFIG.expData.filter(d => d.阶段 === EXP_CONFIG.stage);
    let correct1 = dataInStage.filter(d => d.第一次判断结果 === "CORRECT").length;
    let correct2 = dataInStage.filter(d => d.第二次判断结果 === "CORRECT").length;
    let total = dataInStage.length;
    let acc1 = total > 0 ? (correct1 / total * 100).toFixed(1) : "0.0";
    let acc2 = total > 0 ? (correct2 / total * 100).toFixed(1) : "0.0";

    let content = "";
    if (EXP_CONFIG.stage === "practice") {
        content = `<h3>练习阶段结束！</h3>
            <p>第一次判断正确率：${acc1}%</p>
            <p>第二次判断正确率：${acc2}%</p>`;
        if (acc1 >= 60) {
            content += `<p>恭喜你达到合格标准！请按 <strong>O</strong> 键进入正式实验</p>`;
        } else {
            content += `<p>正确率未达标，请按 <strong>P</strong> 键重新练习</p>`;
        }
    }
    $panelContent.html(content);
    $textPanel.css("display", "flex");
    $(document).off("keydown").on("keydown", function(e) {
        const key = e.key.toUpperCase();
        if (EXP_CONFIG.stage === "practice") {
            if (acc1 >= 60 && key === "O") {
                EXP_CONFIG.stage = "formal";
                EXP_CONFIG.currentTrial = 0;
                EXP_CONFIG.currentBlock = 1;
                $textPanel.hide();
                runSingleTrial();
            } else if (acc1 < 60 && key === "P") {
                EXP_CONFIG.currentTrial = 0;
                $textPanel.hide();
                runSingleTrial();
            }
        }
    });
}

// ===================== 【100% 还原你第二个原版】单个试次流程 =====================
async function runSingleTrial() {
    let maxTrials, currentStimuli;
    if (EXP_CONFIG.stage === "practice") {
        maxTrials = EXP_CONFIG.practiceTrialCount;
        currentStimuli = EXP_CONFIG.practiceStimuli;
    } else {
        maxTrials = EXP_CONFIG.formalTrialsPerRound;
        currentStimuli = EXP_CONFIG.formalStimuli;
    }

    if (EXP_CONFIG.stage === "formal" && EXP_CONFIG.currentTrial >= maxTrials) {
        await finishBlock();
        return;
    }

    if (EXP_CONFIG.currentTrial >= maxTrials) {
        showStageResult();
        return;
    }

    if (EXP_CONFIG.stage === "practice") {
        EXP_CONFIG.currentStimulus = currentStimuli[EXP_CONFIG.currentTrial];
    } else {
    let shuffledKey = `shuffled_formal`;
    if (!EXP_CONFIG[shuffledKey]) {
        // 生成 6 轮完整的 12 个刺激，共 72 试次
        let fullList = [];
        for (let r = 0; r < 6; r++) {
            fullList = fullList.concat(currentStimuli);
        }
        // 全局一次性打乱
        for (let i = fullList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [fullList[i], fullList[j]] = [fullList[j], fullList[i]];
        }
        EXP_CONFIG[shuffledKey] = fullList;
    }
    // 计算在全局 72 试次中的真实位置
    let globalIndex = (EXP_CONFIG.currentBlock - 1) * EXP_CONFIG.formalTrialsPerRound + EXP_CONFIG.currentTrial;
    EXP_CONFIG.currentStimulus = EXP_CONFIG[shuffledKey][globalIndex];
}

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

// ===================== 实验结束（100% 原版） =====================
//function endExperiment() {
    //let correct1 = EXP_CONFIG.expData.filter(d => d.第一次判断结果 === "CORRECT").length;
    //let correct2 = EXP_CONFIG.expData.filter(d => d.第二次判断结果 === "CORRECT").length;
    //let totalTrials = EXP_CONFIG.expData.length;
    //let acc1 = totalTrials > 0 ? (correct1 / totalTrials * 100).toFixed(1) : "0.0";
   // let acc2 = totalTrials > 0 ? (correct2 / totalTrials * 100).toFixed(1) : "0.0";

    //showTextPanel(`<h3>游戏完成！</h3>
        //<p>感谢你的参与！</p>
        //<p>第一次判断正确率：${acc1}%</p>
        //<p>第二次判断正确率：${acc2}%</p>
        //<p>按任意键导出数据并结束</p>`, () => {
        //exportCSV(EXP_CONFIG.expData, `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_捕捉点阵游戏数据.csv`);
        //$expContainer.hide();
        //hideTextPanel();
    //});
//}

// ===================== 【100% 和你图片一致】上传代码 =====================
function toCSV(data) {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(d => Object.values(d).join(",")).join("\n");
    return headers + "\n" + rows;
}

// 成功时正常返回；任何失败（断网、超时、HTTP 错误、后端返回失败）都会抛错
async function exportCSV(data, filename) {
    const csv = toCSV(data);

    // 15 秒没响应就当作超时
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch("https://xcx.51putong.com/upload-dot-csv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({csv, filename}),
            signal: controller.signal
        });

        // body 只能读一次：先读文本，再尝试解析成 JSON
        const text = await response.text();
        let result = text;
        try { result = JSON.parse(text); } catch (_) {}

        // 打印完整响应信息，方便排查
        console.log("📡 OSS上传接口响应状态:", response.status);
        console.log("📡 OSS上传接口返回数据:", result);

        // HTTP 状态码不在 200-299 之间算失败
        if (!response.ok) {
            const e = new Error(`HTTP ${response.status}: ${text}`);
            e.status = response.status;
            throw e;
        }

        // 后端返回 200 但内容里写着失败，也算失败（后端格式确定后可以改这里）
        if (result && typeof result === "object" &&
            (result.success === false || ("code" in result && result.code !== 0 && result.code !== 200))) {
            throw new Error(`服务器返回失败：${text}`);
        }

        console.log("✅ 数据已保存到阿里云OSS");
    } catch (err) {
        console.error("❌ 上传失败", err);
        if (err.name === "AbortError") throw new Error("请求超时");
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

// 把浏览器的报错翻译成被试能看懂的中文
function describeError(err) {
    if (!navigator.onLine) return "网络已断开，请检查网络连接";
    if (err.message === "请求超时") return "服务器响应超时（15秒），可能网络较慢";
    if (err.name === "TypeError") return "无法连接服务器（网络异常或服务器不可用）";
    if (err.status >= 500) return `服务器出错（错误码 ${err.status}）`;
    if (err.status >= 400) return `请求被服务器拒绝（错误码 ${err.status}）`;
    return err.message;
}

// 上传一组数据，只有成功才返回
// 失败时停在失败面板，按 R 重试
async function uploadWithRetry(data, filename) {
    const warnClose = e => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warnClose);

    try {
        while (true) {
            // 保存中：不传 callback，并解绑按键，防止被试误操作
            showTextPanel(`<h3>正在保存数据，请稍候…</h3><p>请不要关闭页面</p>`);
            $(document).off("keydown");

            try {
                await exportCSV(data, filename);
                return;
            } catch (err) {
                const detail = $("<div>").text(String(err.message).slice(0, 200)).html();
                await new Promise(resolve => {
                    showTextPanel(`
                        <h3 style="color:#f44336">❌ 数据上传失败</h3>
                        <p>原因：${describeError(err)}</p>
                        <p style="font-size:12px;color:#999">详细信息：${detail}</p>
                        <p>请检查网络后按 <strong>R</strong> 键重试，多次失败请联系主试</p>
                    `, e => {
                        if (e.code === "KeyR") resolve();
                    });
                });
            }
        }
    } finally {
        window.removeEventListener("beforeunload", warnClose);
    }
}

// ===================== 初始化（100% 原版） =====================
$(document).ready(async () => {
    const testVideo = document.createElement("video");
    testVideo.muted = true;
    testVideo.src = EXP_CONFIG.practiceStimuli[0].url;
    testVideo.play().then(()=>testVideo.pause()).catch(()=>{});

    $startBtn.click(async () => {
        $startScreen.removeClass("show");
        await preloadAllVideos();
        showTextPanel(`<h3>欢迎参加捕捉点阵游戏！</h3>
            <p>你将看到两个点阵，其中一个点阵中有一部分点有一致性运动，</p>
            <p>另一个点阵的点全部随机运动。请判断哪边点阵有一致性运动点。在每一轮里，你需要完成两次判断。</p><br>
            <img src="./image/dot-example.png" alt="点阵示意图" style="max-width: 80%; height: auto; margin: 5px auto; display: block;"><br>
            <p style="background-color: yellow; color: black; padding: 5px;"><strong>左侧点阵有一致性运动点按“V”键，右侧点阵有一致性运动点按“B”键</strong></p><br>
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
