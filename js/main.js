// ===================== 实验核心参数配置 =====================
const EXP_CONFIG = {
    subjectName: "",
    subjectId: "",
    trialCount: 16,
    fixPointTime: 500,
    videoPlayTime: 2500,
    responseTimeout: 10000,
    // 关键：视频路径改为本地相对路径（对应videos文件夹）
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
    currentStimulus: null,
    trialTemp: {
        stimName: "",
        correctKey: "",
        key1: "", rt1: 0, status1: "", conf1: "",
        key2: "", rt2: 0, status2: "", conf2: ""
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
        $startScreen.show();
    }
});

$subjectName.focus(() => $nameError.hide());
$subjectId.focus(() => $idError.hide());

// ===================== 核心函数 =====================
// 1. 显示文本面板
function showTextPanel(content, callback) {
    $panelContent.html(content);
    $textPanel.show();
    $(document).off("keydown").on("keydown", function(e) {
        callback && callback(e);
    });
}

// 2. 绘制注视点（红/白区分）
function drawFixPoint(color = "#fff") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    // 水平线
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - 20, canvas.height/2);
    ctx.lineTo(canvas.width/2 + 20, canvas.height/2);
    ctx.stroke();
    // 垂直线
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2 - 20);
    ctx.lineTo(canvas.width/2, canvas.height/2 + 20);
    ctx.stroke();
}

// 3. 播放视频刺激（修复undefined+本地路径兼容）
function playStimulusVideo(url, duration) {
    return new Promise((resolve, reject) => {
        // 核心兜底：防止URL为undefined
        if (!url || url === "undefined") {
            alert("错误：未找到视频文件，请联系实验者！");
            reject(new Error("视频URL未定义"));
            return;
        }

        const video = document.createElement("video");
        // 本地视频核心配置
        video.preload = "auto";
        video.playsInline = true; // 移动端必选
        video.src = url;
        video.width = canvas.width;
        video.height = canvas.height;
        video.muted = true; // 强制静音，避免自动播放限制
        video.style.display = "none";

        // 等待视频可完整播放后启动
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

                // 播放指定时长后清理
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

        // 视频加载失败提示（精准定位）
        video.addEventListener("error", function(err) {
            console.error("视频加载失败详情：", err);
            alert(`视频加载失败：${url}\n请确认网络正常并联系实验者！`);
            reject(err);
        });

        document.body.appendChild(video);
        video.load();
    });
}

// 4. 记录按键反应（判断/信心评分）
function recordResponse(isConfidence = false) {
    return new Promise(resolve => {
        let startTime = Date.now();
        let timeoutTimer = setTimeout(() => {
            $(document).off("keydown");
            resolve({ key: "超时", rt: EXP_CONFIG.responseTimeout, status: "INCORRECT" });
        }, EXP_CONFIG.responseTimeout);

        $(document).off("keydown").on("keydown", function(e) {
            clearTimeout(timeoutTimer);
            let key = e.key.toUpperCase();

            if (!isConfidence) {
                // 运动方向判断
                if (EXP_CONFIG.keys.judge.includes(key)) {
                    let rt = Date.now() - startTime;
                    let status = (key === EXP_CONFIG.trialTemp.correctKey) ? "CORRECT" : "INCORRECT";
                    resolve({ key, rt, status });
                }
            } else {
                // 信心评分
                if (EXP_CONFIG.keys.confidence.includes(key)) {
                    resolve({ key, rt: 0, status: "" });
                }
            }
        });
    });
}

