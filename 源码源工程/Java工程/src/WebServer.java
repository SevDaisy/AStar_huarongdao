import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class WebServer {

  public static void main(String[] arg) throws Exception {
    /* 创建httpServer 绑定至 12345 端口 */
    HttpServer server = HttpServer.create(new InetSocketAddress(12345), 0);
    /* 如果接收到 /cal 的路由请求，则启动服务函数 */
    server.createContext("/cal", new AStatHandler());
    server.start();
  }

  static class AStatHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) {
      /* 准备一个 StringBuilder 用于生成 Respond Body 的 JSON字符串 */
      StringBuilder resBuilder = new StringBuilder("{\"path\":[");
      try {
        /* 获取 get 参数字符串，即，URL中，?号 后面的内容 */
        String queryString = exchange.getRequestURI().getQuery();
        System.out.println(queryString);
        /* 协定格式是 /cal?array=[1,2,3,4,5,6,7,8,0], 取字串 1,2,3,4,5,6,7,8,0 */
        queryString = queryString.substring(7, queryString.length() - 1);
        int[] input = new int[10];
        int i = -1;
        int zeroPos = -1;
        for (String s : queryString.split(",")) {
          i++;
          input[i] = Integer.parseInt(s);
          if (input[i] == 0)
            zeroPos = i;
        }
        System.out.println("收到请求：" + queryString);
        /* 解析出get参数中的数组，作为参数传递给求解程序 bfsHash(int[],int) */
        Object[] answer = new Astar_HRD().bfsHash(input, zeroPos);
        /* 遍历得到的答案数组，添加进 StringBuilder */
        for (Object k : answer) {
          resBuilder.append((int) k + ",");
        }
        resBuilder.deleteCharAt(resBuilder.length() - 1);/* 删去多余的一个,逗号字符 */
        resBuilder.append("]}");/* 为JSON格式封上后面的括号 */
        System.out.println("答案已生成");
        exchange.sendResponseHeaders(200, 0);
        OutputStream os = exchange.getResponseBody();
        /* 将JSON格式字符串写入http响应体 */
        os.write(resBuilder.toString().getBytes());
        /* 关闭连接 */
        os.close();
      } catch (IOException ie) {
      } catch (Exception e) {
      }
    }
  }
}