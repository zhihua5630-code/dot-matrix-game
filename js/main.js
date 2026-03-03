$startBtn.click(() => {
    $startScreen.removeClass("show");
    // 精简版：删除所有多余空行，仅保留必要内容换行
    showTextPanel(`<h3>欢迎参加捕捉点阵游戏！</h3>
    <p>你将看到两个点阵，其中一个点阵中有一部分点会规律水平运动（向左/向右），另一个点阵的点全部随机运动。请判断哪边点阵的点有规律运动。在每一轮里，你需要完成两次判断。</p>
    <img src="./image/dot-example.png" alt="点阵示意图" style="max-width: 45%; height: auto; margin: 5px auto; display: block; border: 1px solid #444;">
    <p>箭头代表点的运动方向（正式实验中没有箭头提示）。左侧代表点有规律的运动，右侧代表点无规律的运动。</p>
    <p style="background-color: yellow; color: black; padding: 4px; font-size: 15px; margin: 6px auto; max-width: 90%;"><strong>左侧有规律用右手食指按“V”键，右侧有规律用右手中指按“B”键</strong></p>
    <p>每次判断后，请告诉我，你觉得自己做对了吗？对自己做对的信心如何呢，请用左手食指按1-4键：</p>
    <div style="display: flex; justify-content: center; gap: 12px; font-size: 15px; margin: 3px 0; flex-wrap: wrap;">
        <span>1：😭 完全没信心</span>
        <span>2：🙁 不太有信心</span>
        <span>3：🙂 比较有信心</span>
        <span>4：😃 非常有信心</span>
    </div>
    <p>如果你理解了以上规则，请你将手指放到键盘对应的位置上</p>
    <p style="font-size: 17px; font-weight: bold;"><strong>请按空格键继续</strong></p>`, (e) => {
        if (e.code === 'Space') {
            hideTextPanel();
            runSingleTrial();
        }
    });
});
