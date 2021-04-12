const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.src = "/audio/click.mp3";
function isGoal(data_, pos) {
	return data_[pos] && data_[pos].isEmpty;
}

Page({
	data: {
		windowWidth: app.windowWidth, // 屏幕宽度

		numData: [],
		m: "00", // 分
		s: "00", // 秒
		fm: ["60","60","60","60"],//最快纪录初始值
		fs: ["00","00","00","00"],
		step: 0, // 步数
		nowDifficultyDef: 3, // 默认当前难度系数 -- 注意这个值要和初始的 当前难度系数的值一样
		nowDifficulty: 3, // 当前难度系数 5*5 6*6 7*7
		maxDifficulty: 6, // 最大难度系数
	},

	onLoad() {
		this.initNum(this.data.nowDifficulty);
	},

	// 开始游戏
	isStart: false,
	goGame() {
		if (this.isStart) return;
		
		this.isStart = true;
		this.isPass = false;
		this.setData({
			m: "00",
			s: "00",
			step: 0,
		});
		this.disorganize(this.data.numData); // 随机打乱题目顺序
		this.countdown();
	},

	// 重置游戏
	reset() {
		this.isStart = false;
		this.isPass = false;
		this.initNum(this.data.nowDifficulty);
		clearInterval(this.timer);
		this.timer = null;
		this.time = 0;
	},

	// 游戏结束
	gameOver() {
		let m = this.data.m; ///
		let s = this.data.s; ///
		let numData = this.data.numData;
		// 如果最后一格为空的话 并且 倒数第二格值正确的话，再计算游戏是否结束
		let fm_path = "fm["+(this.data.nowDifficulty-3)+"]";
		let fs_path = "fs["+(this.data.nowDifficulty-3)+"]";
		let fm_val;
		let fs_val;
		if (numData[numData.length - 1].isEmpty &&numData[numData.length - 2].num==numData.length - 1) {
			let flg = true; // 是否结束
			for (let y in numData) {
				if (numData[y].num != parseInt(y) + 1) {
					flg = false;
					break;
				}
			}
			if (flg) {
				clearInterval(this.timer);
				this.timer = null;
				this.time = 0;
				this.isPass = true;
				this.isStart = false;
				wx.showModal({
					title: "提示",
					content: "您已过关啦！",
					showCancel: false,
				});
				if(this.data.fm[this.data.nowDifficulty-3]*60+this.data.fs[this.data.nowDifficulty-3]>=parseInt(m) *60+parseInt(s)){
					fm_val=m;
					fs_val=s;
				}else{
					fm_val=fm[this.data.fm[this.data.nowDifficulty-3]]
					fs_val=fs[this.data.fs[this.data.nowDifficulty-3]]
				}
				this.setData({
					[fm_path]:fm_val,
					[fs_path]:fs_val,
				});
			}
		}
	},

	// 移动算法
	isPass: false,
	goMove(e) {
		// 通关 或者 没开始游戏 就不能移动
		if (this.isPass || !this.isStart) return;

		let index = e.currentTarget.dataset.index,
			nowDifficulty = this.data.nowDifficulty,
			numData = this.data.numData,
			step = this.data.step;
			
		let flag = 0; // flag 表示有 flag 个格子即将被移动
		let x = [0, 0, 0, 0, 0, 0, 0]; // x[i] 表示第i个会被移动的格子所在的index值
		for (let i in numData) {
			if (index == i) {
				x = [0, 0, 0, 0, 0, 0, 0]; // 重写x数组为全零，防止被以前的数据污染
				for (let i = 1; i < nowDifficulty; i++) {
					// i 为可能被移动的格子的数量，空白格子不计数
					// 外循环用于遍历 i 相对于 nowDifficulty 的可能性
					for (let j = 1; j <= i; j++) {
						// 内循环用来遍历 j 相对于 i 的可能性
						if (isGoal(numData, index + j)) {
							// 如果判定 index + j 处为空格，那么，可以生成 x[j] 并终止循环
							// flag即会被移动的格子的数量，就是j
							flag = j;
							for (let k = 1; k <= j; k++) {
								x[k] = index + k;
							}
							break;
						} else if (isGoal(numData, index - j)) {
							flag = j;
							for (let k = 1; k <= j; k++) {
								x[k] = index - k;
							}
							break;
						} else if (isGoal(numData, index + j * nowDifficulty)) {
							flag = j;
							for (let k = 1; k <= j; k++) {
								x[k] = index + k * nowDifficulty;
							}
							break;
						} else if (isGoal(numData, index - j * nowDifficulty)) {
							flag = j;
							for (let k = 1; k <= j; k++) {
								x[k] = index - k * nowDifficulty;
							}
							break;
						}
					}
					// 如果flag已经不是零了，那么说明已经得到了格子移动的数组 x[]，终止循环
					if (flag != 0) break;
				}

				// 根据 flag 和 x[] 进行实际的移动
				if (flag == 0) {
					console.log("未触发移动");
					return;
				} else {
					// 检查移动是否是在 同一行/同一列
					console.log("\n\n", index, "\n");
					let mark; // 用于保存 校验特征 的变量
					let check_column = true; // 用于保存 校验结果 的变量
					mark = index % nowDifficulty; // 首先检查 列
					// 如果 会被移动的格子x[] 和 当前触摸的格子index 位于同一列，位置值 对 nowDifficulty 取余数 应该全部相等
					for (let i = 1; i < nowDifficulty; i++) {
						if (x[i] == 0) continue;
						console.log(x[i], "%", nowDifficulty, ":", x[i] % nowDifficulty);
						check_column = check_column && x[i] % nowDifficulty == mark;
					}

					mark = Math.floor(index / nowDifficulty); // 其次检查 行
					// 如果 会被移动的格子x[] 和 当前触摸的格子index 位于同一行，位置值 对 nowDifficulty 做整除 应该全部相等，Math.floor() 来向下取整，以得到整除的效果
					let check_row = true;
					for (let i = 1; i < nowDifficulty; i++) {
						if (x[i] == 0) continue;
						console.log(
							x[i],
							"/",
							nowDifficulty,
							":",
							Math.floor(x[i] / nowDifficulty)
						);
						check_row = check_row && Math.floor(x[i] / nowDifficulty) == mark;
					}

					console.log(
						"check_column is ",
						check_column,
						"check_row is ",
						check_row
					);
					if (!check_column && !check_row) return;
					// 移动使用 ES6 解构赋值
					switch (flag) {
						case 1:
							[numData[i], numData[x[1]]] = [numData[x[1]], numData[i]];
							break;
						case 2:
							[numData[i], numData[x[1]], numData[x[2]]] = [
								numData[x[2]],
								numData[i],
								numData[x[1]],
							];
							break;
						case 3:
							[numData[i], numData[x[1]], numData[x[2]], numData[x[3]]] = [
								numData[x[3]],
								numData[i],
								numData[x[1]],
								numData[x[2]],
							];
							break;
						case 4:
							[
								numData[i],
								numData[x[1]],
								numData[x[2]],
								numData[x[3]],
								numData[x[4]],
							] = [
								numData[x[4]],
								numData[i],
								numData[x[1]],
								numData[x[2]],
								numData[x[3]],
							];
							break;
						case 5:
							[
								numData[i],
								numData[x[1]],
								numData[x[2]],
								numData[x[3]],
								numData[x[4]],
								numData[x[5]],
							] = [
								numData[x[5]],
								numData[i],
								numData[x[1]],
								numData[x[2]],
								numData[x[3]],
								numData[x[4]],
							];
							break;
						case 6:
							[
								numData[i],
								numData[x[1]],
								numData[x[2]],
								numData[x[3]],
								numData[x[4]],
								numData[x[5]],
								numData[x[6]],
							] = [
								numData[x[6]],
								numData[i],
								numData[x[1]],
								numData[x[2]],
								numData[x[3]],
								numData[x[4]],
								numData[x[5]],
							];
							break;
						default:
							break;
					}
					step += 1;
					innerAudioContext.play(); // 播放移动效果的音乐
				}
			}
		}
		this.setData({ step, numData });
		this.gameOver();
	},

	// 初始化题目
	initNum(size) {
		let nowDifficulty = this.data.nowDifficulty,
			maxDifficulty = this.data.maxDifficulty;
		if (size >= nowDifficulty && size <= maxDifficulty) {
			let numData = [];
			for (let i = 1; i < size * size; i++) {
				numData.push({ num: i, isEmpty: false }); // isEmpty：当前这格是否为空
			}
			numData.push({ num: size * size, isEmpty: true });
			this.setData({
				m: "00",
				s: "00",
				step: 0,
				numData,
			});
		} else {
			console.error("初始化题目错误：难度超出限制大小");
		}
	},

	// 随机打乱题目顺序
	disorganize(numData) {
		let nowDifficulty = this.data.nowDifficulty;
		numData.sort(() => {
			return 0.5 - Math.random();
		}); // 随机打乱顺序
		while (!numData[numData.length - 1].isEmpty) {
			numData.sort(() => {
				return 0.5 - Math.random();
			}); // 当前空格在最后一位就退出循环
		}

		let num = 0;
		for (let i = 0; i < numData.length; i++) {
			for (let x = i + 1; x < numData.length; x++) {
				// 计算逆序数总的数量
				if (numData[i].num > numData[x].num) {
					num += 1;
				}
			}
		}

		// 逆序数的数量 必须为偶数才有解
		if (num % 2 == 0) {
			this.setData({ numData });
		} else {
			// 递归调用，直到逆序数的数量为偶数才终止
			this.disorganize(numData);
		}
	},

	// 定时器
	timer: null,
	time: 0,
	countdown() {
		let that = this;
		clearInterval(that.timer);
		that.timer = null;
		that.timer = setInterval(function () {
			that.time += 1;

			// 超过1小时，游戏也结束
			if (that.time > 3600) {
				clearInterval(that.timer);
				that.timer = null;
				that.time = 0;
				wx.showModal({
					title: "超时提示",
					content: "您的游戏时间已超时，请重新开始游戏",
					showCancel: false,
					success(res) {
						that.isPass = true;
						that.isStart = false;
						that.setData({
							m: "00",
							s: "00",
							step: 0,
						});
					},
				});
				return;
			}

			// 更新分、秒数
			if (that.time < 60) {
				that.setData({
					s: that.time < 10 ? "0" + that.time : that.time,
					m: "00",
				});
			} else {
				let mm = parseInt(that.time / 60);
				let ss = that.time - mm * 60;
				that.setData({
					m: mm < 10 ? "0" + mm : mm,
					s: ss < 10 ? "0" + ss : ss,
				});
			}
		}, 1000);
	},

	// 选择难度
	choose() {
		let that = this,
			nowDifficulty = this.data.nowDifficulty,
			nowDifficultyDef = this.data.nowDifficultyDef;
		wx.showActionSheet({
			itemList: ["3 × 3", "4 × 4", "5 × 5", "6 × 6"],
			success(res) {
				if (res.tapIndex + 3 != nowDifficulty) {
					that.setData({ nowDifficulty: res.tapIndex + nowDifficultyDef });
					that.reset();
				}
			},
		});
	},

	onShareAppMessage(e) {
		return {
			title: "《数字华容道》",
			path: "pages/index/index",
		};
	},
});