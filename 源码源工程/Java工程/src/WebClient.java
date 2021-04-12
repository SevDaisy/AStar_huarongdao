import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

public class WebClient {

  public String go(String xmlInfo) throws UnknownHostException, IOException {
    /* 向服务器端发送请求，服务器IP地址和服务器监听的端口号 */
    Socket client = new Socket("localhost", 12345);

    /* 通过printWriter 来向服务器发送消息 */
    PrintWriter printWriter = new PrintWriter(client.getOutputStream());
    System.out.println("连接已建立...");

    /* 发送消息 */
    printWriter.println(xmlInfo);

    printWriter.flush();

    /* InputStreamReader是低层和高层串流之间的桥梁 */
    /* client.getInputStream()从Socket取得输入串流 */
    InputStreamReader streamReader = new InputStreamReader(
      client.getInputStream()
    );

    /* 链接数据串流，建立BufferedReader来读取，将 */
    /*BufferReader链接到InputStreamReder */
    BufferedReader reader = new BufferedReader(streamReader);
    String advice = reader.readLine();

    reader.close();
    client.close();
    return advice;
  }

  public static void main(String[] args)
    throws UnknownHostException, IOException {
    StringBuilder sb = new StringBuilder();
    sb.append("balabala");
    /* 提交请求 */

    String utf8 = new String(sb.toString().getBytes("UTF-8"));
    String unicode = new String(utf8.getBytes(), "UTF-8");
    String gbk = new String(unicode.getBytes("GB2312"));
    /* String xml = new String();/*GB18030 */
    WebClient c = new WebClient();
    String advice = c.go(gbk);
    System.out.println("接收到服务器的消息 ：" + advice);
  }
}
