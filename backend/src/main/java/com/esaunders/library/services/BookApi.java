package com.esaunders.library.services;

import java.net.URI;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;

/**
 * Searches a web API of given Book title for information of that Book
 * 
 * @author Ethan Saunders
 */
@Component
public class BookApi {

    /**
     * Gets url using Book's title and reads through the JSON for specific information
     * @param search Title of Book
     * @return String array with Book's information
     */
    public static String[] searchBook(String search) {

        try {
            search = search.replace(" ", "+");
            System.out.println(search);
            String s = "https://openlibrary.org/search.json?q=" + search;
            URI u = new URI(s);
            URL url = u.toURL();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()))) {
                String json = reader.lines().collect(Collectors.joining());

                JsonFactory factory = new JsonFactory();
                JsonParser parser = factory.createParser(json);
                String[] info = new String[2];

                while (parser.nextToken() != JsonToken.END_OBJECT) {
                    String fieldName = parser.currentName();

                    if("docs".equals(fieldName)) {
                        parser.nextToken();
                    }
                    if ("first_publish_year".equals(fieldName)) {
                        parser.nextToken();
                        info[0] = parser.getValueAsString();
                        parser.nextToken();
                    }
                }

                return info;
            } 

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
