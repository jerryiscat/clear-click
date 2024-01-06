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
    private static final String TARGET_WORD = "Nursing Home Locator";

    public static void main(String[] args) {
        String url = "https://www.wa.gov/";
        //visited.add(url);
        String domain = url.substring(12);
        crawl(1, url, domain, path, visited);
    }

    private static void crawl(int level, String url, String domain, List<String> path, List<String> visited) {
        if (level <= 3){
            try {
                Connection con = Jsoup.connect(url);
                Document document = con.get();
                if (con.response().statusCode() == 200){
                    System.out.println("Link: " + url);
                    // System.out.println(document.title());
                    visited.add(url);
                    analyzePage(document, url, domain, path, visited, level);
                    //System.out.println("Visited: "+ visited);
                    //return document;
                }
                //return null;
            } catch (IOException e) {
                System.err.println("Error connecting to " + url + ": " + e.getMessage());
                //return null;
            }
        }
    }

    // private static Document request(String url, List<String> path, List<String> visited) {
    //     try {
    //         Connection con = Jsoup.connect(url);
    //         Document document = con.get();
    //         if (con.response().statusCode() == 200){
    //             System.out.println("Link: " + url);
    //             System.out.println(document.title());
    //             analyzePage(document, url);
    //             visited.add(url);
    //             return document;
    //         }
    //         return null;
    //     } catch (IOException e) {
    //         System.err.println("Error connecting to " + url + ": " + e.getMessage());
    //         return null;
    //     }
    // }

    private static void analyzePage(Document document, String url, String domain, List<String> path, List<String> visited, int level) {
        path.add(url);

        // System.out.println("level: " + level);
        // System.out.println("curr url: " + url);
        // System.out.println("curr visited: " + visited.toString());
        // System.out.println("path: "+ path.toString());
        // System.out.println("domain: "+ domain);
        // System.out.println();

        // Examine text information on the page
        if (document.text().contains(TARGET_WORD)) {
            System.out.println("----------------------------------------------");
            System.out.println("----------------------------------------------");
            System.out.println("Target word found at: " + path.toString());
            System.out.println("----------------------------------------------");
            System.out.println("----------------------------------------------");
        }

        // Traverse through links
        Elements links = document.select("a[href]");
        for (Element link : links) {
            String linkText = link.text();
            if (linkText.equals(TARGET_WORD)) {
                System.out.println("----------------------------------------------");
                System.out.println("----------------------------------------------");
                System.out.println("Target word found at: " + path.toString());
                System.out.println("----------------------------------------------");
                System.out.println("----------------------------------------------");
            }
        }
        //     String nextUrl = link.absUrl("href");
        //     if (!nextUrl.isEmpty() && !path.contains(nextUrl)) {
        //         crawl(nextUrl, );
        //     }
        // }

        // Traverse through buttons (You may need to adjust the selector based on the structure of the page)
        Elements buttons = document.select("button");
        for (Element button : buttons) {
            String buttonText = button.text();
            if (buttonText.equals(TARGET_WORD)){
                System.out.println("----------------------------------------------");
                System.out.println("----------------------------------------------");
                System.out.println("Target word found at: " + path.toString());
                System.out.println("----------------------------------------------");
                System.out.println("----------------------------------------------");

            }
        }

        if (document != null){
            for (Element link: document.select("a[href]")){
                String next_link = link.absUrl("href");
                //System.out.println(next_link);
                if (visited.contains(next_link) == false ){ //&& next_link.contains(domain)){
                    //path.add(url);
                    crawl(level + 1, next_link, domain, path, visited);
                    //path.remove(path.size() - 1);

                } 
                
            }
        }
        
        // Backtrack to the previous level after analyzing the current page
        path.remove(path.size() - 1);
    }
}