import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.jsoup.Connection;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class WebCrawler {

    private static List<String> path = new ArrayList<>();
    private static List<String> visited = new ArrayList<>();
    private static final String TARGET_WORD = "your_target_word";

    public static void main(String[] args) {
        String url = "https://youtube.com";
        crawl(1, url, path, visited);
    }

    private static void crawl(int level, String url, List<String> path, List<String> visited) {
        if (level <= 5){
            Document doc = request(url, path, visited);

            if (doc != null){
                for (Element link: doc.select("a[href]")){
                    String next_link = link.absUrl("href");
                    if (visited.contains(next_link) == false){
                        crawl(level++, next_link, path, visited);
                    }
                }
            }
        }
    }

    private static Document request(String url, List<String> path, List<String> visited) {
        try {
            Connection con = Jsoup.connect(url);
            Document document = con.get();
            if (con.response().statusCode() == 200){
                System.out.println("Link: " + url);
                System.out.println(document.title());
                analyzePage(document, url);
                visited.add(url);
                return document;
            }
            return null;
        } catch (IOException e) {
            System.err.println("Error connecting to " + url + ": " + e.getMessage());
            return null;
        }
    }

    private static void analyzePage(Document document, String url) {
        //path.add(url);

        // Examine text information on the page
        if (document.text().contains(TARGET_WORD)) {
            System.out.println("Target word found at: " + String.join(" -> ", path));
        }

        // Traverse through links
        Elements links = document.select("a[href]");
        // for (Element link : links) {
        //     String nextUrl = link.absUrl("href");
        //     if (!nextUrl.isEmpty() && !path.contains(nextUrl)) {
        //         crawl(nextUrl, );
        //     }
        // }

        // Traverse through buttons (You may need to adjust the selector based on the structure of the page)
        Elements buttons = document.select("button");
        for (Element button : buttons) {
            String buttonText = button.text();
            if (buttonText == TARGET_WORD){

            }
        }

        // Backtrack to the previous level after analyzing the current page
        path.remove(path.size() - 1);
    }
}