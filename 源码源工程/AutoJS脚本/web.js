function getPath(num_list) {
  /* 准备 api url 字符串 */
  let url = "47.93.197.229:12345/cal?array=[";
  /* 加一个数，加一个逗号 */
  for (let i = 0; i < 8; i++) {
    url += num_list[i] + ",";
  }
  /* 最后一个数后面不加逗号，直接补中括号 */
  url += num_list[8] + "]";
  /* 使用建立好的url发送get请求，将返回值保存为res */
  let res = http.get(url);
  /* 控制台打印 本次请求的数组信息 */
  console.log("8 >> ", num_list);
  // console.show();
  /* 获取 res 的返回体字符串并用JSON格式解析，然后拿到 path 这个键下的值 */
  let path = res.body.json().path;
  /* 弹出消息框，并同时在日志中打印得到的答案数组的信息 */
  toastLog(path);
  return path;
}
function get_group() {
  /* 定义数据结构，用于保存可点击位置的坐标 */
  function pp(ex, ey) {
    let out = {};
    out.x = ex;
    out.y = ey;
    return out;
  }
  /* 定义数组，用于存放坐标序列 */
  let group = [];

  className("android.widget.Image") /* autojs 操作，通过 安卓组件名 来定位组件 */
    .depth(21) /* autojs 操作，通过 深度限制 来定位组件 */
    .findOne() /* autojs 操作，找到这样的一个组件就返回（实际是找了一个华容道中的一个棋子） */
    .parent() /* autojs 操作，返回该组件的母组件，就得到了华容道的棋盘 */
    .children() /* autojs 操作，返回该组件的所有子组件，就得到了棋盘中的所有棋子 */
    .forEach((element) => {
      /* forEach 来遍历得到的所有棋子 */
      /* 但是只能遍历到8个棋子，因为有一个空位 */
      /* 获取棋子中心点的X轴坐标和Y轴坐标 */
      let to = pp(element.bounds().centerX(), element.bounds().centerY());
      /* 数据压入数组 */
      group.push(to);
      /* swipe 是滑动。如果在手机的开发人员选项中打开了“指针位置”，就能观测到程序在指定位置的模拟滑动 */
      // swipe(to.x - 100, to.y - 100, to.x + 100, to.y + 100, 200);
    });
  /* 用数学计算的方式得到空格位的中心点坐标 */
  let p_9_x = 2 * group[1].x - group[0].x;
  let p_9_y = 2 * group[3].y - group[0].y;
  /* 空格位坐标入栈 */
  group.push(pp(p_9_x, p_9_y));
  /* 控制台打印一下空格位坐标，表示坐标序列建立完毕 */
  console.log(pp(p_9_x, p_9_y));
  return group;
}
function user_input() {
  /* 从控制台读入，所以要先打开控制台悬浮窗 */
  console.show();
  /* 标记 读入是否成功 */
  let flag = 1;
  /* 定义数组，用于存放初始状态序列 */
  let num_list = [];
  do {
    /* 打印提示 */
    if (flag == 1) console.log("请输入一个 8 位数");
    else {
      console.log("输入有误，请再来一遍");
      flag = 1;
    }
    /* 读取输入到变量x */
    let x = console.input();
    /* 设定是一个八位数 */
    let size = 8;
    /* 定义数组——栈，用于存放各位上的数字 */
    let stack = [];
    while (size-- > 0) {
      /* 取当前数的个位数 */
      stack.push(x % 10);
      /* 当前数整除10 */
      x = Math.floor(x / 10);
    }
    /* 初始状态序列清空为新的空数组  */
    num_list = [];
    /* 计数器也重置为8 */
    size = 8;
    while (size-- > 0) {
      /* 从栈中逐个拿出数 来得到这个栈的逆序 */
      /* 读入 12345，则 stack 中是 5,4,3,2,1，而 num_list 中是 1,2,3,4,5 */
      num_list.push(stack.pop());
    }
    /* 补上一个空位 0（空位就是最后一个位置） */
    num_list.push(0);
    /* 输入合法性检验：如果这9个数有重复，或者不在 [0,8] 的范围内，则要求重新输入 */
    for (let i = 0; i < 9; i++) {
      for (let j = i + 1; j < 9; j++) {
        if (num_list[i] == num_list[j] || !(num_list[j] >= 0 && num_list[j] < 9)) {
          flag = 0;
        }
      }
    }
  } while (flag != 1);
  return num_list;
}
console.show();
/* 获取可点击坐标序列到数组 ui_table */
let ui_table = get_group();
/* 读入初始状态，并发送get请求，然后将答案保存至数组 path */
let path = getPath(user_input());
/* 关闭控制台窗口 */
console.hide();
for (let i = 0; i < path.length; i++) {
  /* 遍历答案数组，查 ui_table 获取索引值对应的点击位置 */
  let e = ui_table[path[i]];
  // toast("点击 x:" + e.x + " 点击 y:" + e.y);
  /* 点击点击位置 */
  click(e.x, e.y);
  // sleep(500);
}
/* 消息框弹出并同时日志打印 Over */
toastLog("Over");
/* 终止此次 auto.js 脚本运行 */
exit();
