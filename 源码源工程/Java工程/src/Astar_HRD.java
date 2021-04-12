import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;

class Node implements Comparable<Node> {
  static int difficulty = 3;
  static int level = 9;
  static int[] goal;
  static int[][] moveAble;
  static LinkedList<Integer> nowPath; // 用于记录当前路径，只需要保存按顺序点击的节点就好了

  int[] nums;
  int step; // g(n)
  int cost; // f(n)
  int zeroPos;
  LinkedList<Integer> movedPath;

  public static void setDifficulty(int n) {
    Node.difficulty = n;
    Node.level = n * n;
    Node.goal = new int[Node.level];
    for (int i = 0; i < Node.level - 1; i++) {
      Node.goal[i] = i + 1;
      // System.out.printf(" %d,", i);
    }
    Node.goal[Node.level - 1] = 0;
    if (n == 3) {
      moveAble = new int[][] { { 1, 3, -1, -1 }, { 0, 2, 4, -1 }, { 1, 5, -1, -1 }, { 0, 4, 6, -1 }, { 1, 3, 5, 7 },
          { 2, 4, 8, -1 }, { 3, 7, -1, -1 }, { 4, 6, 8, -1 }, { 5, 7, -1, -1 }, };
    } else if (n == 4) {
      moveAble = new int[][] { { 1, 4, -1, -1 }, { 0, 2, 5, -1 }, { 1, 3, 6, -1 }, { 2, 7, -1, -1 }, { 0, 5, 8, -1 },
          { 1, 4, 6, 9 }, { 2, 5, 7, 10 }, { 3, 6, 11, -1 }, { 4, 9, 12, -1 }, { 5, 8, 10, 13 }, { 6, 9, 11, 14 },
          { 7, 10, 15, -1 }, { 8, 13, -1, -1 }, { 9, 12, 14, -1 }, { 10, 13, 15, -1 }, { 11, 14, -1, -1 }, };
    } else if (n == 5) {
      moveAble = new int[][] { { 1, 5, -1, -1 }, { 0, 2, 6, -1 }, { 1, 3, 7, -1 }, { 2, 4, 8, -1 }, { 3, 9, -1, -1 },
          { 0, 6, 10, -1 }, { 1, 5, 7, 11 }, { 2, 6, 8, 12 }, { 3, 7, 9, 13 }, { 4, 8, 14, -1 }, { 5, 11, 15, -1 },
          { 6, 10, 12, 16 }, { 7, 11, 13, 17 }, { 8, 12, 14, 18 }, { 9, 13, 19, -1 }, { 10, 16, 20, -1 },
          { 11, 15, 17, 21 }, { 12, 16, 18, 22 }, { 13, 17, 19, 23 }, { 14, 18, 24, -1 }, { 15, 21, -1, -1 },
          { 16, 20, 22, -1 }, { 17, 21, 23, -1 }, { 18, 22, 24, -1 }, { 19, 23, -1, -1 }, };
    } else
      moveAble = new int[][] { {} };
  }

  @Override
  public int compareTo(Node o) {
    return (this.cost - o.cost);
  }

  public static Node copy(Node x) {
    Node out = new Node(new int[Node.level], x.step, x.zeroPos);
    for (int i = 0; i < Node.level; i++) {
      out.nums[i] = x.nums[i];
    }
    return out;
  }

  public Node(int[] nums, int step, int zeroPos) {
    this.movedPath = new LinkedList<Integer>();
    this.nums = nums;
    this.step = step;
    this.zeroPos = zeroPos;
    this.setCost();
  }

  public void setCost() {
    int c = 0;
    for (int i = 0; i < Node.level; i++) {
      if (nums[i] != goal[i]) {
        c++; // 这是最简单，效果中等的函数
      }
      // this.cost /* f(n) */ = /* g(n) */ step + /* h(n) */c;
      this.cost /* f(n) */ = /* g(n)step + */ /* h(n) */c;
    }
  }

  public Node setPath(LinkedList<Integer> path) {
    this.movedPath = new LinkedList<Integer>();
    for (Integer k : path) {
      this.movedPath.add(k);
    }
    return this;
  }

  public static String arrayToString(int[] x) {
    StringBuilder sb = new StringBuilder();
    for (int k : x) {
      sb.append(k).append('-');
    }
    return sb.toString();
  }

  public static void swap(Node x, int a, int b) {
    int[] ops = x.nums;
    int k = ops[a];
    ops[a] = ops[b];
    ops[b] = k;
  }
}

public class Astar_HRD {

  public Object[] bfsHash(int[] start, int zeroPos) {
    Node.setDifficulty(4);
    int[][] moveAble = Node.moveAble;
    Map<String, Boolean> myMap = new HashMap<String, Boolean>(); // 用于检查这个节点是不是见过 —— 单调性保证了见过的节点不用再看
    Queue<Node> que = new PriorityQueue<>(); // 优先队列 —— 用于遍历的主体储存器
    String goal_code = Node.arrayToString(Node.goal);
    que.add(new Node(start, 0, zeroPos));
    myMap.put(Node.arrayToString(start), true);
    do {
      Node e = que.poll();
      int pos = e.zeroPos;
      for (int i = 0; i < 4; i++) {
        Node ie = Node.copy(e);
        Node.nowPath = new LinkedList<Integer>();
        Node.nowPath.addAll(e.movedPath);
        if (moveAble[pos][i] != -1) {
          Node.swap(ie, pos, moveAble[pos][i]);
          Node.nowPath.add(moveAble[pos][i]);
          // if (Node.check(ie,moveAble[pos][i])) continue;
          String k = Node.arrayToString(ie.nums);
          if (k.equals(goal_code)) {
            System.out.printf("size: %d > %s\n", myMap.size(), k);
            return Node.nowPath.toArray();
          }
          if (!myMap.containsKey(k)) {
            que.add(new Node(ie.nums, e.step + 1, moveAble[pos][i]).setPath(Node.nowPath));
            // System.out.println("k is "+k);
            myMap.put(k, true);
            // System.out.printf("size: %d > %s\n", myMap.size(), k);
          }
        }
      }
    } while (!que.isEmpty());
    return null;
  }

  public static void main(String[] args) {
    System.out.println();
    long start = System.currentTimeMillis();
    Object[] answer = new Astar_HRD().bfsHash(new int[] { 10, 2, 14, 15, 6, 9, 4, 13, 12, 1, 5, 11, 3, 8, 7, 0 }, 15);
    System.out.println("steps total len is " + answer.length);
    System.out.printf("耗时 %.3f 秒\n", (System.currentTimeMillis() - start) / 1000.0);
    // for (Object k : answer) { System.out.println((int) k);}
  }
}
