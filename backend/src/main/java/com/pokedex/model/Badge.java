package com.pokedex.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "badges")
public class Badge {
    @Id
    private Integer id;
    private String name;
    private String type;
    private String leader;
    private String city;

    public Badge() {
    }

    public Badge(Integer id, String name, String type, String leader, String city) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.leader = leader;
        this.city = city;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLeader() { return leader; }
    public void setLeader(String leader) { this.leader = leader; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
