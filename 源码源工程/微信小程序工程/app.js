//app.js
App({
    config: {
        host: 'http://39.97.161.172/'// 这个地方填写你的域名
        },
    onLaunch: function () {
        this.globalData = {}

        let that = this;
        wx.getSystemInfo({
            success(res) {
                that.windowWidth = res.windowWidth;
                that.windowHeight = res.windowHeight;
            }
        })
    }
})