// 5. 单个试次流程（核心逻辑）
async function runSingleTrial() {
    if (EXP_CONFIG.currentTrial >= EXP_CONFIG.trialCount) {
        endExperiment();
        return;
    }

    // 随机选择刺激（避免重复逻辑漏洞）
    const randomIdx = Math.floor(Math.random() * EXP_CONFIG.stimuli.length);
    EXP_CONFIG.currentStimulus = EXP_CONFIG.stimuli[randomIdx];
    EXP_CONFIG.trialTemp = {
        stimName: EXP_CONFIG.currentStimulus.name,
        correctKey: EXP_CONFIG.currentStimulus.correctKey,
        key1: "", rt1: 0, status1: "", conf1: "",
        key2: "", rt2: 0, status2: "", conf2: ""
    };

    // ========== 第一次判断流程 ==========
    $canvas.show();
    drawFixPoint("#ff0000"); // 红色注视点
    await new Promise(resolve => setTimeout(resolve, EXP_CONFIG.fixPointTime));
    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
    $canvas.hide();

    // 显示判断提示页
    showTextPanel(`<h3>请判断</h3><p>“F” 左侧有规律，“J” 右侧有规律</p>`, async (e) => {
        let key = e.key.toUpperCase();
        if (EXP_CONFIG.keys.judge.includes(key)) {
            $textPanel.hide();
            let response1 = await recordResponse(false);
            EXP_CONFIG.trialTemp.key1 = response1.key;
            EXP_CONFIG.trialTemp.rt1 = response1.rt;
            EXP_CONFIG.trialTemp.status1 = response1.status;

            // 第一次信心评分
            showTextPanel(`<h3>信心评分</h3>
                <p>1：非常不自信 &nbsp;&nbsp; 2：不自信</p>
                <p>3：有信心 &nbsp;&nbsp; 4：非常有信心</p>`, async (e) => {
                let confKey = e.key.toUpperCase();
                if (EXP_CONFIG.keys.confidence.includes(confKey)) {
                    $textPanel.hide();
                    EXP_CONFIG.trialTemp.conf1 = confKey;

                    // ========== 第二次判断流程 ==========
                    $canvas.show();
                    drawFixPoint("#ffffff"); // 白色注视点
                    await new Promise(resolve => setTimeout(resolve, EXP_CONFIG.fixPointTime));
                    await playStimulusVideo(EXP_CONFIG.currentStimulus.url, EXP_CONFIG.videoPlayTime);
                    $canvas.hide();

                    // 显示判断提示页
                    showTextPanel(`<h3>请判断</h3><p>“F” 左侧有规律，“J” 右侧有规律</p>`, async (e) => {
                        let key2 = e.key.toUpperCase();
                        if (EXP_CONFIG.keys.judge.includes(key2)) {
                            $textPanel.hide();
                            let response2 = await recordResponse(false);
                            EXP_CONFIG.trialTemp.key2 = response2.key;
                            EXP_CONFIG.trialTemp.rt2 = response2.rt;
                            EXP_CONFIG.trialTemp.status2 = response2.status;

                            // 第二次信心评分
                            showTextPanel(`<h3>信心评分</h3>
                                <p>1：非常不自信 &nbsp;&nbsp; 2：不自信</p>
                                <p>3：有信心 &nbsp;&nbsp; 4：非常有信心</p>`, async (e) => {
                                let confKey2 = e.key.toUpperCase();
                                if (EXP_CONFIG.keys.confidence.includes(confKey2)) {
                                    $textPanel.hide();
                                    EXP_CONFIG.trialTemp.conf2 = confKey2;

                                    // 保存当前试次数据
                                    EXP_CONFIG.expData.push({
                                        被试姓名: EXP_CONFIG.subjectName,
                                        被试编号: EXP_CONFIG.subjectId,
                                        试次: EXP_CONFIG.currentTrial + 1,
                                        刺激名称: EXP_CONFIG.trialTemp.stimName,
                                        正确按键: EXP_CONFIG.trialTemp.correctKey,
                                        第一次判断按键: EXP_CONFIG.trialTemp.key1,
                                        第一次反应时: EXP_CONFIG.trialTemp.rt1,
                                        第一次判断结果: EXP_CONFIG.trialTemp.status1,
                                        第一次信心评分: EXP_CONFIG.trialTemp.conf1,
                                        第二次判断按键: EXP_CONFIG.trialTemp.key2,
                                        第二次反应时: EXP_CONFIG.trialTemp.rt2,
                                        第二次判断结果: EXP_CONFIG.trialTemp.status2,
                                        第二次信心评分: EXP_CONFIG.trialTemp.conf2
                                    });

                                    // 进入下一试次
                                    EXP_CONFIG.currentTrial++;
                                    runSingleTrial();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// 6. 实验结束：导出数据（支持远程被试本地下载+自动提交，二选一）
function endExperiment() {
    // 计算正确率
    let correct1 = EXP_CONFIG.expData.filter(d => d.第一次判断结果 === "CORRECT").length;
    let correct2 = EXP_CONFIG.expData.filter(d => d.第二次判断结果 === "CORRECT").length;
    let acc1 = (correct1 / EXP_CONFIG.trialCount * 100).toFixed(1);
    let acc2 = (correct2 / EXP_CONFIG.trialCount * 100).toFixed(1);

    // 显示结束页面
    showTextPanel(`<h3>游戏完成！</h3>
        <p>感谢你的参与！</p>
        <p>第一次判断正确率：${acc1}%</p>
        <p>第二次判断正确率：${acc2}%</p>
        <p>按任意键导出数据并结束</p>`, () => {
        // 导出CSV（被试本地下载，需提醒被试发送给你）
        exportCSV(EXP_CONFIG.expData, `${EXP_CONFIG.subjectId}_${EXP_CONFIG.subjectName}_捕捉点阵游戏数据.csv`);
        // 重置实验（可选，远程被试无需重置）
        $canvas.hide();
        $textPanel.hide();
    });
}

// 7. CSV导出工具函数
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
    // 预加载第一个视频，触发浏览器播放权限
    const testVideo = document.createElement("video");
    testVideo.muted = true;
    testVideo.src = EXP_CONFIG.stimuli[0].url;
    testVideo.play().then(() => testVideo.pause()).catch(() => {
        alert("提示：浏览器正在初始化播放权限，点击“确定”继续即可！");
    });

    // 开始游戏按钮点击事件
    $startBtn.click(() => {
        $startScreen.hide();
        // 显示定制指导语
        showTextPanel(`<h3>欢迎参加捕捉点阵游戏！</h3><br>
            <p>你将看到两个点阵，其中一个点阵中有一部分点会规律水平运动（向左/向右），</p>
            <p>另一个点阵的点全部随机运动。请判断哪边点阵的点有规律运动。</p><br>
            <p><strong>左侧有规律按“F”键，右侧有规律按“J”键</strong></p><br>
            <p>判断后需对信心进行评分（1-4分）：</p>
            <p>1：非常不自信 &nbsp;&nbsp; 2：不自信</p>
            <p>3：有信心 &nbsp;&nbsp; 4：非常有信心</p><br><br>
            <p><strong>请按空格键继续</strong></p>`, (e) => {
            if (e.code === 'Space') {
                $textPanel.hide();
                runSingleTrial();
            }
        });
    });
});